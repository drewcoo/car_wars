import _ from 'lodash'
import Dice from 'src/utils/Dice'
import { matchCars, DATA } from '../DATA'
import { INCH } from '../utils/constants'
import Log from '../utils/Log'
import Collisions from './Collisions'
import Control from './Control'
import Movement from './Movement'
import PhasingMove from './PhasingMove'
import VehicleStatusHelper from './VehicleStatusHelper'
import Damage from './Damage'

/*
subphases:
1_start
2_set_speeds
2_1_reveal_speed_change
3_maneuver
4_fire_weapons
5_damage
6_end
*/

class Time {
  static slowTheDead({ match, _data = DATA }) {
    // p. 30: Any other
    // ground vehicle (including a cycle with a
    // sidecar) will continue in a straight line if
    // the driver is incapacitated. It decelerates
    // 5 mph each turn, moving in a straight line
    // until it stops or hits something.
    //
    // p. 49 When the power plant is lost, a vehicle can no
    // longer fire lasers or accelerate, but all other
    // systems still work. The vehicle decelerates 5
    // mph per turn (more if you put on the brakes).

    const cars = match.carIds.map((id) =>
      _data.cars.find((car) => car.id === id),
    )
    cars.forEach((car) => {
      const driverOut = Movement.driverOut({ car })
      const plantOut = Movement.plantOut({ car })
      const needMoreWheels = !VehicleStatusHelper.enoughWheels(car)
      Log.info(
        `slowTheDead: driverOut[${driverOut ? 'X' : ''}] plantOut[${
          plantOut ? 'X' : ''
        }] needMoreWheels[${needMoreWheels ? 'X' : ''}]`,
        car,
      )
      if (driverOut || plantOut || needMoreWheels) {
        if (car.status.speed > 0) {
          car.status.speed -= 5
        }
        if (car.status.speed < 0) {
          car.status.speed += 5
        }
        if (Movement.isKilled({ car })) {
          car.status.killed = true
          car.status.nextMove = []
        }
        car.phasing.speedChangeIndex = 0
        car.phasing.speedChanges = [{ speed: car.status.speed }]
        Log.info(`slowing car ${car.id} by 5 MPH to ${car.status.speed}`, car)
      }
    })
  }

  static nextTurn({ match }) {
    // BUGBUG: check for game over

    // bump hc up, mark cars to be able to change speed, etc.
    match.time.turn.number += 1

    matchCars({ match }).forEach((car) => {
      car.design.components.weapons.forEach((weapon) => {
        weapon.firedThisTurn = false
      })
      car.design.components.crew.forEach((crewMember) => {
        crewMember.firedThisTurn = false
      })
      let handlingRecovery = car.design.attributes.handlingClass
      if (handlingRecovery < 1) {
        handlingRecovery = 1
      }
      car.status.handling += handlingRecovery
      if (car.status.handling > car.design.attributes.handlingClass) {
        car.status.handling = car.design.attributes.handlingClass
      }
    })

    Time.slowTheDead({ match })
  }

  static subphaseCheck(name, match) {
    if (match.time.phase.subphase !== name) {
      throw new Error(
        `Out of phase: ${match.time.phase.subphase} - expected ${name}`,
      )
    }
  }

  static subphase1_start({ match }) {
    Time.subphaseCheck('1_start', match)
    match.time.phase.number = (match.time.phase.number % 5) + 1
    if (match.time.phase.number === 1) {
      Time.nextTurn({ match })
      matchCars({ match }).forEach((car) => {
        car.status.speedChangedThisTurn = false
      })
    }
    match.time.phase.unmoved = Movement.canMoveThisPhase({ match })

    matchCars({ match }).forEach((car) => {
      car.phasing.showSpeedChangeModal = !car.status.speedChangedThisTurn
    })

    match.time.phase.subphase = '2_set_speeds'
    return Time.subphase2_setSpeeds({ match })
  }

  static subphase2_setSpeeds({ match }) {
    Time.subphaseCheck('2_set_speeds', match)
    // do we need to start a new phase?
    let allReady = true
    matchCars({ match }).forEach((thisCar) => {
      const ready =
        !thisCar.phasing.showSpeedChangeModal ||
        thisCar.status.speedChangedThisTurn
      allReady = allReady && ready
      console.log(`    [${ready ? 'X' : ' '}] ${thisCar.id} - ${thisCar.color}`)
      console.log(
        `        [${
          thisCar.phasing.showSpeedChangeModal ? ' ' : 'X'
        }] modal dismissed this phase`,
      )
      console.log(
        `        [${
          thisCar.status.speedChangedThisTurn ? 'X' : ' '
        }] speed changed this turn`,
      )
    })
    console.log(`[${allReady ? 'X' : ' '}] all cars ready`)

    const finishedSettingSpeed = matchCars({ match }).every((car) => {
      return (
        !car.phasing.showSpeedChangeModal || car.status.speedChangedThisTurn
      )
    })

    /// prep for subphase_2_1_revealSpeedChange
    if (finishedSettingSpeed) {
      match.time.phase.subphase = 'prep_for_subphase_2_1_revealSpeedChange'
      Time.prep_for_subphase_2_1_revealSpeedChange({ match })
    }
    return null
  }

  static prep_for_subphase_2_1_revealSpeedChange({ match }) {
    matchCars({ match }).forEach((car) => {
      const newSpeed =
        car.phasing.speedChanges[car.phasing.speedChangeIndex].speed
      Log.info(`${car.status.speed}MPH -> ${newSpeed}MPH`, car)

      if (newSpeed === car.status.speed) {
        return
      }
      match.time.phase.playersToAckSpeedChange = matchCars({ match }).map(
        (car) => car.playerId,
      )

      // deal with difficulty from braking
      Log.info(`base HC: ${car.design.attributes.handlingClass}`, car)
      Log.info(`initial HC: ${car.status.handling}`, car)
      Log.info(`difficulty: D${car.phasing.difficulty}`, car)
      car.status.handling -= car.phasing.difficulty
      if (car.status.handling < -6) {
        car.status.handling = -6
      }
      const result = Control.maneuverCheck({ car })
      Log.info(`maneuver check: ${result}`, car)
      Log.info(`current HC: ${car.status.handling}`, car)
      car.phasing.difficulty = 0
      // and with tire damage
      // leave this for subphase_2_1_revealSpeedChange to know
      // which cars to notify about
      car.phasing.damage.forEach((dam) => {
        if (dam.message !== 'tire damage') {
          throw new Error(
            `unknown damage type in subphase_2_1_revealSpeedChange: ${dam.message}`,
          )
        }

        const tire = car.design.components.tires.find(
          (elem) => elem.location === dam.target.location,
        )
        const init = tire.damagePoints

        tire.damagePoints -= Dice.roll(dam.damageDice)
        if (tire.damagePoints < 0) {
          tire.damagePoints = 0
        }
        dam.target.damage = init - tire.damagePoints
        tire.damageDice = ''
      })

      car.status.speedChangedThisTurn = true
      car.status.speed = newSpeed
    })

    match.time.phase.playersToAckSpeedChange = _.uniq(
      match.time.phase.playersToAckSpeedChange,
    )
    console.log(match.time.phase.playersToAckSpeedChange)

    match.time.phase.subphase = '2_1_reveal_speed_change'
    Time.subphase_2_1_revealSpeedChange({ match })
  }

  static subphase_2_1_revealSpeedChange({ match }) {
    console.log('2.1. reveal')
    Time.subphaseCheck('2_1_reveal_speed_change', match)
    if (match.time.phase.playersToAckSpeedChange.length > 0) {
      console.log(match.time.phase.playersToAckSpeedChange)
      console.log('not everyone has acknowledged')
      return
    }
    console.log('everyone has acknowledged')

    matchCars({ match }).forEach((car) => (car.phasing.damage = []))
    match.time.phase.unmoved = Movement.canMoveThisPhase({ match })
    match.time.phase.subphase = '3_maneuver'
    Time.subphase3_maneuver({ match })
  }

  static subphase3_maneuver({ match }) {
    console.log('3. maneuver')
    Time.subphaseCheck('3_maneuver', match)
    match.time.phase.moving = Movement.nextToMoveThisPhase({ match })
    if (match.time.phase.moving) {
      const car = matchCars({ match }).find(
        (car) => car.id === match.time.phase.moving,
      )
      Time.prepareActiveMover({ match, carId: car.id })
      return car
    }

    match.time.phase.canTarget = matchCars({ match })
      .filter((car) => {
        // just driver for now
        const crewMember = car.design.components.crew.find(
          (member) => member.role === 'driver',
        )
        return !(crewMember.firedThisTurn || crewMember.damagePoints < 1)
      })
      .map((car) => car.id)

    match.time.phase.subphase = '4_fire_weapons'
    Time.subphase4_fireWeapons({ match })
  }

  static subphase4_fireWeapons({ match }) {
    Time.subphaseCheck('4_fire_weapons', match)
    if (match.time.phase.canTarget.length > 0) {
      return
    }

    // prep for next phase
    let someoneTookDamage = false
    matchCars({ match }).forEach((targetCar) => {
      targetCar.phasing.damage.forEach((damageRecord) => {
        someoneTookDamage = true
        Damage.dealDamage({
          damageRecord,
        })
      })
    })

    if (someoneTookDamage) {
      match.time.phase.playersToAckDamage = _.uniq(
        matchCars({ match }).map((car) => car.playerId),
      )
    } else {
      match.time.phase.playersToAckDamage = []
    }

    match.time.phase.subphase = '5_damage'
    Time.subphase5_damage({ match })
  }

  static subphase5_damage({ match }) {
    Time.subphaseCheck('5_damage', match)
    if (match.time.phase.playersToAckDamage.length > 0) {
      return
    }

    match.time.phase.subphase = '6_end'
    Time.subphase6_end({ match })
  }

  static subphase6_end({ match }) {
    Time.subphaseCheck('6_end', match)
    // end of turn refresh?
    // check for match over

    matchCars({ match }).forEach((car) => {
      car.phasing.damage = []
    })

    match.time.phase.subphase = '1_start'
    Time.subphase1_start({ match })
  }

  static fishtailIfNeeded({ car }) {
    const forcedMove = car.status.nextMove[0]
    if (
      typeof forcedMove === 'undefined' ||
      typeof forcedMove.fishtailDistance === 'undefined' ||
      forcedMove.fishtailDistance === 0
    ) {
      return
    }
    Log.info(
      `fishtail ${forcedMove.spinDirection} ${forcedMove.fishtailDistance}`,
      car,
    )
    if (forcedMove.spinDirection === 'left') {
      car.rect = car.rect.frontLeftCornerPivot(forcedMove.fishtailDistance)
    } else if (forcedMove.spinDirection === 'right') {
      car.rect = car.rect.frontRightCornerPivot(-forcedMove.fishtailDistance)
    } else {
      throw new Error(`direction unknown: ${forcedMove.spinDirection}`)
    }
    PhasingMove.fishtail({
      car,
      degrees: forcedMove.fishtailDistance,
      direction: forcedMove.spinDirection,
    })
  }

  static nonfishtailForcedMove({ car, match }) {
    const forcedMove = car.status.nextMove[0]
    if (typeof forcedMove === 'undefined') {
      return false
    }
    const isHalfMove =
      Movement.distanceThisPhase({
        speed: car.status.speed,
        phase: match.time.phase.number,
      }) === 0.5
    if (
      forcedMove.maneuver === 'skid' ||
      forcedMove.maneuver === 'controlledSkid'
    ) {
      car.status.maneuvers = [forcedMove.maneuver]
      let skidDistance = forcedMove.maneuverDistance
      if (isHalfMove && skidDistance > INCH / 2) {
        skidDistance -= INCH / 2
      }
      let straightDistance = isHalfMove ? INCH / 2 : INCH
      straightDistance -= skidDistance
      car.phasing.rect._brPoint = car.phasing.rect
        .brPoint()
        .move({ degrees: forcedMove.maneuverDirection, distance: skidDistance })
      car.phasing.rect = car.phasing.rect.move({
        degrees: car.phasing.rect.facing,
        distance: straightDistance,
      })
    } else {
      // BUGBUG: not handled yet - just treat like it's not a control less
      return false
    }
    return true
  }

  static regularMove({ car, match }) {
    car.phasing.rect = car.rect
    const isHalfMove =
      Movement.distanceThisPhase({
        speed: car.status.speed,
        phase: match.time.phase.number,
      }) === 0.5
    if (isHalfMove) {
      Log.info('half move', car)
      car.status.maneuvers = ['half']
      car.phasing.rect = PhasingMove.forward({ car, distance: INCH / 2 })
    } else if (VehicleStatusHelper.canSteer(car)) {
      Log.info('all the moves')
      car.status.maneuvers = [
        //  'none',
        // 'half',
        // At the beginning of the turn, add/remove 'half' if the vehicle's speed
        // ends in 5.
        'forward',
        'bend',
        'drift',
        'swerve',
        // more
      ]
      car.phasing.rect = PhasingMove.forward({ car, distance: INCH })
    } else {
      Log.info('can only move forward', car)
      // dashboard light for this, maybe?
      car.status.maneuvers = ['forward']
      car.phasing.rect = PhasingMove.forward({ car, distance: INCH })
    }
  }

  static prepareActiveMover({ match, carId }) {
    let car = matchCars({ match }).find((obj) => obj.id === carId)
    car = PhasingMove.center({ car })

    if (car.status.speed === 0) {
      car.status.nextMove = []
    }
    Time.fishtailIfNeeded({ car })
    Time.nonfishtailForcedMove({ car, match }) ||
      Time.regularMove({ car, match })
    // Now we either skid or we don't.

    Collisions.detect({
      cars: matchCars({ match }),
      map: match.map,
      thisCar: car,
    })

    return car
  }
}

export default Time
