import { INCH } from '../../utils/constants'
import Log from '../../utils/Log'
import Collisions from '../Collisions'
import Control from '../Control'
import Damage from '../Damage'
import Match from '../Match'
import PhasingMove from '../PhasingMove'
import Vehicle from '../Vehicle'
import Targets from '../Targets'
import Time from '../Time'

class Actions {
  static acceptMove({ vehicle, match }: { vehicle: any, match: any }) {
    Log.info(vehicle.status.maneuvers[vehicle.phasing.maneuverIndex], vehicle)
    if (!PhasingMove.hasMoved({ vehicle })) {
      Log.info('vehicle hasn not moved yet. return', vehicle)
      return
    }
    Log.info('collisions?', vehicle)
    for (const coll of vehicle.phasing.collisions) {
      Collisions.resolve({ vehicle, collision: coll })
    }
    if (vehicle.status.nextMove.length > 0) {
      const forcedManeuver = vehicle.status.nextMove.shift()
      if (forcedManeuver.maneuver === 'skid' || forcedManeuver.maneuver === 'controlledSkid') {
        Log.info(`I AM SKIDDING ${forcedManeuver.maneuverDistance / INCH} INCHES!!!`, vehicle)
        vehicle.rect = vehicle.phasing.rect
        // deal with the damage, handling rolls, etc.
        if (forcedManeuver.maneuverDistance > INCH) {
          throw new Error(`We don't do a ${forcedManeuver.maneuverDistance}" skid!`)
        }
        if (forcedManeuver.maneuverDistance > (INCH * 3) / 4) {
          // 1" skid
          Damage.damageAllTires({ car: vehicle, damageDice: '0d+2' })
          if (forcedManeuver.maneuver === 'controlledSkid') {
            // aimed weapons fire prohibited for the rest of the turn,
            vehicle.status.speed -= 10
            forcedManeuver.maneuver = null
            forcedManeuver.maneuverDirection = null
            forcedManeuver.maneuverDistance = 0
          } else {
            // No further aimed weapon fire permitted from this vehicle this turn
            vehicle.status.speed -= 20
            forcedManeuver.maneuver = 'skid'
            forcedManeuver.maneuverDirection = vehicle.rect.facing
            forcedManeuver.maneuverDistance = INCH / 2
          }
        } else if (forcedManeuver.maneuverDistance > INCH / 2) {
          // 3/4" skid
          Damage.damageAllTires({ car: vehicle, damageDice: '0d+1' })
          vehicle.status.speed -= 5
          if (forcedManeuver.maneuver === 'controlledSkid') {
            // -6 to aimed weapons fire
            forcedManeuver.maneuver = null
            forcedManeuver.maneuverDirection = null
            forcedManeuver.maneuverDistance = 0
          } else {
            // -6 to aimed weapons fire
            forcedManeuver.maneuver = 'skid'
            forcedManeuver.maneuverDirection = vehicle.rect.facing
            forcedManeuver.maneuverDistance = INCH / 4
          }
        } else if (forcedManeuver.maneuverDistance > INCH / 4) {
          // 1/2" skid
          forcedManeuver.maneuver = null
          forcedManeuver.maneuverDirection = null
          forcedManeuver.maneuverDistance = 0
          vehicle.status.speed -= 5
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

    Log.info(`base HC: ${vehicle.design.attributes.handlingClass}`, vehicle)
    Log.info(`initial HC: ${vehicle.status.handling}`, vehicle)
    Log.info(`difficulty: D${vehicle.phasing.difficulty}`, vehicle)
    vehicle.status.handling -= vehicle.phasing.difficulty
    if (vehicle.status.handling < -6) {
      vehicle.status.handling = -6
    }
    Log.info(`maneuver check: ${Control.maneuverCheck({ vehicle })}`, vehicle)
    // BUGBUG: HANDLING ROLL NOW IF CHANGED!
    Log.info(`current HC: ${vehicle.status.handling}`, vehicle)

    /// Post-move
    vehicle.rect = vehicle.phasing.rect.clone()
    PhasingMove.reset({ vehicle })

    Collisions.clear({ match })
    vehicle = Time.subphase4Maneuver({ match })
  }

  static moveBend({ match, vehicle, degrees }: { match: any, vehicle: any, degrees: number }) {
    const cars = Match.cars({ match })
    vehicle.phasing.rect = PhasingMove.bend({ vehicle, degrees })
    const targets = new Targets({ car: vehicle, cars, map: match.map })
    targets.refresh()
  }

  static moveDrift({ match, vehicle, direction }: { match: any, vehicle: any, direction: string }) {
    const cars = Match.cars({ match })
    const distance = direction === 'right' ? INCH / 4 : -INCH / 4
    vehicle.phasing.rect = PhasingMove.drift({ vehicle, distance })
    const targets = new Targets({ car: vehicle, cars, map: match.map })
    targets.refresh()
  }

  static moveHalfStraight({ vehicle }: { vehicle: any }) {
    const distance = INCH / 2
    // is this needed?
    vehicle.phasing.rect = PhasingMove.center({ vehicle })
    vehicle.phasing.rect = PhasingMove.straight({ vehicle, distance })
  }
  
  static moveReset({ vehicle }: { vehicle: any }) {
    Actions.showHidevehicle(vehicle, 0)
  }

  static moveStraight({ vehicle }: { vehicle: any }) {
    // is this needed?
    vehicle.phasing.rect = PhasingMove.center({ vehicle })
    vehicle.phasing.rect = PhasingMove.straight({ vehicle, distance: INCH })
  }

  static moveSwerve({ match, vehicle, degrees }: { match: any, vehicle: any, degrees: number }) {
    const cars = Match.cars({ match })
    vehicle.phasing.rect = PhasingMove.swerve({ vehicle, degrees })
    const targets = new Targets({ car: vehicle, cars, map: match.map })
    targets.refresh()
  }

  static showCollisions({ vehicle }: { vehicle: any }) {
    //
    // BUGBUG: Problems:
    // 1. I don't like the way walls are handled. I'd like to put all "collidable
    //    things" in an array and walk through them.
    // 2. Only finds collisions where bounding lines cross/connect. That means
    //    even if #1 adds humans (1/4"x1/2") they may be contained in the
    //    bounding rectangle of the vehicle and not detected.
    // 3. Because of the way this is tracked, we can move *through* a collision
    //    state and not end in one. That's a bug.
    // 4. Doesn't stop at time of collision to determine where the vehicles go.
    // 5. Doesn't consider the type of collision. That will matter when
    //    damage is assessed when the move is accepted.
    // 6. Others?
    //
    const match = Match.withVehicle({ vehicle })
    const vehicles = Match.cars({ match })
    const map = Match.map({ match })
    Collisions.detect({ cars: vehicles, map, thisCar: vehicle })
  }

  static showHidevehicle(vehicle: any, manIdxDelta: number) {
    const index = (vehicle.phasing.maneuverIndex + manIdxDelta) % vehicle.status.maneuvers.length
    if (vehicle.status.maneuvers[index] === 'half') {
      Actions.moveHalfStraight({ vehicle })
    } else {
      Actions.moveStraight({ vehicle })
    }
    Actions.showCollisions({ vehicle })
  }
}

export default Actions