import _ from 'lodash'
import Dice from '../utils/Dice'
import { DATA } from '../DATA'
import { INCH } from '../utils/constants'
import Log from '../utils/Log'
import Character from './Character'
import Collisions from './Collisions'
import Control from './Control'
import Damage from './Damage'
import Match from './Match'
import MetaMovement from './MetaMovement'
import PhasingMove from './PhasingMove'
import Vehicle from './Vehicle'
import Rectangle from '../utils/geometry/Rectangle'

/*
subphases:
1_start
2_set_speeds
3_reveal_speed_change
4_maneuver
5_fire_weapons
6_damage
7_end
*/

class Time {
  static matchStart({ match }: { match: any }) {
    const characters = Match.characters({ match })
    const tieBreakers = _.shuffle([...Array(characters.length).keys()])
    characters.forEach((character: any) => {
      // BUGBUG: really only do reflexes for vehicle being piloted
      const skillLevel = Character.skillLevel({ skill: 'driver', character })
      character.reflexRoll = Dice.roll('1d') + (skillLevel < 0 ? 0 : skillLevel)
      character.reflexTieBreaker = tieBreakers.shift()
      Log.info(`reflex roll: ${character.reflexRoll}; tie breaker: ${character.reflexTieBreaker}`, character)
    })


    const matchCars = Match.cars({ match })
    
    matchCars.forEach((vehicle: any) => {
      const driver = Vehicle.driver({ vehicle })
      const skillLevel = Character.skillLevel({ skill: 'driver', character: driver })

      if (driver.reflexRoll === 5) {
        vehicle.design.attributes.handlingClass += 1
        Log.info(`${driver.name}'s reflexes (${driver.reflexRoll}): HC+1`, vehicle)
      }
      if (driver.reflexRoll > 5) {
        vehicle.design.attributes.handlingClass += 2
        Log.info(`${driver.name}'s reflexes (${driver.reflexRoll}): HC+2`, vehicle)
      }

      if (skillLevel < 0) {
        vehicle.design.attributes.handlingClass -= 2
        Log.info(`${driver.name} does not have base driving skill: HC-2`, vehicle)
      }

      vehicle.phasing.showSpeedChangeModal = true
    })
    match.status = 'started'
    Time.subphase1Start({ match })
  }

  static slowTheDead({ match }: { match: any }) {
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

    const vehicles = Match.cars({ match })
    vehicles.forEach((vehicle: any) => {
      const driverOut = !Vehicle.driverAwake({ vehicle })
      const plantOut = Vehicle.plantOut({ vehicle })
      const needMoreWheels = !Vehicle.enoughWheels({ vehicle })
      Log.info(
        `slowTheDead: driverOut[${driverOut ? 'X' : ' '}] plantOut[${plantOut ? 'X' : ' '}] needMoreWheels[${
          needMoreWheels ? 'X' : ' '
        }]`,
        vehicle,
      )
      const amountSlowed = needMoreWheels ? 30 : 5
      if (driverOut || plantOut || needMoreWheels) {
        if (vehicle.status.speed > 0) {
          vehicle.status.speed -= amountSlowed
        }
        if (vehicle.status.speed < 0) {
          vehicle.status.speed += amountSlowed
        }
        if (Vehicle.isKilled({ vehicle })) {
          vehicle.status.killed = true
          vehicle.status.nextMove = []
        }
        vehicle.phasing.speedChangeIndex = 0
        vehicle.phasing.speedChanges = [{ speed: vehicle.status.speed, difficulty: 0, damageDice: '0d' }]
        Log.info(`slowing car ${vehicle.id} by ${amountSlowed} MPH to ${vehicle.status.speed}`, vehicle)
      }
    })
  }

  static nextTurn({ match }: { match: any }) {
    // BUGBUG: check for game over

    // bump hc up, mark cars to be able to change speed, etc.
    match.time.turn.number += 1

    Match.cars({ match }).forEach((vehicle: any) => {
      vehicle.design.components.weapons.forEach((weapon: any) => {
        weapon.firedThisTurn = false
      })
      let handlingRecovery = vehicle.design.attributes.handlingClass
      if (handlingRecovery < 1) {
        handlingRecovery = 1
      }
      vehicle.status.handling += handlingRecovery
      if (vehicle.status.handling > vehicle.design.attributes.handlingClass) {
        vehicle.status.handling = vehicle.design.attributes.handlingClass
      }
    })

    Match.characters({ match }).forEach((character: any) => {
      character.firedThisTurn = false
    })
    Time.slowTheDead({ match })
    match.time.turn.movesByPhase = MetaMovement.allMovesThisTurn({ match })
  }

  static subphaseCheck(name: string, match: any) {
    if (match.time.phase.subphase !== name) {
      switch (match.time.phase.subphase) {
        case '1_start':
          return Time.subphase1Start({ match })
        case '2_set_speeds':
          return Time.subphase2SetSpeeds({ match })
        case '3_reveal_speed_change':
           return Time.subphase3RevealSpeedChange({ match })
        case '4_maneuver':
          return Time.subphase4Maneuver({ match })
        case '5_fire_weapons':
          return Time.subphase5FireWeapons({ match })
        case '6_damage':
          return Time.subphase6Damage({ match })
        case '7_end':
          return Time.subphase7End({ match })
        default:
          throw new Error(`I give up. What's "${match.time.phase.subphase}"???`)
      }
    }
  }

  static subphase1Start({ match }: { match: any }) {
    Time.subphaseCheck('1_start', match)
    match.time.phase.number = (match.time.phase.number % 5) + 1
    if (match.time.phase.number === 1) {
      Time.nextTurn({ match })
      Match.cars({ match }).forEach((vehicle: any) => {
        vehicle.status.speedSetThisTurn = false
        vehicle.status.speedInitThisTurn = vehicle.status.speed
      })
    }
    match.time.phase.unmoved = MetaMovement.canMoveThisPhase({ match })
    Match.cars({ match }).forEach((vehicle: any) => {
      vehicle.phasing.showSpeedChangeModal = !vehicle.status.speedSetThisTurn
    })
    match.time.phase.subphase = '2_set_speeds'
    return Time.subphase2SetSpeeds({ match })
  }

  static subphase2SetSpeeds({ match }: { match: any }) {
//    Time.subphaseCheck('2_set_speeds', match)
    // do we need to start a new phase?
    let allReady = true
    Match.cars({ match }).forEach((thisCar: any) => {
      const ready = !thisCar.phasing.showSpeedChangeModal || thisCar.status.speedSetThisTurn
      allReady = allReady && ready
      // console.log(`    [${ready ? 'X' : ' '}] ${thisCar.id} - ${thisCar.color}`)
      // console.log(`        [${thisCar.phasing.showSpeedChangeModal ? ' ' : 'X'}] modal dismissed this phase`)
      // console.log(`        [${thisCar.status.speedSetThisTurn ? 'X' : ' '}] speed changed this turn`)
    })
    // console.log(`[${allReady ? 'X' : ' '}] all cars ready`)

    const finishedSettingSpeed = Match.cars({ match }).every((vehicle: any) => {
      return !vehicle.phasing.showSpeedChangeModal || vehicle.status.speedSetThisTurn
    })

    /// prep for subphase_3_revealSpeedChange
    if (finishedSettingSpeed) {
      match.time.phase.subphase = 'prep_for_subphase_3_revealSpeedChange'
      Time.prepForSubphase3RevealSpeedChange({ match })
    }
    return null
  }

  static prepForSubphase3RevealSpeedChange({ match }: { match: any }) {
    Match.cars({ match }).forEach((vehicle: any) => {
      const newSpeed = vehicle.phasing.speedChanges[vehicle.phasing.speedChangeIndex].speed
      Log.info(`${vehicle.status.speed}MPH -> ${newSpeed}MPH`, vehicle)

      if (newSpeed === vehicle.status.speed) {
        return
      }
      match.time.phase.playersToAckSpeedChange = Match.cars({ match }).map((vehicle: any) => vehicle.playerId)

      // deal with difficulty from braking
      Log.info(`base HC: ${vehicle.design.attributes.handlingClass}`, vehicle)
      Log.info(`initial HC: ${vehicle.status.handling}`, vehicle)
      Log.info(`difficulty: D${vehicle.phasing.difficulty}`, vehicle)
      vehicle.status.handling -= vehicle.phasing.difficulty
      if (vehicle.status.handling < -6) {
        vehicle.status.handling = -6
      }
      const result = Control.maneuverCheck({ vehicle })
      Log.info(`maneuver check: ${result}`, vehicle)
      Log.info(`current HC: ${vehicle.status.handling}`, vehicle)
      vehicle.phasing.difficulty = 0
      // and with tire damage
      // leave this for subphase_3_revealSpeedChange to know
      // which cars to notify about
      vehicle.phasing.damage.forEach((dam: any) => {
        if (dam.message !== 'tire damage') {
          throw new Error(`unknown damage type in subphase_3_revealSpeedChange: ${dam.message}`)
        }

        const tire = vehicle.design.components.tires.find((elem: any) => elem.location === dam.target.location)
        const init = tire.damagePoints

        tire.damagePoints -= Dice.roll(dam.damageDice)
        if (tire.damagePoints < 0) {
          tire.damagePoints = 0
        }
        dam.target.damage = init - tire.damagePoints
        tire.damageDice = ''
      })

      vehicle.status.speedSetThisTurn = true
      vehicle.status.speed = newSpeed
    })

    match.time.turn.movesByPhase = MetaMovement.allMovesThisTurn({ match })

    match.time.phase.playersToAckSpeedChange = _.uniq(match.time.phase.playersToAckSpeedChange)

    match.time.phase.subphase = '3_reveal_speed_change'
    Time.subphase3RevealSpeedChange({ match })
  }

  static subphase3RevealSpeedChange({ match }: { match: any }) {
    if (match.time.phase.playersToAckSpeedChange.length > 0) {
      return
    }
    Time.subphaseCheck('3_reveal_speed_change', match)
    Match.cars({ match }).forEach((vehicle: any) => (vehicle.phasing.damage = []))

    match.time.phase.unmoved = MetaMovement.canMoveThisPhase({ match })
    //match.time.phase.unmoved = match.time.turn.movesByPhase[match.time.phase.number - 1]
    match.time.phase.subphase = '4_maneuver'
    Time.subphase4Maneuver({ match })
  }

  static subphase4Maneuver({ match }: { match: any }) {
    Time.subphaseCheck('4_maneuver', match)
    match.time.phase.moving = MetaMovement.nextToMoveThisPhase({ match })
    if (match.time.phase.moving) {
      const vehicle = Match.cars({ match }).find((vehicle: any) => vehicle.id === match.time.phase.moving)
      Time.prepareActiveMover({ match, carId: vehicle.id })
      return vehicle
    }
    match.time.phase.canTarget = Match.cars({ match })
      .filter((vehicle: any) => {
        // just driver for now 
        const crewMember = Vehicle.driver({ vehicle })
        return !(crewMember.firedThisTurn || crewMember.damagePoints < 1)
      })
      .map((vehicle: any) => vehicle.id)

    match.time.phase.subphase = '5_fire_weapons'
    Time.subphase5FireWeapons({ match })
  }

  static subphase5FireWeapons({ match }: { match: any }) {
    Time.subphaseCheck('5_fire_weapons', match)
    if (match.time.phase.canTarget.length > 0) {
      return
    }

    // prep for next phase
    let someoneTookDamage = false
    Match.cars({ match }).forEach((targetCar: any) => {
      targetCar.phasing.damage.forEach((damageRecord: any) => {
        someoneTookDamage = true
        Damage.dealDamage({
          damageRecord,
        })
      })
    })

    if (someoneTookDamage) {
      match.time.phase.playersToAckDamage = _.uniq(Match.cars({ match }).map((vehicle: any) => vehicle.playerId))
    } else {
      match.time.phase.playersToAckDamage = []
    }

    match.time.phase.subphase = '6_damage'
    Time.subphase6Damage({ match })
  }

  static subphase6Damage({ match }: { match: any }) {
    Time.subphaseCheck('6_damage', match)
    if (match.time.phase.playersToAckDamage.length > 0) {
      return
    }
    match.time.phase.subphase = '7_end'
    Time.subphase7End({ match })
  }

  static subphase7End({ match }: { match: any }) {
    Time.subphaseCheck('7_end', match)
    // end of turn refresh?
    // check for match over

    Match.cars({ match }).forEach((vehicle: any) => {
      vehicle.phasing.damage = []
    })

    match.time.phase.subphase = '1_start'
    Time.subphase1Start({ match })
  }

  static fishtailIfNeeded({ vehicle }: { vehicle: any }) {
    const forcedMove = vehicle.status.nextMove[0]
    if (
      typeof forcedMove === 'undefined' ||
      typeof forcedMove.fishtailDistance === 'undefined' ||
      forcedMove.fishtailDistance === 0
    ) {
      return
    }
    Log.info(`fishtail ${forcedMove.spinDirection} ${forcedMove.fishtailDistance}`, vehicle)
    if (forcedMove.spinDirection === 'left') {
      vehicle.rect = vehicle.rect.frontLeftCornerPivot(forcedMove.fishtailDistance)
    } else if (forcedMove.spinDirection === 'right') {
      vehicle.rect = vehicle.rect.frontRightCornerPivot(-forcedMove.fishtailDistance)
    } else {
      throw new Error(`direction unknown: ${forcedMove.spinDirection}`)
    }
    PhasingMove.fishtail({
      vehicle,
      degrees: forcedMove.fishtailDistance,
      direction: forcedMove.spinDirection,
    })
  }

  static nonfishtailForcedMove({ vehicle, match }: { vehicle: any, match: any }) {
    const forcedMove = vehicle.status.nextMove[0]
    if (typeof forcedMove === 'undefined') {
      return false
    }
    const isHalfMove =
      MetaMovement.distanceThisPhase({
        speed: vehicle.status.speed,
        phase: match.time.phase.number,
      }) === 0.5
    if (forcedMove.maneuver === 'skid' || forcedMove.maneuver === 'controlledSkid') {
      vehicle.status.maneuvers = [forcedMove.maneuver]
      let skidDistance = forcedMove.maneuverDistance
      if (isHalfMove && skidDistance > INCH / 2) {
        skidDistance -= INCH / 2
      }
      let straightDistance = isHalfMove ? INCH / 2 : INCH
      straightDistance -= skidDistance
      vehicle.phasing.rect._brPoint = vehicle.phasing.rect
        .brPoint()
        .move({ degrees: forcedMove.maneuverDirection, distance: skidDistance })
      vehicle.phasing.rect = vehicle.phasing.rect.move({
        degrees: vehicle.phasing.rect.facing,
        distance: straightDistance,
      })
    } else {
      // BUGBUG: not handled yet - just treat like it's not a control less
      return false
    }
    return true
  }

  static regularMove({ vehicle, match }: { vehicle: any, match: any }) {
    vehicle.phasing.rect = vehicle.rect.clone()
    const isHalfMove =
      MetaMovement.distanceThisPhase({
        speed: vehicle.status.speed,
        phase: match.time.phase.number,
      }) === 0.5
    if (isHalfMove) {
      if (Vehicle.canSteer({ vehicle }) && Math.abs(vehicle.status.speed) == 5) {
        Log.info('half move', vehicle)
        vehicle.status.maneuvers = ['half', 'pivot']
        vehicle.phasing.rect = PhasingMove.straight({ vehicle, distance: INCH / 2 })
      } else {
        Log.info('half move', vehicle)
        vehicle.status.maneuvers = ['half']
        vehicle.phasing.rect = PhasingMove.straight({ vehicle, distance: INCH / 2 })
      }
    } else if (Vehicle.canSteer({ vehicle })) {
      Log.info('all the moves', vehicle)
      vehicle.status.maneuvers = [
        //  'none',
        // 'half',
        // At the beginning of the turn, add/remove 'half' if the vehicle's speed
        // ends in 5.
        'straight',
        'bend',
        'drift',
        'swerve',
        // more
      ]
      vehicle.phasing.rect = PhasingMove.straight({ vehicle, distance: INCH })
    } else {
      // dashboard light for this, maybe?
      vehicle.status.maneuvers = ['straight']
      vehicle.phasing.rect = PhasingMove.straight({ vehicle, distance: INCH })
    }
  }

  static prepareActiveMover({ match, carId }: { match: any, carId: string }) {
    let vehicle = Match.cars({ match }).find((obj: any) => obj.id === carId)
    vehicle.rect = PhasingMove.center({ vehicle })

    if (vehicle.status.speed === 0) {
      vehicle.status.nextMove = []
    }
    Time.fishtailIfNeeded({ vehicle })
    Time.nonfishtailForcedMove({ vehicle, match }) || Time.regularMove({ vehicle, match })
    // Now we either skid or we don't.
    Collisions.detect({
      cars: Match.cars({ match }),
      map: match.map,
      thisCar: vehicle,
    })
    const move = vehicle.status.nextMove[0]

    return vehicle
  }
}

export default Time
