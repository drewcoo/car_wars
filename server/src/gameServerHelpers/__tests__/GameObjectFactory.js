import _ from 'lodash'
import { v4 as uuid } from 'uuid'
import GeometryFactory from '../../utils/geometry/__tests__/GeometryFactory'
import { Design as DesignData } from '../../vehicleDesigns/KillerKart'

class GameObjectFactory {
  static vehicle({ id = `car-${uuid()}`, speed = 50 }) {
    const designNode = _.cloneDeep(DesignData)
    let result = {
      collisionDetected: false,
      collisions: [],
      color: 'beige',
      design: designNode,
      id: id,
      log: [],
      phasing: {
        collisionDetected: false,
        collisions: [],
        damage: [],
        difficulty: 0,
        maneuverIndex: 0,
        rect: GeometryFactory.rectangle({}),
        showSpeedChangeModal: false,
        /*
          speedChangeIndex
          speedChanges {
            speed
            difficulty
            damageDice
          }
          controlChecksForSpeedChanges {
            speed
            checks
          }
          targetIndex
          targets {
            carId
            name
            displayPoint {
              x
              y
            }
          }
          weaponIndex
        }
        */
      },
      // playerId
      rect: GeometryFactory.rectangle({}),
      status: {
        handling: designNode.attributes.handlingClass,
        killed: false,
        lastDamageBy: [],
        maneuvers: ['straight', 'bend', 'drift', 'swerve'],
        nextMove: [],
        speed: speed,
        speedSetThisTurn: false,
      },
    }
    return result
  }

  //GameObjectFactory.putCrewInVehicle({ vehicle: car, crewMember: driver })
  static putCrewInVehicle({ crewLocation = 'driver', crewMember, vehicle }) {
    const crewSlot = vehicle.design.components.crew.find((element) => element.role === crewLocation)
    crewSlot.id = crewMember.id
    crewMember.inVehicleId = vehicle.id
  }

  static character({ id = `character-${uuid()}` }) {
    return {
      damagePoints: 3,
      firedThisTurn: false,
      equipment: [],
      id: id || uuid(),
      inVehicleId: '', //carId,
      log: [],
      matchId: '', //matchId,
      //name: args.name,
      //playerId: args.playerId,
      prestige: 0,
      reflexRoll: null, // roll at beginning of combat
      skills: [
        // { name: 'areaKnowledge', points: 10}, // home town (p. 38)
        { name: 'climbing', points: 10 },
        { name: 'computerTech', points: 0 },
        { name: 'cyclist', points: 0 },
        { name: 'driver', points: 0 },
        { name: 'fastTalk', points: 0 },
        { name: 'general', points: 30 }, // points to be spent on gaining skills
        { name: 'gunner', points: 0 },
        { name: 'handgunner', points: 0 },
        { name: 'luck', points: 0 },
        { name: 'martialArts', points: 0 },
        { name: 'mechanic', points: 0 },
        { name: 'paramedic', points: 0 },
        { name: 'running', points: 10 },
        { name: 'security', points: 0 },
        { name: 'streetwise', points: 0 },
      ],
      wealth: 0,
    }
  }

  static collision() {
    return {
      damage: '0',
      damageModifier: 1.0,
      handlingStatus: 3,
      newSpeed: 30,
      rammed: 'carIdFoo',
      rammedBy: '',
      type: 't-bone',
    }
  }

  static damage() {
    return {
      source: {
        point: GeometryFactory.point(),
        character: 'generic driver',
        weapon: 'catapult',
      },
      target: {
        point: GeometryFactory.point(),
        location: 'F',
        damage: 1,
        damageDice: '1d',
      },
      message: 'nya nya',
    }
  }

  static driver() {
    return GameObjectFactory.crewMember({ role: 'driver' })
  }

  static putVehicleInMatch({ match, vehicle }) {
    match.carIds.push(vehicle.id)
    // vehicle. matchId // does not exist yet
  }

  static putCharacterInMatch({ match, character }) {
    character.matchId = match.id
    match.characterIds.push(character.id)
  }

  static match({ id = `match-${uuid()}` }) {
    return {
      carIds: [],
      characterIds: [],
      id: id,
      // map
      /* players:
     {
      id
      name
      carIds
      color
    },
    */
      time: {
        phase: {
          number: 1,
          // moving
          // subphase
          // unmoved
          // canTarget
          // playersToAckDamage
          // playersToAckSpeedChange
        },
        turn: {
          number: 1,
        },
      },
    }
  }

  static powerPlant() {
    return {
      type: 'medium',
      damagePoints: 8,
    }
  }

  static setOfTires() {
    return [
      GameObjectFactory.tire({ location: 'FL' }),
      GameObjectFactory.tire({ location: 'FR' }),
      GameObjectFactory.tire({ location: 'BL' }),
      GameObjectFactory.tire({ location: 'BR' }),
    ]
  }

  static tire({ location = 'FL' }) {
    return {
      damagePoints: 6,
      location: location,
      type: 'HD',
      wheelExists: true,
    }
  }

  static weapon() {
    return {
      ammo: 50,
      damage: '1d',
      damagePoints: 3,
      effect: 'area',
      firedThisTurn: false,
      id: 'weapon0',
      location: 'F',
      type: 'pyoopyooo-er',
      toHit: 8,
      requiresPlant: false,
    }
  }
}

export default GameObjectFactory
