import Collisions from './Collisions'
import { Maneuvers } from './Maneuvers'
import Movement from './Movement'
import PhasingMove from './PhasingMove'
import { INCH } from '../utils/constants'
import Log from '../utils/Log'
import Targets from './Targets'
import VehicleStatusHelper from './VehicleStatusHelper'

import { DATA,  matchCars } from '../DATA'

class Time {
  static nextTurn ({ match }) {
    // bump hc up, mark cars to be able to change speed, etc.
    match.time.turn.number += 1

    matchCars({match}).forEach(car => {
      car.design.components.weapons.forEach(weapon => {
        weapon.firedThisTurn = false
      })
      car.design.components.crew.forEach(crewMember => {
        crewMember.firedThisTurn = false
      })
      car.status.speedChangedThisTurn = false
      let handlingRecovery = car.design.attributes.handlingClass
      if (handlingRecovery < 1) { handlingRecovery = 1 }
      car.status.handling += handlingRecovery
      if (car.status.handling > car.design.attributes.handlingClass) {
        car.status.handling = car.design.attributes.handlingClass
      }
    })
  }

  static nextPhase ({ match }) {
    let newPhase = match.time.phase.number + 1
    if (newPhase > 5) {
      this.nextTurn({ match })
      newPhase = 1
      Movement.slowTheDead({ match })
    }
    match.time.phase.number = newPhase
    match.time.phase.unmoved = Movement.canMoveThisPhase({ match })
  }

  static nextMover ({ match }) {
    let bailoutTimer = 5
    do {
      if (bailoutTimer-- < 0) {
        // BUGBUG: This may happen if everyone is stopped.
        // How do I detect infinite loop vs nobody moving?
        // Set a time limit?
        throw new Error('Tried nextPhase() for a whole turn and nobody can move yet!')
      }
      match.time.phase.moving = Movement.nextToMoveThisPhase({ match })
      if (match.time.phase.moving === null) {
        // TODO: Handle Weapons fire here. Any
        this.nextPhase({ match })
      }
    } while (match.time.phase.moving === null)

    let car = matchCars({match}).find(car => car.id === match.time.phase.moving)
    const isHalfMove = Movement.distanceThisPhase({ speed: car.status.speed, phase: match.time.phase.number }) === 0.5
    Log.info(`half move? ${isHalfMove}`)

    // is this needed?
    car = PhasingMove.center({ car })

    if (car.status.speed === 0) {
      car.status.nextMove = []
    }

    let forcedMove = car.status.nextMove[0]

    // First, possible fishtail
    if (typeof(forcedMove) != 'undefined' &&
        typeof(forcedMove.fishtailDistance) != 'undefined' &&
        forcedMove.fishtailDistance != 0) {
      Log.info(`fishtail ${forcedMove.spinDirection} ${forcedMove.fishtailDistance}`, car)
      if (forcedMove.spinDirection === 'left') {
        car.rect = car.rect.leftFrontCornerPivot(forcedMove.fishtailDistance)
      } else if (forcedMove.spinDirection === 'right') {
        car.rect = car.rect.rightFrontCornerPivot(-forcedMove.fishtailDistance)
      } else {
        throw new Error(`direction unknown: ${nextMove.spinDirection}`)
      }
      PhasingMove.fishtail({ car, degrees: forcedMove.fishtailDistance, direction: forcedMove.spinDirection })
      // That may have caused a collision. After resolving, proceed.
      Log.info(`Time#nextMover fishtailed ${car.color}`, car)
      // BUGBUG: Should treat car.rect as the pivtoed one, for the sake
      // of further maneuvers
    } else {
      Log.info(`Time#nextMover did not fishtail ${car.color}`, car)
    }

    // Now we either skid or we don't.

    if (typeof(forcedMove) != 'undefined' && (
          forcedMove.maneuver === 'skid' || forcedMove.maneuver === 'controlledSkid')
        ) {
      car.status.maneuvers = [forcedMove.maneuver]
      Log.info(`Time#nextMover ${car.color} car forced maneuver: ${forcedMove.maneuver}`, car)
      let skidDistance = forcedMove.maneuverDistance
      if (isHalfMove && skidDistance > INCH / 2) {
        skidDistance -= INCH / 2
      }
      let straightDistance = isHalfMove ? INCH / 2 : INCH
      straightDistance -= skidDistance
      car.phasing.rect._brPoint = car.phasing.rect.brPoint().move({ degrees: forcedMove.maneuverDirection, distance: skidDistance })
      car.phasing.rect = car.phasing.rect.move({ degrees: car.phasing.rect.facing , distance: straightDistance })
      Log.info(`Time#nextMover skidded ${car.color}`, car)
    } else {
      Log.info(`Time#nextMover did not skid ${car.color}`, car)
      if (isHalfMove) {
        Log.info('half move', car)
        car.status.maneuvers = ['half']
        car.phasing.rect = PhasingMove.forward({ car, distance: INCH / 2 })
      } else if (VehicleStatusHelper.canSteer(car)) {
        car.status.maneuvers = Maneuvers()
        car.phasing.rect = PhasingMove.forward({ car, distance: INCH })
      } else {
        // dashboard light for this, maybe?
        car.status.maneuvers = ['forward']
        car.phasing.rect = PhasingMove.forward({ car, distance: INCH })
      }
    }
    Log.info(`Time#nextMover facing:  ${car.rect.facing}/${car.phasing.rect.facing}`, car)
    Collisions.detect({ cars: matchCars({match}), map: match.map, thisCar: car })

    // BUGBUG: Targeting here until I do it right - see above.
    const targets = new Targets({
      car: matchCars({match}).find(car => car.id === match.time.phase.moving),
      cars: matchCars({match}),
      map: match.map
    })
    targets.refresh()
  }
}

export default Time
