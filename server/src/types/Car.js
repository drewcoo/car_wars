import _ from 'lodash'
import uuid from 'uuid/v4'
import { DATA } from '../DATA'
import Character from '../gameServerHelpers/Character'
import Collisions from '../gameServerHelpers/Collisions'
import Control from '../gameServerHelpers/Control'
import Damage from '../gameServerHelpers/Damage'
import Match from '../gameServerHelpers/Match'
import PhasingMove from '../gameServerHelpers/PhasingMove'
import Targets from '../gameServerHelpers/Targets'
import Time from '../gameServerHelpers/Time'
import Vehicle from '../gameServerHelpers/Vehicle'
import Weapon from '../gameServerHelpers/Weapon'
import { INCH } from '../utils/constants'
import Dice from '../utils/Dice'
import Point from '../utils/geometry/Point'
import Rectangle from '../utils/geometry/Rectangle'
import Log from '../utils/Log'
import { Design as DesignData } from '../vehicleDesigns/KillerKart'
import { typeDef as DesignTypes } from './vehicle/Design'

DATA.cars = []

const fillDesign = (designName) => {
  // BUGBUG: force Killer Kart right now
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
    acceptMove(id: ID!, maneuver: String!, howFar: Int!): Int
    fireWeapon(
      id: ID!,
      targetId: ID!,
      targetName: String!,
      targetX: Float!,
      targetY: Float!
    ): ID
    finishFiring( id: ID!): Int
    activeMoveStraight(id: ID!): Int
    activeMoveHalfStraight(id: ID!): Int
    activeMoveDrift(id: ID!, direction: String!): Int
    activeManeuverNext(id: ID!): Int
    activeManeuverPrevious(id: ID!): Int
    activeManeuverSet(id: ID!, maneuverIndex: Int!): Int
    activeMoveReset(id: ID!): Int
    activeShowCollisions(id: ID!): Int
    activeMoveBend(id: ID!, degrees: Int!): Int
    activeMoveSwerve(id: ID!, degrees: Int!): Int
    setCarPosition(id: ID!, rect: InputRectangle): Rectangle
    setSpeed(id: ID!, speed: Int!): Int!
    acceptSpeed(id: ID!, bugMeNot: Boolean): Int
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
    showSpeedChangeModal: Boolean
    speedChangeIndex: Int
    speedChanges: [SpeedChange]
    controlChecksForSpeedChanges: [ControlChecks]
    targetIndex: Int!
    targets: [Target]
    weaponIndex: Int
  }

  type SpeedChange {
    speed: Int!
    difficulty: Int!
    damageDice: String
  }

  type ControlChecks {
    speed: Int
    checks: [String]
  }

  type Damage {
    source: DamageSource
    target: DamageTarget
    message: String
  }

  type DamageSource {
    character: String
    point: Point
    weapon: String
  }

  type DamageTarget {
    point: Point
    damage: Int
    damageDice: String
    location: String
  }

  type Status {
    killed: Boolean
    handling: Int!
    lastDamageBy: [ID!]
    maneuvers: [String!]
    nextMove: [NextMove]
    speed: Int!
    speedInitThisTurn: Int!
    speedSetThisTurn: Boolean
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

// put all show-related funcs together in another file?

const rehydrateCar = ({ id }) => {
  const result = Vehicle.withId({ id })
  if (result.phasing.rect) {
    result.phasing.rect = new Rectangle(result.phasing.rect) || null
  }
  result.rect = new Rectangle(result.rect) || null
  return result
}

const outerActiveReset = ({ id }) => {
  const car = rehydrateCar({ id })
  PhasingMove.reset({ car })
}

const outerActiveHalfStraight = ({ id }) => {
  let car = rehydrateCar({ id })
  const distance = INCH / 2
  // is this needed?
  car = PhasingMove.center({ car })
  car.phasing.rect = PhasingMove.straight({ car, distance })
}

const outerActiveStraight = ({ id }) => {
  let car = Vehicle.withId({ id })
  // is this needed?
  car = PhasingMove.center({ car })
  car.phasing.rect = PhasingMove.straight({ car })
}

const outerActiveShowCollisions = ({ id }) => {
  const thisCar = Vehicle.withId({ id })
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
  const match = Match.withVehicle({ vehicle: thisCar })
  const cars = Match.cars({ match })
  Collisions.detect({ cars, map: match.map, thisCar })
}

const showHideCar = (car, manIdxDelta) => {
  const index = (car.phasing.maneuverIndex + manIdxDelta) % car.status.maneuvers.length
  if (car.status.maneuvers[index] === 'none') {
    outerActiveReset({ id: car.id })
  } else if (car.status.maneuvers[index] === 'half') {
    outerActiveHalfStraight({ id: car.id })
  } else {
    outerActiveStraight({ id: car.id })
  }
  outerActiveShowCollisions({ id: car.id })
}

export const resolvers = {
  Query: {
    car: (parent, args, _context) => {
      return Vehicle.withId({ id: args.id })
    },
    cars: () => {
      return DATA.cars
    },
    driver: (parent, args, _context) => {
      const car = Vehicle.withId({ id: args.carId })
      return Vehicle.driver({ vehicle: car })
    },
    modals: (parent, args, _context) => {
      const car = Vehicle.withId({ id: args.carId })
      return car.modals
    },
  },

  Mutation: {
    createCar: (parent, args, _context) => {
      const player = DATA.players.find((el) => el.id === args.playerId)
      const design = fillDesign(args.designName)

      const startingSpeed = 80

      const newCar = {
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
          targetIndex: 0, // don't hard-code here
          weaponIndex: 0, // needed for targets (refresh)
        },
        rect: null,
        status: {
          handling: design.attributes.handlingClass,
          killed: false,
          lastDamageBy: [],
          maneuvers: ['straight', 'bend', 'drift', 'swerve'],
          nextMove: [],
          speed: startingSpeed,
          speedInitThisTurn: startingSpeed,
          speedSetThisTurn: false,
        },
      }

      args.crew.forEach((crewMember) => {
        const seat = newCar.design.components.crew.find((seat) => seat.role === crewMember.role)
        if (!seat) {
          throw new Error(`no seat for a ${crewMember.role}!`)
        }
        seat.id = crewMember.id
        seat.firedThisTurn = false
      })

      PhasingMove.reset({ car: newCar })

      DATA.cars.push(newCar)
      return newCar
    },

    acceptMove: (parent, args, _context) => {
      let car = Vehicle.withId({ id: args.id })
      Log.info(car.status.maneuvers[car.phasing.maneuverIndex], car)
      if (!PhasingMove.hasMoved({ car })) {
        Log.info('car hasn not moved yet. return', car)
        return
      }
      Log.info('collisions?', car)
      for (const coll of car.phasing.collisions) {
        Collisions.resolve({ car, collision: coll })
      }
      if (car.status.nextMove.length > 0) {
        const forcedManeuver = car.status.nextMove.shift()
        if (forcedManeuver.maneuver === 'skid' || forcedManeuver.maneuver === 'controlledSkid') {
          Log.info(`I AM SKIDDING ${forcedManeuver.maneuverDistance / INCH} INCHES!!!`, car)
          car.rect = car.phasing.rect
          // deal with the damage, handling rolls, etc.
          if (forcedManeuver.maneuverDistance > INCH) {
            throw new Error(`We don't do a ${forcedManeuver.maneuverDistance}" skid!`)
          }
          if (forcedManeuver.maneuverDistance > (INCH * 3) / 4) {
            // 1" skid
            Damage.damageAllTires({ car, damageDice: '0d+2' })
            if (forcedManeuver.maneuver === 'controlledSkid') {
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
          } else if (forcedManeuver.maneuverDistance > INCH / 2) {
            // 3/4" skid
            Damage.damageAllTires({ car, damageDice: '0d+1' })
            car.status.speed -= 5
            if (forcedManeuver.maneuver === 'controlledSkid') {
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
          } else if (forcedManeuver.maneuverDistance > INCH / 4) {
            // 1/2" skid
            forcedManeuver.maneuver = null
            forcedManeuver.maneuverDirection = null
            forcedManeuver.maneuverDistance = 0
            car.status.speed -= 5
            if (forcedManeuver.maneuver === 'controlledSkid') {
              // −3 to aimed weapons fire
            } else {
              // -6 to aimed weapons fire
            }
          } else if (forcedManeuver.maneuverDistance > 0) {
            // 1/4" skid
            forcedManeuver.maneuver = null
            forcedManeuver.maneuverDirection = null
            forcedManeuver.maneuverDistance = 0
            if (forcedManeuver.maneuver === 'controlledSkid') {
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
      if (car.status.handling < -6) {
        car.status.handling = -6
      }
      Log.info(`maneuver check: ${Control.maneuverCheck({ car })}`, car)
      // BUGBUG: HANDLING ROLL NOW IF CHANGED!
      Log.info(`current HC: ${car.status.handling}`, car)

      /// Post-move
      car.rect = car.phasing.rect.clone()
      PhasingMove.reset({ car })
      const match = Match.withVehicle({ vehicle: car })
      Collisions.clear({ match })
      car = Time.subphase4Maneuver({ match })
    },

    activeManeuverNext: (parent, args, _context) => {
      console.log('next')
      const thisCar = Vehicle.withId({ id: args.id })
      const match = Match.withVehicle({ vehicle: thisCar })
      const cars = Match.cars({ match })
      showHideCar(thisCar, 1)

      thisCar.phasing.maneuverIndex = (thisCar.phasing.maneuverIndex + 1) % thisCar.status.maneuvers.length
      Collisions.detect({ cars, map: match.map, thisCar })
      return thisCar.phasing.maneuverIndex
    },

    activeManeuverPrevious: (parent, args, _context) => {
      console.log('prev')
      const thisCar = Vehicle.withId({ id: args.id })
      const match = Match.withVehicle({ vehicle: thisCar })
      const cars = Match.cars({ match })
      showHideCar(thisCar, -1)
      thisCar.phasing.maneuverIndex =
        (thisCar.phasing.maneuverIndex - 1 + thisCar.status.maneuvers.length) % thisCar.status.maneuvers.length
      Collisions.detect({ cars, map: match.map, thisCar })
      return thisCar.phasing.maneuverIndex
    },

    activeManeuverSet: (parent, args, _context) => {
      const thisCar = Vehicle.withId({ id: args.id })
      const match = Match.withVehicle({ vehicle: thisCar })
      const cars = Match.cars({ match })
      showHideCar(thisCar, args.maneuverIndex - thisCar.phasing.maneuverIndex)
      thisCar.phasing.maneuverIndex = parseInt(args.maneuverIndex)
      Collisions.detect({ cars, map: match.map, thisCar })
      return args.maneuverIndex
    },

    activeMoveStraight: (parent, args, _context) => {
      outerActiveStraight({ id: args.id })
    },

    activeMoveHalfStraight: (parent, args, _context) => {
      outerActiveHalfStraight({ id: args.id })
    },

    activeMoveDrift: (parent, args, _context) => {
      const car = Vehicle.withId({ id: args.id })
      const match = Match.withId({ id: car.currentMatch })
      const cars = Match.cars({ match })
      const distance = args.direction === 'right' ? INCH / 4 : -INCH / 4
      car.phasing.rect = PhasingMove.drift({ car, distance })
      const targets = new Targets({ car, cars, map: match.map })
      targets.refresh()
    },

    activeMoveReset: (parent, args, _context) => {
      const car = Vehicle.withId({ id: args.id })
      showHideCar(car, 0)
    },

    activeShowCollisions: (parent, args, _context) => {
      outerActiveShowCollisions({ id: args.id })
    },

    activeMoveBend: (parent, args, _context) => {
      console.log('bend')
      const car = Vehicle.withId({ id: args.id })
      const match = Match.withId({ id: car.currentMatch })
      const cars = Match.cars({ match })
      const degrees = args.degrees
      car.phasing.rect = PhasingMove.bend({ car, degrees })
      const targets = new Targets({ car, cars, map: match.map })
      targets.refresh()
    },

    activeMoveSwerve: (parent, args, _context) => {
      const car = Vehicle.withId({ id: args.id })
      const match = Match.withId({ id: car.currentMatch })
      const cars = Match.cars({ match })
      const degrees = args.degrees
      car.phasing.rect = PhasingMove.swerve({ car, degrees })
      const targets = new Targets({ car, cars, map: match.map })
      targets.refresh()
    },

    setCarPosition: (parent, args, _context) => {
      const car = Vehicle.withId({ id: args.id })
      car.rect = args.rect.clone()
      car.phasing.rect = args.rect.clone()
      return car
    },

    setSpeed: (parent, args, _context) => {
      console.log('speed')
      const car = Vehicle.withId({ id: args.id })
      if (car.status.speedSetThisTurn) {
        return
      }

      const driver = Vehicle.driver({ vehicle: car })

      if (
        driver.damagePoints < 2 ||
        car.status.speedSetThisTurn ||
        (car.design.components.powerPlant.damagePoints < 1 && Math.abs(args.speed) > Math.abs(car.status.speed))
      ) {
        // driver unconscious or dead
        return car.status.speed
      }

      const topSpeed = car.design.attributes.topSpeed
      if (args.speed < -topSpeed / 5 || args.speed > topSpeed) {
        throw new Error(`Excessive speed: ${args.speed}`)
      }

      // BUGBUG: Check for Excessive speed change.
      // BUGBUG: Check for "going through 0" without stopping.

      car.phasing.speedChangeIndex = car.phasing.speedChanges.findIndex((change) => change.speed === args.speed)
      if (car.phasing.speedChangeIndex === -1) {
        throw new Error(`Speed ${args.speed} not in array ${car.phasing.speedChanges}`)
      }
      car.status.controlChecks = Control.row({ speed: args.speed })
      car.phasing.difficulty = car.phasing.speedChanges[car.phasing.speedChangeIndex].difficulty
      car.phasing.damage = []
      const corners = {
        FL: car.rect.flPoint(),
        FR: car.rect.frPoint(),
        BL: car.rect.blPoint(),
        BR: car.rect.brPoint(),
      }
      if (car.phasing.speedChanges[car.phasing.speedChangeIndex].damageDice !== '') {
        car.design.components.tires.forEach((tire) => {
          car.phasing.damage.push({
            target: {
              point: corners[tire.location],
              location: tire.location,
              damageDice: car.phasing.speedChanges[car.phasing.speedChangeIndex].damageDice,
            },

            message: 'tire damage',
          })
        })
      }

      return args.speed
    },

    acceptSpeed: (parent, args, _context) => {
      const car = Vehicle.withId({ id: args.id })
      if (car.status.speedSetThisTurn) {
        return
      }

      const newSpeed = car.phasing.speedChanges[car.phasing.speedChangeIndex]
      Log.info(`${car.status.speed} -> ${newSpeed.speed}`, car)
      const speedChanged = newSpeed.speed !== car.status.speed

      if (speedChanged || args.bugMeNot) {
        Log.info(`speed change: ${car.status.speed}MPH -> ${newSpeed.speed}MPH`, car)
        car.status.speedSetThisTurn = true
      }

      if (speedChanged && newSpeed.damageDice !== '') {
        // deal with the damage and handling roll after everyone moves
        const points = {
          FL: car.rect.flPoint(),
          FR: car.rect.frPoint(),
          BL: car.rect.blPoint(),
          BR: car.rect.brPoint(),
        }
        car.design.components.tires.forEach((tire) => {
          car.phasing.damage.push({
            target: {
              location: tire.location,
              point: points[tire.location],
              damageDice: newSpeed.damageDice,
            },

            message: 'tire damage',
          })
        })
      }

      car.phasing.showSpeedChangeModal = false

      const match = Match.withId({ id: car.currentMatch })

      Time.subphase2SetSpeeds({ match })
    },

    setTarget: (parent, args, _context) => {
      const car = Vehicle.withId({ id: args.id })
      if (args.targetIndex < 0 || args.targetIndex >= car.phasing.targets.length) {
        throw new Error(`Target index out of range: ${args.targetIndex}`)
      }
      car.phasing.targetIndex = args.targetIndex
      return args.targetIndex
    },

    setWeapon: (parent, args, _context) => {
      const car = Vehicle.withId({ id: args.id })
      if (args.weaponIndex < 0 || args.weaponIndex >= car.design.components.weapons.length) {
        throw new Error(`Weapon index out of range: ${args.weaponIndex}`)
      }

      car.phasing.weaponIndex = args.weaponIndex
      car.phasing.targets = [] // default targ list ==== empty
      car.phasing.targetIndex = 0

      const crewMemberCanFire = car.design.components.crew.find((crewSlot) => {
        const crewMember = Character.withId({ id: crewSlot.id })
        return crewMember.damagePoints > 1 && !crewMember.firedThisTurn
      })
      const weapon = car.design.components.weapons[car.phasing.weaponIndex]
      const weaponCanFire = Weapon.canFire({
        weapon,
        plant: car.design.components.powerPlant,
      })
      if (crewMemberCanFire && weaponCanFire) {
        const match = Match.withId({ id: car.currentMatch })
        const cars = Match.cars({ match })
        const map = match.map
        const targets = new Targets({ car, cars, map })
        car.phasing.targets = targets.targetsInArc()
        car.phasing.targetIndex = 0 // BUGBUG: set to last target fired at?
      }
      return args.weaponIndex
    },

    finishFiring: (parent, args, _context) => {
      const car = Vehicle.withId({ id: args.id })
      const match = Match.withId({ id: car.currentMatch })
      const carIdIndex = match.time.phase.canTarget.indexOf(args.id)
      if (carIdIndex === -1) {
        throw new Error(`car not able to fire: ${args.id} ${args.color}`)
      }
      match.time.phase.canTarget.splice(carIdIndex, 1)

      Time.subphase5FireWeapons({ match })
    },

    fireWeapon: (parent, args, _context) => {
      const car = Vehicle.withId({ id: args.id })
      Log.info('fire!', car)
      if (!Weapon.passFiringChecks({ car })) {
        Log.info('cannot fire', car)
        return
      }

      // assumes one character per car
      const match = Match.withId({ id: car.currentMatch })
      const carIdIndex = match.time.phase.canTarget.indexOf(args.id)
      if (carIdIndex === -1) {
        throw new Error(`car not able to fire: ${args.id} ${args.color}`)
      }
      match.time.phase.canTarget.splice(carIdIndex, 1)

      const weapon = Weapon.itself({ car })

      const toHit = Dice.roll('2d')

      // BUGBUG - where are the modifiers???
      // Calculate server side for here and also for Reticle.jsx

      Log.info(`toHit: ${weapon.toHit} - roll is ${toHit} damage: ${weapon.damage}`, car)

      const damageDice = toHit >= weapon.toHit ? weapon.damage : '0d'
      weapon.ammo--
      Vehicle.driver({ vehicle: car }).firedThisTurn = true
      weapon.firedThisTurn = true

      const targetCar = Vehicle.withId({ id: args.targetId })
      targetCar.phasing.damage.push({
        source: {
          character: 'TODO - character ID',
          car: car,
          point: car.phasing.rect.side(weapon.location).middle(),
          weapon: weapon.type,
        },

        target: {
          car: targetCar,
          damageDice: damageDice,
          location: args.targetName,
          point: new Point({
            x: args.targetX,
            y: args.targetY,
          }),
        },

        message: '',
      })

      Time.subphase5FireWeapons({ match })
    },

    addModal: (parent, args, _context) => {
      const car = Vehicle.withId({ id: args.id })
      const newModal = { text: args.text }
      car.modals.push({ text: args.text })
      return newModal
    },

    popModal: (parent, args, _context) => {
      const car = Vehicle.withId({ id: args.id })
      const result = car.modals.pop()
      return result
    },
  },
}
