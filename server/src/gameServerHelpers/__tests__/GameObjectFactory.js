import uuid from 'uuid/v4'
import GeometryFactory from '../../utils/geometry/__tests__/GeometryFactory'
import _ from 'lodash'
import { Design as DesignData } from '../../vehicleDesigns/KillerKart'

class GameObjectFactory {
  static car({ id = `car-${uuid()}`, speed = 50 }) {
    const designNode = _.cloneDeep(DesignData)

    return {
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
        rect: GeometryFactory.rectangle({}),
        /*

          damage {
            source {
              point {
                x
                y
              }
              character
              weapon
            }
            target {
              point {
                x
                y
              }
              location
              damage
              damageDice
            }
            message
          }
          difficulty
          maneuverIndex
          rect {
            facing
            length
            width
            _brPoint {
              x
              y
            }
          }
          showSpeedChangeModal
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
        playerId
        rect {
          facing
          length
          width
          _brPoint {
            x
            y
          }
        */
      },
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

  static crewMember({ role = 'passenger' }) {
    return {
      damagePoints: 2, // injured
      firedThisTurn: false,
      role: role,
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

  static match({ id = `match-${uuid()}`, carIds }) {
    return {
      carIds: carIds,
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
