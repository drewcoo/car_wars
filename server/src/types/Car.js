import uuid from 'uuid/v4'
import _ from 'lodash'
import Dice from '../utils/Dice'
import { INCH } from '../utils/constants'
import Point from '../utils/geometry/Point'
import Rectangle from '../utils/geometry/Rectangle'

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

/* BUGBUG

  non-required fields in Collison should be req'd
  need to define damage from walls

  related: both cars and walls should be "game objects" in the same pool,
  so that rammed can be rammedId instead of holding an optional rect
*/

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
    rammed: RammedObject
    rammedBy: RammedObject
    type: String!
  }

  ${DesignTypes}

  type Modal {
    text: String
  }

  type Phasing {
    collisionDetected: Boolean!
    collisions: [Collision]
    damageMarkerLocation: Point
    damageMessage: String
    difficulty: Int
    maneuverIndex: Int
    rect: Rectangle
    speedChangeIndex: Int
    speedChanges: [Int]
    targetIndex: Int!
    targets: [Target]
    weaponIndex: Int
  }

  type RammedObject {
    id: ID!
    rect: Rectangle
  }

  type Status {
    changedSpeed: Boolean!
    handling: Int!
    maneuvers: [String!]
    speed: Int!
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
  car.phasing.rect = PhasingMove.forward({ car, distance })
}

const outerGhostForward = ({ id }) => {
  let car = DATA.cars.find(el => el.id === id)
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
        name: args.name,
        modals: [],
        playerId: player.id,
        phasing: {
          collisionDetected: false,
          collisions: [],
          damageMarkerLocation: null,
          damageMessage: null,
          difficulty: 0,
          maneuverIndex: 0,
          rect: null,
          speedChangeIndex: 2,
          speedChanges: [0, 5, 10, 15, 20],
          targetIndex: 0,
          targets: [],
          weaponIndex: 0, // needed for targets (refresh)
        },
        status: {
          changedSpeed: false,
          handling: design.attributes.handlingClass,
          maneuvers: ['forward', 'bend', 'drift', 'swerve'],
          speed: 10,
        }
      }
      DATA.cars.push(newCar)
      return newCar
    },
    doMove: (parent, args, context) => {
      let car = DATA.cars.find(el => el.id === args.id)
      // haven't moved
      if (!PhasingMove.hasMoved({ car })) { return }

      for (let coll of car.phasing.collisions) {
        Collisions.resolve({ car, collision: coll })
      }

      car.status.handling -= car.phasing.difficulty
      // BUGBUG: HANDLING ROLL NOW IF CHANGED!
      console.log('handling roll may go here')

      car.rect = car.phasing.rect.clone()

      PhasingMove.reset({ car })
      let match = DATA.matches.find(match => match.id === car.currentMatch)
      let cars = DATA.cars.filter(car => match.carIds.includes(car.id))

      Collisions.clear({ cars })

      Time.nextPlayer({ match })
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
    },
    ghostMoveSwerve: (parent, args, context) => {
      let car = DATA.cars.find(el => el.id === args.id)
      const match = DATA.matches.find(match => match.id === car.currentMatch)
      const cars = DATA.cars.filter(car => match.carIds.includes(car.id))
      const degrees = args.degrees
      car.phasing.rect = PhasingMove.swerve({ car, degrees })
      const targets = new Targets({ car, cars, map: match.map })
      targets.refresh()
    },

    setCarPosition: (parent, args, context) => {
      let car = DATA.cars.find(el => el.id === args.id)
      car.rect = args.rect
      return car.rect
    },
    setSpeed: (parent, args, context) => {
      let car = DATA.cars.find(el => el.id === args.id)
      let driver = car.design.components.crew.find(member => member.role === 'driver')
      if(driver.damagePoints < 2) {
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
      if (car.status.speed === args.speed) return args.speed

      car.status.speed = args.speed
      car.status.changedSpeed = true
      return car.status.speed
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
      if (!Weapon.passFiringChecks({ car })) {
        car.phasing.damageMarkerLocation = null
        car.phasing.damageMessage = null
        console.log('cannot fire')
        return
      }

      let weapon = Weapon.itself({ car })
      const toHit = Dice.roll('2d')
      let damage = (toHit >= weapon.toHit) ? Dice.roll(weapon.damage) : 0
      weapon.ammo--
      car.design.components.crew.find(member => member.role === 'driver').firedThisTurn = true
      weapon.firedThisTurn = true

      const targetCar = DATA.cars.find(car => args.targetId === car.id)

      Weapon.dealDamage({
        car: targetCar,
        damage: damage,
        location: args.targetName
      })

      car.phasing.damageMarkerLocation = new Point({
        x: args.targetX,
        y: args.targetY
      })
      car.phasing.damageMessage = damage
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
