
import _ from 'lodash'
import Collisions from './Collisions'
import Control from './Control'
import { Maneuvers } from './Maneuvers'

import PhasingMove from './PhasingMove'
import { INCH } from '../utils/constants'
import Log from '../utils/Log'
import Targets from './Targets'
import VehicleStatusHelper from './VehicleStatusHelper'

import Time from './Time'
import Turn from './Turn'
import Movement from './Movement'

import { DATA,  matchCars } from '../DATA'
import Weapon from './Weapon'
import Dice from 'src/utils/Dice'

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

class Phase {
  static subphaseCheck(name, match) {
    if (match.time.phase.subphase !== name) {
      throw new Error(`Out of phase: ${match.time.phase.subphase} - expected ${name}`)
    }
  }

  static subphase1_start ({ match }) {
    Phase.subphaseCheck('1_start', match)
    match.time.phase.number = match.time.phase.number % 5 + 1
    if (match.time.phase.number === 1){
      Turn.next({ match })
      matchCars({match}).forEach(car => {
        car.status.speedChangedThisTurn = false
      })
    }
    match.time.phase.unmoved = Movement.canMoveThisPhase({ match })

    matchCars({match}).forEach(car => {
      car.phasing.showSpeedChangeModal = !car.status.speedChangedThisTurn
    })

    match.time.phase.subphase = '2_set_speeds'
    return Phase.subphase2_setSpeeds({ match })
  }

  static subphase2_setSpeeds ({ match }) {
    Phase.subphaseCheck('2_set_speeds', match)
    // do we need to start a new phase?
    let allReady = true
    let someoneChangedSpeed = false
    console.log()
    matchCars({match}).forEach(thisCar => {
      if (thisCar.status.speedChangedThisTurn) { someoneChangedSpeed = true }


      
      let ready = !thisCar.phasing.showSpeedChangeModal || thisCar.status.speedChangedThisTurn
      allReady = allReady && ready
      console.log(`    [${ready ? 'X' : ' '}] ${thisCar.id} - ${thisCar.color}` )
      console.log(`        [${thisCar.phasing.showSpeedChangeModal ? ' ' : 'X'}] modal dismissed this phase`)
      console.log(`        [${thisCar.status.speedChangedThisTurn ? 'X' : ' '}] speed changed this turn`)
    })
    console.log(`[${allReady ? 'X' : ' '}] all cars ready`)

    let finishedSettingSpeed = matchCars({match}).every(car => {
      return !car.phasing.showSpeedChangeModal || car.status.speedChangedThisTurn
    })

    /// prep for subphase_2_1_revealSpeedChange
    if (finishedSettingSpeed) {
      console.log('')
      console.log('finished setting speed')
      
      /*
      if (someoneChangedSpeed) {
        match.time.phase.playersToAckSpeedChange = matchCars({match}).map(car => car.playerId)
      } else {
        match.time.phase.playersToAckSpeedChange = []
      }
      */
      
      match.time.phase.subphase = 'prep_for_subphase_2_1_revealSpeedChange'
     // match.time.phase.subphase = '2_1_reveal_speed_change'
      Phase.prep_for_subphase_2_1_revealSpeedChange({ match })
    }
    return null
  }

  static prep_for_subphase_2_1_revealSpeedChange({ match }) {
    console.log('here')
    
    matchCars({match}).forEach(car => {
      console.log('-------------------')
      console.log(`---- ${car.color} ----`)
      console.log(car.phasing)
      console.log('-------------------')

      let newSpeed = car.phasing.speedChanges[car.phasing.speedChangeIndex].speed
      Log.info(`${car.status.speed}MPH -> ${newSpeed}MPH`, car)

      if (newSpeed === car.status.speed) { return }
      match.time.phase.playersToAckSpeedChange = matchCars({match}).map(car => car.playerId)

      console.log('also')
      // deal with difficulty from braking
      Log.info(`base HC: ${car.design.attributes.handlingClass}`, car)
      Log.info(`initial HC: ${car.status.handling}`, car)
      Log.info(`difficulty: D${car.phasing.difficulty}`, car)
      car.status.handling -= car.phasing.difficulty
      if (car.status.handling < -6) { car.status.handling = -6 }
      let result = Control.maneuverCheck({ car })
      Log.info(`maneuver check: ${result}`, car)
      Log.info(`current HC: ${car.status.handling}`, car)
      car.phasing.difficulty = 0
      // and with tire damage
      // leave this for subphase_2_1_revealSpeedChange to know
      // which cars to notify about
      car.phasing.damage.forEach(dam => {

        console.log(dam)

        if (dam.message !== 'tire damage') {  
          throw new Error(`unknown damage type in subphase_2_1_revealSpeedChange: ${dam.message}`)
        }

        console.log(car.design.components.tires)

        const tire = car.design.components.tires.find(elem => elem.location === dam.target.location)
        let init = tire.damagePoints

        console.log(tire)

        tire.damagePoints -= Dice.roll(dam.damageDice)
        if (tire.damagePoints < 0) { tire.damagePoints = 0 }
        dam.target.damage = init - tire.damagePoints
        tire.damageDice = ''
        console.log(`${dam.target.damage} damage to ${tire.location} tire`)
      })

      car.status.speedChangedThisTurn = true
      car.status.speed = newSpeed
    })

    match.time.phase.playersToAckSpeedChange = _.uniq(match.time.phase.playersToAckSpeedChange)
    console.log(match.time.phase.playersToAckSpeedChange)
    
    match.time.phase.subphase = '2_1_reveal_speed_change'
    Phase.subphase_2_1_revealSpeedChange({ match })
  }

  static subphase_2_1_revealSpeedChange ({ match }) {
    console.log('2.1. reveal')
    Phase.subphaseCheck('2_1_reveal_speed_change', match)
    if (match.time.phase.playersToAckSpeedChange.length > 0) {
      console.log(match.time.phase.playersToAckSpeedChange)
      console.log('not everyone has acknowledged')
      return
    }
    console.log('everyone has acknowledged')

    matchCars({ match }).forEach(car => car.phasing.damage = [] )
    match.time.phase.unmoved = Movement.canMoveThisPhase({ match })
    match.time.phase.subphase = '3_maneuver'
    Phase.subphase3_maneuver({ match })
  }

  static subphase3_maneuver({ match }) {
    console.log('3. maneuver')
    Phase.subphaseCheck('3_maneuver', match)
    match.time.phase.moving = Movement.nextToMoveThisPhase({ match })
    if (match.time.phase.moving) {
      let car = matchCars({match}).find(car => car.id === match.time.phase.moving)
      Phase.prepareActiveMover({ match, carId: car.id })
      return car
    }
    
    match.time.phase.canTarget = matchCars({match}).filter(car => {
      // just driver for now
      const crewMember = car.design.components.crew.find(member => member.role === 'driver')
      return !(crewMember.firedThisTurn || crewMember.damagePoints < 1)
    }).map(car => car.id)

    match.time.phase.subphase = '4_fire_weapons'
    Phase.subphase4_fireWeapons({ match })
  }

  static subphase4_fireWeapons({ match }) {
    Phase.subphaseCheck('4_fire_weapons', match)
    if (match.time.phase.canTarget.length > 0) { return }

    // prep for next phase
    let someoneTookDamage = false
    matchCars({ match }).forEach(targetCar => {
      targetCar.phasing.damage.forEach(damageRecord => {
        someoneTookDamage = true
        Weapon.dealDamage({
          damageRecord
        })
      })
    })

    if(someoneTookDamage) {
      match.time.phase.playersToAckDamage = _.uniq(matchCars({ match }).map(car => car.playerId))
    } else {
      match.time.phase.playersToAckDamage = []
    }
    
    match.time.phase.subphase = '5_damage'
    Phase.subphase5_damage({ match })
  }

  static subphase5_damage({ match}) {
    Phase.subphaseCheck('5_damage', match)
    if (match.time.phase.playersToAckDamage.length > 0) { return }

    match.time.phase.subphase = '6_end'
    Phase.subphase6_end({ match })
  }

  static subphase6_end({ match }) {
    Phase.subphaseCheck('6_end', match)
    // end of turn refresh?
    // check for match over

    matchCars({ match }).forEach(car => {
      car.phasing.damage = []
    })
      
    match.time.phase.subphase = '1_start'
    Phase.subphase1_start({ match })
  }

  static fishtailIfNeeded ({ car }) {
    let forcedMove = car.status.nextMove[0]
    if (typeof(forcedMove) === 'undefined' ||
        typeof(forcedMove.fishtailDistance) === 'undefined' ||
        forcedMove.fishtailDistance === 0) {
      return
    }
    Log.info(`fishtail ${forcedMove.spinDirection} ${forcedMove.fishtailDistance}`, car)
    if (forcedMove.spinDirection === 'left') {
      car.rect = car.rect.leftFrontCornerPivot(forcedMove.fishtailDistance)
    } else if (forcedMove.spinDirection === 'right') {
      car.rect = car.rect.rightFrontCornerPivot(-forcedMove.fishtailDistance)
    } else {
      throw new Error(`direction unknown: ${nextMove.spinDirection}`)
    }
    PhasingMove.fishtail({ car, degrees: forcedMove.fishtailDistance, direction: forcedMove.spinDirection })
  }

  static nonfishtailForcedMove ({ car, match }) {
    let forcedMove = car.status.nextMove[0]
    if (typeof(forcedMove) === 'undefined') { return false }
    const isHalfMove = Movement.distanceThisPhase({ speed: car.status.speed, phase: match.time.phase.number }) === 0.5
    if (forcedMove.maneuver === 'skid' || forcedMove.maneuver === 'controlledSkid') {
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
      // BUGBUG: not handled yet - just treat like it's not a control less
      return false
    }
    return true
  }

  static regularMove ({ car, match }) {
    car.phasing.rect = car.rect
    const isHalfMove = Movement.distanceThisPhase({ speed: car.status.speed, phase: match.time.phase.number }) === 0.5
    Log.info(`Time#nextMover did not skid ${car.color}`, car)
    if (isHalfMove) {
      Log.info('half move', car)
      car.status.maneuvers = ['half']
      car.phasing.rect = PhasingMove.forward({ car, distance: INCH / 2 })
    } else if (VehicleStatusHelper.canSteer(car)) {
      Log.info('all the moves')
      car.status.maneuvers = Maneuvers()
      car.phasing.rect = PhasingMove.forward({ car, distance: INCH })
    } else {
      Log.info('can only move forward', car)
      // dashboard light for this, maybe?
      car.status.maneuvers = ['forward']
      car.phasing.rect = PhasingMove.forward({ car, distance: INCH })
    }
  }

  static prepareActiveMover({ match, carId }) {
    let car = matchCars({ match }).find(obj => obj.id === carId)
    car = PhasingMove.center({ car })

    if (car.status.speed === 0) { car.status.nextMove = [] }
    Phase.fishtailIfNeeded ({ car })
    Phase.nonfishtailForcedMove ({ car, match }) || Phase.regularMove ({ car, match })
    // Now we either skid or we don't.

    Log.info(`Time#nextMover facing:  ${car.rect.facing}/${car.phasing.rect.facing}`, car)
    Collisions.detect({ cars: matchCars({match}), map: match.map, thisCar: car })

    return car
  }
}

export default Phase