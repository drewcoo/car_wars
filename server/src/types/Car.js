import uuid from 'uuid/v4'
import _ from 'lodash'
import Dice from '../utils/Dice'
import { INCH } from '../utils/constants'
import Log from '../utils/Log'
import Point from '../utils/geometry/Point'
import Rectangle from '../utils/geometry/Rectangle'

import Control from '../gameServerHelpers/Control'
import Collisions from '../gameServerHelpers/Collisions'
import PhasingMove from '../gameServerHelpers/PhasingMove'
import Targets from '../gameServerHelpers/Targets'
import Time from '../gameServerHelpers/Time'
import Weapon from '../gameServerHelpers/Weapon'

import { typeDef as DesignTypes } from './vehicle/Design'
import { DATA,  matchCars } from '../DATA'

DATA.cars = []

import { players } from './Player'

import { Design as DesignData } from '../vehicleDesigns/KillerKart'
const fillDesign = (designName) => {
  return _.cloneDeep(DesignData)
}

// why is there a collisionDetected bool if there's a collisions array?
// color is dupe of player color!
// MAneuvers is an enum
// attribute strings are enums

// BUGBUG
//
// non-required fields in Collison should be req'd
// need to define damage from walls
//
// related: both cars and walls should be "game objects" in the same pool,
// so that rammed can be rammedId instead of holding an optional rect
//

export const typeDef = `
  extend type Mutation {
    createCar(name: String!, playerId: ID!, designName: String!): Car
    doMove(id: ID!, maneuver: String!, howFar: Int!): Int
    fireWeapon(
      id: ID!,
      targetId: ID!,
      targetName: String!,
      targetX: Float!,
      targetY: Float!
    ): ID
    ghostMoveForward(id: ID!): Int
    ghostMoveHalfForward(id: ID!): Int
    ghostMoveDrift(id: ID!, direction: String!): Int
    ghostManeuverNext(id: ID!): Int
    ghostManeuverPrevious(id: ID!): Int
    ghostManeuverSet(id: ID!, maneuverIndex: Int!): Int
    ghostMoveReset(id: ID!): Int
    ghostShowCollisions(id: ID!): Int
    ghostMoveBend(id: ID!, degrees: Int!): Int
    ghostMoveSwerve(id: ID!, degrees: Int!): Int
    setCarPosition(id: ID!, rect: InputRectangle): Rectangle
    setSpeed(id: ID!, speed: Int!): Int!
    setTarget(id: ID!, targetIndex: Int!): Int!
    setWeapon(id: ID!, weaponIndex: Int!): Int!
    addModal(id: ID!, text: String!): Modal
    popModal(id: ID!): Modal
  }

  extend type Query {
    car(id: ID!): Car
    cars: [Car]
    driver(carId: ID!): CrewMember
    modals(carId: ID!): [Modal]
  }

  type Car {
    id: ID!
    currentMatch: ID
    collisionDetected: Boolean!
    collisions: [Collision]
    color: String
    design: Design!
    log: [String]
    modals: [Modal]
    name: String!
    phasing: Phasing!
    playerId: ID
    rect: Rectangle
    status: Status
  }

  type Collision {
    damage: String
    damageModifier: Float
    handlingStatus: Int
    newSpeed: Int
    rammed: ID
    rammedBy: ID
    type: String!
  }

  ${DesignTypes}

  type Modal {
    text: String
  }

  type NextMove {
    fishtailDistance: Int!
    maneuver: String
    maneuverDirection: Float
    maneuverDistance: Int!
    spinDirection: String
  }

  type Phasing {
    collisionDetected: Boolean!
    collisions: [Collision]
    damage: [Damage]
    difficulty: Int
    maneuverIndex: Int
    rect: Rectangle
    speedChangeIndex: Int
    speedChanges: [String]
    controlChecksForSpeedChanges: [ControlChecks]
    targetIndex: Int!
    targets: [Target]
    weaponIndex: Int
  }

  type ControlChecks {
    speed: Int
    checks: [String]
  }

  type Damage {
    display: Point
    message: String
  }

  type Status {
    killed: Boolean
    handling: Int!
    lastDamageBy: [ID!]
    maneuvers: [String!]
    nextMove: [NextMove]
    speed: Int!
    speedChangedThisTurn: Boolean
  }

  union PointOrSegment = Point | Segment

  type Target {
    carId: ID!
    name: String!
    location: PointOrSegment!
    displayPoint: Point!
  }

  input InputTarget {
    carId: ID!
    targetId: ID!
    targetName: String!
    targetX: Float!
    targetY: Float!
  }
`

const damageAllTires = ({ car, damage }) => {
  car.design.components.tires.forEach(tire => {
    if (tire.damagePoints <= 0) { return }
    tire.damagePoints -= damage
    if (tire.damagePoints <= 0) {
      tire.damagePoints = 0
      // Still have wheels!
      car.design.handlingClass -= 2
      // BUGBUG: Handlng roll if lose tire(s)
    }
  })
}

const rehydrateCar = ({ id }) => {
  let result = DATA.cars.find(el => el.id === id)
  if (result.phasing.rect) {
    result.phasing.rect = new Rectangle(result.phasing.rect) || null
  }
  result.rect = new Rectangle(result.rect) || null
  return result
}

const outerGhostReset = ({ id }) => {
  let car = rehydrateCar({ id })
  PhasingMove.reset({ car })
}

const outerGhostHalfForward = ({ id }) => {
  let car = rehydrateCar({ id })
  let distance = INCH / 2
  // is this needed?
  car = PhasingMove.center({ car })
  car.phasing.rect = PhasingMove.forward({ car, distance })
}

const outerGhostForward = ({ id }) => {
  let car = DATA.cars.find(el => el.id === id)
  // is this needed?
  car = PhasingMove.center({ car })
  car.phasing.rect = PhasingMove.forward({ car })
}

const outerGhostShowCollisions = ({ id }) => {
  const thisCar = DATA.cars.find(el => el.id === id)
  //
  // BUGBUG: Problems:
  // 1. I don't like the way walls are handled. I'd like to put all "collidable
  //    things" in an array and walk through them.
  // 2. Only finds collisions where bounding lines cross/connect. That means
  //    even if #1 adds humans (1/4"x1/2") they may be contained in the
  //    bounding rectangle of the car and not detected.
  // 3. Because of the way this is tracked, we can move *through* a collision
  //    state and not end in one. That's a bug.
  // 4. Doesn't stop at time of collision to determine where the cars go.
  // 5. Doesn't consider the type of collision. That will matter when
  //    damage is assessed when the move is accepted.
  // 6. Others?
  //
  const match = DATA.matches.find(match => match.id === thisCar.currentMatch)
  const cars = DATA.cars.filter(car => match.carIds.includes(car.id))
  Collisions.detect({ cars, map: match.map, thisCar })
}

const showHideCar = (car, manIdxDelta) => {
  var index = (car.phasing.maneuverIndex + manIdxDelta) %
               car.status.maneuvers.length
  if (car.status.maneuvers[index] === 'none') {
    outerGhostReset({ id: car.id })
  } else if (car.status.maneuvers[index] === 'half') {
    outerGhostHalfForward({ id: car.id })
  } else {
    outerGhostForward({ id: car.id })
  }
  outerGhostShowCollisions({ id: car.id })
}

export const resolvers = {
  Query: {
    car: (parent, args, context) =>  {
      return DATA.cars.find(el => el.id === args.id)
    },
    cars: () =>  {
      return DATA.cars
    },
    driver: (parent, args, context) =>  {
      let car = DATA.cars.find(el => el.id === args.carId)
      return car.design.components.crew.find(member => member.role === 'driver')
    },
    modals: (parent, args, context) =>  {
      let car = DATA.cars.find(el => el.id === args.carId)
      return car.modals
    },
  },
  Mutation: {
    createCar: (parent, args, context) => {
      let player = DATA.players.find(el => el.id === args.playerId)
      let design = fillDesign(args.designName)
      let newCar = {
        id: uuid(),
        currentMatch: null,
        collisionDetected: false,
        collisions: [],
        color: player.color,
        design: design,
        log: [],
        modals: [],
        name: args.name,
        playerId: player.id,
        phasing: {
          collisionDetected: false,
          collisions: [],
          controlChecksForSpeedChanges: [],
          damage: [{
              display: null,
              message: ''
          }],
          difficulty: 0,
          maneuverIndex: 0,
          rect: null,
          speedChangeIndex: 0,
          speedChanges: [],
          targetIndex: 0, // don't hard-code here
          targets: [],
          weaponIndex: 0, // needed for targets (refresh)
        },
        status: {
          handling: design.attributes.handlingClass,
          killed: false,
          lastDamageBy: [],
          maneuvers: ['forward', 'bend', 'drift', 'swerve'],
          nextMove: [],
          speed: 0,
          speedChangedThisTurn: false,
        }
      }

      let speed = 40
      newCar.status.speed = speed
      newCar.phasing.speedChanges = PhasingMove.possibleSpeedsWithoutUsingACar({
        currentSpeed: speed,
        topSpeed: design.attributes.topSpeed,
        acceleration: design.attributes.acceleration,
        canAccelerate: true,
        canBrake: true
      })
      newCar.phasing.speedChangeIndex = newCar.phasing.speedChanges.indexOf(speed)
      newCar.phasing.controlChecksForSpeedChanges = newCar.phasing.speedChanges.map(spd => {
        return { speed: spd, checks: Control.row({ speed: spd })}
      })

      DATA.cars.push(newCar)
      return newCar
    },
    doMove: (parent, args, context) => {
      let car = DATA.cars.find(el => el.id === args.id)
      Log.info('', car)
      Log.info(car.status.maneuvers[car.phasing.maneuverIndex], car)
      let newSpeed = car.phasing.speedChanges[car.phasing.speedChangeIndex]
      Log.info(`${car.status.speed} -> ${newSpeed}`, car)
      if (newSpeed != car.status.speed) {
        Log.info(`speed change: ${car.status.speed}MPH -> ${newSpeed}MPH`)
        car.status.speedChangedThisTurn = true
        car.status.speed = newSpeed
      }
      Log.info('did it move?', car)
      if (!PhasingMove.hasMoved({ car })) { return }
      Log.info('collisions?', car)
      for (let coll of car.phasing.collisions) {
        Collisions.resolve({ car, collision: coll })
      }
      if (car.status.nextMove.length > 0) {
        forcedManeuver = car.status.nextMove.shift()
        if (forcedManeuver.maneuver === 'skid' ||
            forcedManeuver.maneuver === 'controlledSkid') {
          Log.info(`I AM SKIDDING ${forcedManeuver.maneuverDistance / INCH} INCHES!!!`, car)
          car.rect = car.phasing.rect
          // deal with the damage, handling rolls, etc.
          if (forcedManeuver.maneuverDistance > INCH) {
            throw new Error(`We don't do a ${forcedManeuver.maneuverDistance}" skid!`)
          }
          if (forcedManeuver.maneuverDistance > INCH * 3 /4) { // 1" skid
            damageAllTires({ car, damage: 2 })
            if (forcedManeuver.maneuver = 'controlledSkid') {
              // aimed weapons fire prohibited for the rest of the turn,
              car.status.speed -= 10
              forcedManeuver.maneuver = null
              forcedManeuver.maneuverDirection = null
              forcedManeuver.maneuverDistance = 0
            } else {
              // No further aimed weapon fire permitted from this vehicle this turn
              car.status.speed -= 20
              forcedManeuver.maneuver = 'skid'
              forcedManeuver.maneuverDirection = car.rect.facing
              forcedManeuver.maneuverDistance = INCH / 2
            }
          } else if (forcedManeuver.maneuverDistance > INCH / 2) { // 3/4" skid
            damageAllTires({ car, damage: 1 })
            car.status.speed -= 5
            if (forcedManeuver.maneuver = 'controlledSkid') {
              // -6 to aimed weapons fire
              forcedManeuver.maneuver = null
              forcedManeuver.maneuverDirection = null
              forcedManeuver.maneuverDistance = 0
            } else {
              // -6 to aimed weapons fire
              forcedManeuver.maneuver = 'skid'
              forcedManeuver.maneuverDirection = car.rect.facing
              forcedManeuver.maneuverDistance = INCH / 4
            }
          } else if (forcedManeuver.maneuverDistance > INCH / 4) { // 1/2" skid
            forcedManeuver.maneuver = null
            forcedManeuver.maneuverDirection = null
            forcedManeuver.maneuverDistance = 0
            car.status.speed -= 5
            if (forcedManeuver.maneuver = 'controlledSkid') {
              // −3 to aimed weapons fire
            } else {
              // -6 to aimed weapons fire
            }
          } else if (forcedManeuver.maneuverDistance > 0) { // 1/4" skid
            forcedManeuver.maneuver = null
            forcedManeuver.maneuverDirection = null
            forcedManeuver.maneuverDistance = 0
            if (forcedManeuver.maneuver = 'controlledSkid') {
              // -1 to aimed weapons fire
            } else {
              // -3 to aimed weapons fire
            }
          } else {
            throw new Error(`We don't do a ${forcedManeuver.maneuverDistance}" skid!`)
          }
        }
      }
      Log.info(`base HC: ${car.design.attributes.handlingClass}`, car)
      Log.info(`initial HC: ${car.status.handling}`, car)
      Log.info(`difficulty: D${car.phasing.difficulty}`, car)
      car.status.handling -= car.phasing.difficulty
      if (car.status.handling < -6) { car.status.handling = -6 }
      Log.info(`maneuver check: ${Control.maneuverCheck({ car })}`, car)
      // BUGBUG: HANDLING ROLL NOW IF CHANGED!
      Log.info(`current HC: ${car.status.handling}`, car)
      car.rect = car.phasing.rect.clone()
      PhasingMove.reset({ car })
      let match = DATA.matches.find(match => match.id === car.currentMatch)
      let cars = DATA.cars.filter(car => match.carIds.includes(car.id))
      Collisions.clear({ cars })
      Time.nextMover({ match })
      let oldCar = DATA.cars.find(oldCar => oldCar.id === car.id)
      /*
const match = state[action.payload.matchId]
const car = match.cars[action.payload.id]

// BUGBUG: We shouldn't allow other actions (firing) from the
// nom-final position.
/// /////////////////////////////////////

//  Speeds.setSpeed({ car })
// Speeds.setPossibleAndIndex({ car })

/// /////////////////////////////////////


//  const targets = new Targets({ car, cars: state, map: state[matchId].map })
//  targets.refresh()
/// ////
// BUGBUG: once per turn at and of turn instead:
for (const Car of Object.values(match.cars)) {
  Car.design.components.crew.driver.firedThisTurn = false
  for (const Weapon of Car.design.components.weapons) {
    Weapon.firedThisTurn = false
  }
}
/// ////
*/
      return
    },
    ghostManeuverNext: (parent, args, context) => {
      const thisCar = DATA.cars.find(el => el.id === args.id)
      const match = DATA.matches.find(match => match.id === thisCar.currentMatch)
      const cars = DATA.cars.filter(car => match.carIds.includes(car.id))
      showHideCar(thisCar, 1)
      thisCar.phasing.maneuverIndex = (thisCar.phasing.maneuverIndex + 1) % thisCar.status.maneuvers.length
      Collisions.detect({ cars, map: match.map, thisCar })
      return thisCar.phasing.maneuverIndex
    },
    ghostManeuverPrevious: (parent, args, context) => {
      let thisCar = DATA.cars.find(el => el.id === args.id)
      const match = DATA.matches.find(match => match.id === thisCar.currentMatch)
      const cars = DATA.cars.filter(car => match.carIds.includes(car.id))
      showHideCar(thisCar, -1)
      thisCar.phasing.maneuverIndex = (thisCar.phasing.maneuverIndex - 1 + thisCar.status.maneuvers.length) % thisCar.status.maneuvers.length
      Collisions.detect({ cars, map: match.map, thisCar })
      return thisCar.phasing.maneuverIndex
    },
    ghostManeuverSet: (parent, args, context) => {
      let thisCar = DATA.cars.find(el => el.id === args.id)
      const match = DATA.matches.find(match => match.id === thisCar.currentMatch)
      const cars = DATA.cars.filter(car => match.carIds.includes(car.id))
      showHideCar(thisCar, args.maneuverIndex - thisCar.phasing.maneuverIndex)
      thisCar.phasing.maneuverIndex = parseInt(args.maneuverIndex)
      Collisions.detect({ cars, map: match.map, thisCar })
      return args.maneuverIndex
    },
    ghostMoveForward: (parent, args, context) => {
      outerGhostForward({ id: args.id })
      return
    },
    ghostMoveHalfForward: (parent, args, context) => {
      outerGhostHalfForward({ id: args.id })
      return
    },
    ghostMoveDrift: (parent, args, context) => {
      let car = DATA.cars.find(el => el.id === args.id)
      const match = DATA.matches.find(match => match.id === car.currentMatch)
      const cars = DATA.cars.filter(car => match.carIds.includes(car.id))
      const distance = (args.direction === 'right') ? INCH / 4 : -INCH / 4
      car.phasing.rect = PhasingMove.drift({ car, distance })
      const targets = new Targets({ car, cars, map: match.map })
      targets.refresh()
    },
    ghostMoveReset: (parent, args, context) => {
      let car = DATA.cars.find(el => el.id === args.id)
      showHideCar(car, 0)
      return
    },
    ghostShowCollisions: (parent, args, context) => {
      outerGhostShowCollisions({ id: args.id })
      return
    },
    ghostMoveBend: (parent, args, context) => {
      let car = DATA.cars.find(el => el.id === args.id)
      const match = DATA.matches.find(match => match.id === car.currentMatch)
      const cars = DATA.cars.filter(car => match.carIds.includes(car.id))
      const degrees = args.degrees
      car.phasing.rect = PhasingMove.bend({ car, degrees })
      const targets = new Targets({ car, cars, map: match.map })
      targets.refresh()
      return
    },
    ghostMoveSwerve: (parent, args, context) => {
      let car = DATA.cars.find(el => el.id === args.id)
      const match = DATA.matches.find(match => match.id === car.currentMatch)
      const cars = DATA.cars.filter(car => match.carIds.includes(car.id))
      const degrees = args.degrees
      car.phasing.rect = PhasingMove.swerve({ car, degrees })
      const targets = new Targets({ car, cars, map: match.map })
      targets.refresh()
      return
    },

    setCarPosition: (parent, args, context) => {
      let car = DATA.cars.find(el => el.id === args.id)
      car.rect = args.rect
      return car.rect
    },
    setSpeed: (parent, args, context) => {
      console.log('set speed')
      let car = DATA.cars.find(el => el.id === args.id)
      let driver = car.design.components.crew.find(member => member.role === 'driver')

      if(driver.damagePoints < 2 ||
         car.status.speedChangedThisTurn ||
         (car.design.components.powerPlant.damagePoints < 1 &&
          Math.abs(args.speed) > Math.abs(car.status.speed) )) {
        // driver unconscious or dead
        return car.status.speed
      }
      let topSpeed = car.design.attributes.topSpeed
      if (args.speed < -topSpeed/5 ||
          args.speed > topSpeed) {
        throw new Error(`Excessive speed: ${args.speed}`)
      }

      // BUGBUG: Check for Excessive speed change.
      // BUGBUG: Check for "going through 0" without stopping.

      car.phasing.speedChangeIndex = car.phasing.speedChanges.indexOf(args.speed)
      if (-1 === car.phasing.speedChangeIndex) {
        throw new Error(`Speed ${args.speed} not in array ${car.phasing.speedChanges}`)
      }
      car.status.controlChecks = Control.row({ speed: args.speed })
      return args.speed
    },
    setTarget: (parent, args, content) => {
      let car = DATA.cars.find(el => el.id === args.id)
      if (args.targetIndex < 0 ||
          args.targetIndex >= car.phasing.targets.length) {
            throw new Error(`Target index out of range: ${args.targetIndex}`)
          }
      car.phasing.targetIndex = args.targetIndex
      return args.targetIndex
    },
    setWeapon: (parent, args, content) => {
      let car = DATA.cars.find(el => el.id === args.id)
      if (args.weaponIndex < 0 ||
          args.weaponIndex >= car.design.components.weapons.length) {
            throw new Error(`Weapon index out of range: ${args.weaponIndex}`)
          }

      car.phasing.weaponIndex = args.weaponIndex
      car.phasing.targets = [] // default targ list ==== empty
      car.phasing.targetIndex = 0

      let crewMemberCanFire = car.design.components.crew.find(crewMember => {
        return crewMember.damagePoints > 1 && !crewMember.firedThisTurn
      })
      let weapon = car.design.components.weapons[car.phasing.weaponIndex]
      let weaponCanFire = weapon.damagePoints > 0 &&
                          (weapon.ammo > 0 || (weapon.requiresPlant && car.design.components.powerPlant.damagePoints > 0)) &&
                          !weapon.firedThisTurn
      if (crewMemberCanFire && weaponCanFire) {
        let match = DATA.matches.find(el => el.id === car.currentMatch)
        let cars  = matchCars({ match })
        let map = match.map
        let targets = new Targets({ car, cars, map })
        car.phasing.targets = targets.targetsInArc()
        car.phasing.targetIndex = 0 // BUGBUG: set to last target fired at?
      }

      return args.weaponIndex
    },
    fireWeapon: (parent, args, content) => {
      let car = DATA.cars.find(el => el.id === args.id)
      Log.info('fire!', car)
      if (!Weapon.passFiringChecks({ car })) {
        car.phasing.damage[0].display = null
        car.phasing.damage[0].message = ''
        Log.info('cannot fire', car)
        return
      }

      let weapon = Weapon.itself({ car })
      const toHit = Dice.roll('2d')

      // BUGBUG - where are the modifiers???
      // Calculate server side for here and also for Reticle.jsx

      Log.info(`toHit: ${weapon.toHit} - roll is ${toHit}; damage: ${weapon.damage}`, car)
      let damage = (toHit >= weapon.toHit) ? Dice.roll(weapon.damage) : 0
      weapon.ammo--
      car.design.components.crew.find(member => member.role === 'driver').firedThisTurn = true
      weapon.firedThisTurn = true

      const targetCar = DATA.cars.find(car => args.targetId === car.id)

      Log.info(`shot ${targetCar.color}'s ${args.targetName} with ${weapon.abbreviation}:${weapon.location} for ${damage} damage`, car)
      Weapon.dealDamage({
        by: car,
        car: targetCar,
        damage: damage,
        location: args.targetName
      })

      car.phasing.damage[0].display = new Point({
        x: args.targetX,
        y: args.targetY
      })
      car.phasing.damage[0].message = damage
      return
    },
    addModal: (parent, args, context) => {
      let car = DATA.cars.find(el => el.id === args.id)
      let newModal = { text: args.text }
      car.modals.push({ text: args.text })
      return newModal
    },
    popModal: (parent, args, context) => {
      let car = DATA.cars.find(el => el.id === args.id)
      let result = car.modals.pop()
      return result
    },
  }
}
