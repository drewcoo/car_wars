import _ from 'lodash'
import { v4 as uuid } from 'uuid'
import { DATA } from '../DATA'
import Match from '../gameServerHelpers/Match'
import PhasingMove from '../gameServerHelpers/PhasingMove'
import Actions from '../gameServerHelpers/settings/Actions'
import Maneuver from '../gameServerHelpers/settings/Maneuver'
import Speed from '../gameServerHelpers/settings/Speed'
import WeaponSettings from '../gameServerHelpers/settings/WeaponSettings'
import Vehicle from '../gameServerHelpers/Vehicle'
import { Design as DesignData } from '../vehicleDesigns/KillerKart'
import { typeDef as DesignTypes } from './vehicle/Design'

DATA.cars = []

const fillDesign = (designName: string) => {
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
    setSpeed(id: ID!, speed: Int!): Int
    acceptSpeed(id: ID!, bugMeNot: Boolean): Int
    setTarget(id: ID!, targetIndex: Int!): Int
    setWeapon(id: ID!, weaponIndex: Int!): Int
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

export const resolvers = {
  Query: {
    car: (parent: any, args: any) => {
      return Vehicle.withId({ id: args.id })
    },
    cars: () => {
      return DATA.cars
    },
    driver: (parent: any, args: any) => {
      const car = Vehicle.withId({ id: args.carId })
      return Vehicle.driver({ vehicle: car })
    },
    modals: (parent: any, args: any) => {
      const car = Vehicle.withId({ id: args.carId })
      return car.modals
    },
  },

  Mutation: {
    createCar: (parent: any, args: any) => {
      const player = DATA.players.find((element: any) => element.id === args.playerId)
      const design = fillDesign(args.designName)

      const startingSpeed = 80

      const vehicle = {
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

      args.crew.forEach((crewMember: any) => {
        const seat = vehicle.design.components.crew.find((seat) => seat.role === crewMember.role)
        if (!seat) {
          throw new Error(`no seat for a ${crewMember.role}!`)
        }
        seat.id = crewMember.id
        seat.firedThisTurn= false
      })

      PhasingMove.reset({ vehicle })

      DATA.cars.push(vehicle)
      return vehicle
    },

    acceptMove: (parent: any, args: any) => {
      const vehicle = Vehicle.withId({ id: args.id })
      const match = Match.withVehicle({ vehicle: vehicle })
      Actions.acceptMove({ vehicle, match })
    },

    activeManeuverNext: (parent: any, args: any) => {
      const vehicle = Vehicle.withId({ id: args.id })
      const match = Match.withVehicle({ vehicle })
      Maneuver.next({ vehicle, match })
    },

    activeManeuverPrevious: (parent: any, args: any) => {
      const vehicle = Vehicle.withId({ id: args.id })
      const match = Match.withVehicle({ vehicle })
      Maneuver.previous({ vehicle, match })
    },

    activeManeuverSet: (parent: any, args: any) => {
      const vehicle = Vehicle.withId({ id: args.id })
      const match = Match.withVehicle({ vehicle })
      Maneuver.set({ vehicle, match, maneuverIndex: args.maneuverIndex })
    },

    activeMoveBend: (parent: any, args: any) => {
      const vehicle = Vehicle.withId({ id: args.id })
      const match = Match.withId({ id: vehicle.currentMatch })
      Actions.moveBend({ match, vehicle, degrees: args.degrees })
    },

    activeMoveDrift: (parent: any, args: any) => {
      const vehicle = Vehicle.withId({ id: args.id })
      const match = Match.withId({ id: vehicle.currentMatch })
      Actions.moveDrift({ match, vehicle, direction: args.direction })
    },

    activeMoveHalfStraight: (parent: any, args: any) => {
      const vehicle = Vehicle.withId({ id: args.id })
      Actions.moveHalfStraight({ vehicle})
    },

    activeMoveReset: (parent: any, args: any) => {
      const vehicle = Vehicle.withId({ id: args.id })
      Actions.moveReset({ vehicle })
    },

    activeMoveStraight: (parent: any, args: any) => {
      const vehicle = Vehicle.withId({ id: args.id })
      Actions.moveStraight({ vehicle })
    },

    activeShowCollisions: (parent: any, args: any) => {
      const vehicle = Vehicle.withId({ id: args.id })
      Actions.showCollisions({ vehicle })
    },

    activeMoveSwerve: (parent: any, args: any) => {
      const vehicle = Vehicle.withId({ id: args.id })
      const match = Match.withId({ id: vehicle.currentMatch })
      Actions.moveSwerve({ match, vehicle, degrees: args.degrees })
    },

    setCarPosition: (parent: any, args: any) => {
      const vehicle = Vehicle.withId({ id: args.id })

      vehicle.rect = args.rect.clone()
      vehicle.phasing.rect = args.rect.clone()
      return vehicle
    },

    setSpeed: (parent: any, args: any) => {
      const vehicle = Vehicle.withId({ id: args.id })
      Speed.set({ vehicle, speed: args.speed })
    },

    acceptSpeed: (parent: any, args: any) => {
      const vehicle = Vehicle.withId({ id: args.id })
      const match = Match.withId({ id: vehicle.currentMatch })
      Speed.accept({ vehicle, match, bugMeNot: args.bugMeNot })
    },

    setTarget: (parent: any, args: any) => {
      const vehicle = Vehicle.withId({ id: args.id })
      WeaponSettings.setTarget({ vehicle, targetIndex: args.targetIndex })
    },

    setWeapon: (parent: any, args: any) => {
      const vehicle = Vehicle.withId({ id: args.id })
      WeaponSettings.setWeapon({ vehicle, weaponIndex: args.weaponIndex })
    },

    finishFiring: (parent: any, args: any) => {
      const vehicle = Vehicle.withId({ id: args.id })
      const match = Match.withId({ id: vehicle.currentMatch })
      WeaponSettings.finishFiring({ vehicle, match })
    },

    fireWeapon: (parent: any, args: any) => {
      // fireWeapon(id: $id, targetId: $targetId, targetName: $targetName, targetX: $targetX, targetY: $targetY)
      const vehicle = Vehicle.withId({ id: args.id })
      const target = {
        id: args.targetId,
        name: args.targetName,
        x: args.targetX,
        y: args.targetY,
      }
      WeaponSettings.fireWeapon({ vehicle, target })
    },

    addModal: (parent: any, args: any) => {
      const car = Vehicle.withId({ id: args.id })
      const newModal = { text: args.text }
      car.modals.push({ text: args.text })
      return newModal
    },

    popModal: (parent: any, args: any) => {
      const car = Vehicle.withId({ id: args.id })
      const result = car.modals.pop()
      return result
    },
  },
}
