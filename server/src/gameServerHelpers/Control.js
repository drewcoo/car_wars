import Dice from '../utils/Dice'
import { INCH } from '../utils/constants'
import Log from '../utils/Log'

class Control {
  static foo () {
    return 'bar'
  }

  static table = [
    ['safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', '2'], // 5-10
    ['safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', '2', '3'],
    ['safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', '2', '4'],
    ['safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', '2', '3', '4'],
    ['safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', '2', '3', '4', '5'], // 45-50
    ['safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', '2', '3', '4', '4', '5'],
    ['safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', '2', '3', '4', '5', '6'],
    ['safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', '3', '4', '5', '5', '6'],
    ['safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', '2', '3', '5', '5', '6', 'XX'],
    ['safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', '2', '4', '5', '6', '6', 'XX'], // 95-100
    ['safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', '3', '4', '6', '6', 'XX', 'XX'],
    ['safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', '2', '3', '5', '6', 'XX', 'XX', 'XX'],
    ['safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', '2', '4', '5', '6', 'XX', 'XX', 'XX'],
    ['safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', '3', '4', '6', 'XX', 'XX', 'XX', 'XX']
    ['safe', 'safe', 'safe', 'safe', 'safe', 'safe', '2', '3', '5', '6', 'XX', 'XX', 'XX', 'XX'], // 145-150
    ['safe', 'safe', 'safe', 'safe', 'safe', 'safe', '2', '4', '5', '6', 'XX', 'XX', 'XX', 'XX'],
    ['safe', 'safe', 'safe', 'safe', 'safe', 'safe', '3', '4', '6', 'XX', 'XX', 'XX', 'XX', 'XX'],
    ['safe', 'safe', 'safe', 'safe', 'safe', '2', '3', '5', '6', 'XX', 'XX', 'XX', 'XX', 'XX'],
    ['safe', 'safe', 'safe', 'safe', 'safe', '2', '4', '5', '6', 'XX', 'XX', 'XX', 'XX', 'XX'],
    ['safe', 'safe', 'safe', 'safe', 'safe', '3', '4', '6', 'XX', 'XX', 'XX', 'XX', 'XX', 'XX'], // 195-200
    ['safe', 'safe', 'safe', 'safe', '2', '3', '5', '6', 'XX', 'XX', 'XX', 'XX', 'XX', 'XX'],
    ['safe', 'safe', 'safe', 'safe', '2', '4', '5', '6', 'XX', 'XX', 'XX', 'XX', 'XX', 'XX'],
    ['safe', 'safe', 'safe', 'safe', '3', '4', '6', 'XX', 'XX', 'XX', 'XX', 'XX', 'XX', 'XX'],
    ['safe', 'safe', 'safe', '2', '3', '5', '6', 'XX', 'XX', 'XX', 'XX', 'XX', 'XX', 'XX'],
    ['safe', 'safe', 'safe', '2', '4', '5', '6', 'XX', 'XX', 'XX', 'XX', 'XX', 'XX', 'XX'], // 245-250
    ['safe', 'safe', '2', '3', '4', '6', 'XX', 'XX', 'XX', 'XX', 'XX', 'XX', 'XX', 'XX'],
    ['safe', 'safe', '2', '3', '5', '6', 'XX', 'XX', 'XX', 'XX', 'XX', 'XX', 'XX', 'XX'],
    ['safe', '2', '3', '4', '5', '6', 'XX', 'XX', 'XX', 'XX', 'XX', 'XX', 'XX', 'XX'],
    ['safe', '2', '3', '4', '6', 'XX', 'XX', 'XX', 'XX', 'XX', 'XX', 'XX', 'XX', 'XX'],
    ['safe', '3', '4', '5', '6', 'XX', 'XX', 'XX', 'XX', 'XX', 'XX', 'XX', 'XX', 'XX'] // 295-300
  ]

  static statusIndex = [7, 6, 5, 4, 3, 2, 1, 0, -1, -2, -3, -4, -5, -6]

  static row({ speed }) {
    let absSpeed = Math.abs(speed)
    if (absSpeed <= 5) {
      return ['safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe']
    }
    let tableRow = Math.ceil(absSpeed / 10) - 1
    return Control.table[tableRow]
  }

  static crashModifier({ speed }) {
    let absSpeed = Math.abs(speed)
    if (absSpeed <= 5) {
      return null
    }
    let tableRow = Math.ceil(absSpeed / 10) - 1
    let mods = [-3, -2, -1, 0, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9]
    return mods[tableRow]
  }

  static checkNeeded({ speed, handlingStatus }) {
    Log.info('in checkNeeded', )
    let row = Control.row({ speed })
    if (row === null) {
      Log.info('too slow - no crash roll')
      return 'safe'
    }
    if (speed === 0) {
      Log.info('speed 0 - SAFE', car)
      return 'safe'
    }
    Log.info(`checkneeded - handling status: ${handlingStatus} at speed ${speed}:`)
    Log.info(Control.statusIndex)
    Log.info(`column = ${Control.statusIndex.indexOf(handlingStatus)}`)
    let column = Control.statusIndex.indexOf(handlingStatus)
    Log.info(row.map((value, index) => {
      return (index === column) ? `[${value}]` : value
    }).join())
    Log.info(`needed? ${row[column]}`)
    return row[column]
  }

  static loseControl({ car }) {
    Log.info('in loseControl', car)
    let needed = Control.checkNeeded({ speed: car.status.speed, handlingStatus: car.status.handling })
    Log.info(needed, car)
    if (needed === 'safe') { return false }
    if (needed === 'XX') { return true }
    let roll = Dice.roll()
    Log.info(`control roll: ${roll}`, car)
    if (roll >= needed) { return false }
    return true
  }

  static spinDirection() {
    let result = (Math.floor(Math.random() * 2) == 0) ? 'right' : 'left'
    return result
  }

  // between failed maneuver checks and bootleggers (and other?),
  // should I add a "next turn"

  // pass in a car and get everything from it?
  // also set everything on it, including moving it plus future moves
  // a.k.a. Table 2
  static hazardCheck({ car, hazard }) {
    let result = 'pass'
    Log.info('hazard check', car)
    Log.info(`handling: ${car.status.handling} - ${hazard} = ${car.status.handling - hazard}`, car)
    car.status.handling -= hazard
    if (car.status.handling < -6) { car.status.handling = -6 }
    let skillBonus = 0 // BUGBUG: get from character + reflex instead
    if (!Control.loseControl({ car })) {
      Log.info(`passed control check`, car)
      return result
    }
    Log.info('lose control!', car)
    let dieRoll = Dice.roll('2d')
    Log.info(`roll (2d6): ${dieRoll}`, car)
    Log.info(`+ D${hazard}`, car)
    let crashModifier = Control.crashModifier({ speed: car.status.speed })
    Log.info(`+ crash modifier: ${crashModifier}`, car)
    Log.info(`- skill bonus: ${skillBonus}`, car)

    let crashRoll = dieRoll + hazard - skillBonus + crashModifier
    Log.info(`total crash roll: ${crashRoll}`, car)

    Log.info(`${car.color} FISHTAILS!`, car)

    if (typeof car.status.nextMove[0] === 'undefined') {
      car.status.nextMove[0] = {
        spinDirection: '',
        fishtailDistance: 0,
        maneuver: null,
        maneuverDirection: null,
        maneuverDistance: 0
      }
    }

    let spinDirection = (car.status.nextMove[0].spinDirection != '') ? car.status.nextMove[0].spinDirection : Control.spinDirection()
    Log.info(`fishtail to the ${spinDirection}`, car)
    Log.info(crashRoll, car)
    Log.info(`initial result: ${result}`, car)
    let oldDistance = Math.abs(car.status.nextMove[0].fishtailDistance)
    console.log(`old distance: ${oldDistance}`)
    if (crashRoll <= 4) {
      Log.info('<= 4', car)
      if (oldDistance < 15) {
        car.status.nextMove[0].fishtailDistance = 15
        car.status.nextMove[0].spinDirection = spinDirection
        // Any further aimed weapon fire from Control vehicle on Control turn will be at a −3 to hit
        result = 'minor fishtail - 1/4"'
      } else {
        result = 'NOT a minor fishtail - 1/4"'
      }
      Log.info(result, car)
    } else if (crashRoll <= 8) {
      Log.info('<= 8', car)
      if (Math.abs(car.status.nextMove[0].fishtailDistance) < 30) {
        car.status.nextMove[0].fishtailDistance = 30
        car.status.nextMove[0].spinDirection = spinDirection
        // Any further aimed weapon fire from Control vehicle on Control turn will be at a −6 to hit
        result = 'major fishtail - 1/2"'
      } else {
        result = 'NOT a major fishtail - 1/2"'
      }
      Log.info(result, car)
    } else if (crashRoll <= 10) {
      Log.info('<= 10', car)
      if (car.status.nextMove[0].maneuver === null) {
        car.status.nextMove[0].fishtailDistance = 15
        car.status.nextMove[0].spinDirection = spinDirection
        Log.info('fishtail 1/4" plus maneuver check . . .', car)
        let maneuverCheckString = Control.maneuverCheck({ car })
        // Any further aimed weapon fire from Control vehicle on Control turn will be at a −6 to hit
        result = `minor fishtail (1/4") and ${maneuverCheckString}`
      } else {
        result = `NOT a minor fishtail (1/4") plus crash table 1`
      }
      Log.info(result, car)
    } else if (crashRoll <= 14) {
      Log.info('<= 14', car)
      if (Math.abs(car.status.nextMove[0].fishtailDistance) < 30 ||
        car.status.nextMove[0].maneuver === null) {
        car.status.nextMove[0].fishtailDistance = 30
        car.status.nextMove[0].spinDirection = spinDirection
        Log.info('fishtail 1/2" plus maneuver check . . .', car)
        let maneuverCheckString = Control.maneuverCheck({ car })
        // No further aimed weapon fire permitted from Control vehicle Control turn
        result = `major fishtail (1/2") and ${maneuverCheckString}`
      } else {
        result = `NOT a major fishtail (1/2") plus crash table 1`
      }
      Log.info(result, car)
    } else {
      Log.info('> 14', car)
      if (Math.abs(car.status.nextMove[0].fishtailDistance) < 45) {
        car.status.nextMove[0].fishtailDistance = 45
        car.status.nextMove[0].spinDirection = spinDirection
        Log.info('fishtail 3/4" plus maneuver check . . .', car)
        let maneuverCheckString = Control.maneuverCheck({ car })
        // No further aimed weapon fire permitted from Control vehicle Control turn
        result = `3/4" fishtail and ${maneuverCheckString}`
      } else {
        result = `NOT a 3/4" fishtail plus crash table 1`
      }
      Log.info(result, car)
    }
    Log.info(result, car)
    console.log(car.status)
    return result
  }

  // pass in a car and get everything from it?
  // also set everything on it, including moving it plus future moves
  // a.k.a. Table 1
  static maneuverCheck({ car }) {
    Log.info('maneuver check', car)
    let skillBonus = 0 // BUGBUG: get from character + reflex instead
    let result = 'no change'
    if (car.phasing.difficulty === 0) { return result } // no maneuver; no check
    if (!Control.loseControl({ car })) { return result }
    let dieRoll = Dice.roll('2d')
    Log.info(`die roll(2d): ${dieRoll}`, car)
    let modifiedDifficulty = car.phasing.difficulty - 3
    Log.info(`+ modified difficulty: ${modifiedDifficulty}`, car)
    Log.info(`- skill modifier: ${skillBonus}`, car)
    let crashModifier = Control.crashModifier({ speed: car.status.speed })
    Log.info(`+ crash modifier at speed ${car.status.speed}: ${crashModifier}`, car)
    let crashRoll = dieRoll + modifiedDifficulty - skillBonus + crashModifier
    Log.info(`${car.color} LOST CONTROL!!! crash roll number: ${crashRoll}`, car)

    if (typeof car.status.nextMove[0] === 'undefined') {
      car.status.nextMove[0] = {
        spinDirection: '',
        fishtailDistance: 0,
        maneuver: null,
        maneuverDirection: null,
        maneuverDistance: 0
      }
    }
    Log.info(`spinDirection: ${car.status.nextMove[0].spinDirection}`, car)

    if (crashRoll <= 2) {
      Log.info('in <= 2', car)
      if (car.status.nextMove[0].maneuver === null) {
        // do Control next turn: PhasingMove.skid({ car, INCH / 4 })
        // Any further aimed weapon fire from Control vehicle on Control turn will be at a −3 to hit
        car.status.nextMove[0].maneuver = 'skid'
        car.status.nextMove[0].maneuverDirection = car.rect.facing
        car.status.nextMove[0].maneuverDistance = INCH / 4
        result = 'trivial skid - 1/4"'
      } else {
        result = 'NOT a trivial skid - 1/4"'
      }
      Log.info(result, car)
    } else if (crashRoll <= 4) {
      Log.info('in <= 4', car)
      let distance = INCH / 2
      if (car.status.nextMove[0].maneuver === null ||
          (car.status.nextMove[0].maneuver === 'skid' && car.maneuverDistance < distance)
        ) {
        // do Control next turn: PhasingMove.skid({ car, INCH / 2 })
        car.status.speed -= 5
        // Any further aimed weapon fire from Control vehicle on Control turn will be at a −6 to hit
        car.status.nextMove[0].maneuver = 'skid'
        car.status.nextMove[0].maneuverDirection = car.rect.facing
        car.status.nextMove[0].maneuverDistance = distance
        result = 'minor skid - 1/2"'
      } else {
        result = 'NOT a minor skid - 1/2"'
      }
      Log.info(result, car)
    } else if (crashRoll <= 6) {
      Log.info('in <= 6', car)
      let distance = INCH * 3 / 4
      if (car.status.nextMove[0].maneuver === null ||
          (car.status.nextMove[0].maneuver === 'skid' && car.maneuverDistance < distance)
        ) {
        // do Control next turn: PhasingMove.skid({ car, INCH * 3/4 })
        car.status.speed -= 10
        // each tire loses 1 DP
        // No further aimed weapon fire permitted from Control vehicle Control turn
        // trivial skid on next move
        car.status.nextMove[0] = {
          spinDirection: car.status.nextMove[0].spinDirection,
          fishtailDistance: car.status.nextMove[0].fishtailDistance || 0,
          maneuver: 'skid',
          maneuverDirection: car.rect.facing,
          maneuverDistance: distance
        }
        car.status.nextMove[1] = {
          spinDirection: '',
          fishtailDistance: 0,
          maneuver: 'skid',
          maneuverDirection: car.rect.facing,
          maneuverDistance: INCH / 4
        }
        result = 'moderate skid - 3/4"'
      } else {
        result = 'NOT a moderate skid - 3/4"'
      }
      Log.info(result, car)
    } else if (crashRoll <= 8) {
      Log.info('in <= 8', car)
      let distance = INCH
      if (car.status.nextMove[0].maneuver === null ||
          (car.status.nextMove[0].maneuver === 'skid' && car.maneuverDistance < distance)
        ) {
        // No further aimed weapon fire permitted from Control vehicle Control turn
        car.status.speed -= 20
        car.status.nextMove[0] = {
          spinDirection: car.status.nextMove[0].spinDirection,
          fishtailDistance: car.status.nextMove[0].fishtailDistance || 0,
          maneuver: 'skid',
          maneuverDirection: car.rect.facing,
          maneuverDistance: distance
        }
        car.status.nextMove[1] = {
          spinDirection: '',
          fishtailDistance: 0,
          maneuver: 'skid',
          maneuverDirection: car.rect.facing,
          maneuverDistance: INCH / 2
        }
        result = 'severe skid - 1"'
      } else {
        result = 'NOT a severe skid - 1"'
      }
      Log.info(result, car)
    } else if (crashRoll <= 10) {
      Log.info('in <= 10', car)
      // spinout
      console.log(car.status.nextMove[0].spinDirection)
      let direction = (typeof car.status.nextMove[0] === 'undefined') ? Control.spinDirection() : car.status.nextMove[0].spinDirection
      console.log(`spin dir: ${direction}`)
      console.log(`speed: ${car.status.speed}`)
      let quarterTurns = Math.ceil(car.status.speed / 20)
      console.log(`${quarterTurns} quarter turns`)
      for(let i = 0; i < quarterTurns; i++) {
        console.log(`i: ${i}`)
        let Distance = 0
        if (typeof car.status.nextMove[i] != 'undefined' &&
            typeof car.status.nextMove[i].fishtailDistance != 'undefined') {
          fishtailDistance = car.status.nextMove[i].fishtailDistance
        }
        console.log(`typeof direction: ${typeof direction}`)
        console.log(`typeof string: ${typeof "foo"}`)

        car.status.nextMove[i] = {
          spinDirection: direction,
          fishtailDistance: fishtailDistance,
          maneuver: 'spinout',
          maneuverDirection: car.rect.facing,
          maneuverDistance: 0
        }

      }
      console.log('status?')
      console.log(car.status)
      // Vehicle spins, rotating
      // 90° and moving 1” in the direction it was
      // previously traveling (before the maneuver
      // or hazard which caused the spinout) per
      // phase of movement required. All rotations
      // must be in the same direction. If the vehicle fishtailed into the spinout, the rotations
      // are in the same direction the fishtail took;
      // otherwise, roll randomly. Each tire takes
      // 1d of damage at the start of the spinout.
      // The vehicle decelerates 20 mph/turn, and
      // the spin stops when the vehicle comes to
      // a halt. A driver may try to recover from a
      // spinout. To do so, roll for control at HC −6.
      // If the roll is successful the spinout stops.
      // If the roll is missed the spinout continues
      // normally. If control is regained, and the
      // vehicle is facing the direction it is moving,
      // movement continues on as usual. If the car
      // is facing sideways it must perform an immediate T-stop. It may discontinue a T-stop
      // by turning “into” the direction of the skid
      // and then continue the turn. If the vehicle
      // is facing backward and is traveling faster
      // than its reverse top speed, it must slow
      // down by at least 5 mph per turn until it is
      // under its normal top speed for reverse.***

      // No further aimed weapon fire permitted from Control vehicle Control turn
      console.log('set up spinout')
      result = 'spinout'
      Log.info(result, car)
    } else if (crashRoll <= 12) {
      Log.info('in <= 12', car)
      car.status.nextMove[0].maneuver = 'turn sideways and roll'
      // Car turns sideways (as in a Tstop; see Figure 7, p. 14) and rolls. The
      // driver is no longer in control. The car decelerates at 20 mph per turn. Each phase
      // it moves, it goes 1” in the direction it was
      // traveling and rolls 1/4 of a complete roll –
      // e.g., in the first phase it moves 1”, turns
      // sideways, and rolls onto its side; the next
      // phase it moves, it goes 1” and rolls onto its
      // top, etc. It takes 1d damage to the side (top,
      // etc.) rolled onto each phase. When the bottom hits, each tire takes 1d damage. After
      // all tires are gone, the bottom takes damage
      // when it hits. Occupants may jump out at any
      // time, or stay inside and hope that no damage
      // reaches the interior. A car or trike may be
      // driven after it stops rolling if it is right side
      // up and has tires on at least three corners. A
      // cycle won’t be drivable after a roll.***

      // No further aimed weapon fire permitted from Control vehicle Control turn
      result = 'turn sideways and roll'
      Log.info(result, car)
    } else if (crashRoll <= 14) {
      Log.info('in <= 14', car)
      car.status.nextMove[0].maneuver = 'turn sideways and roll - possibly on fire'
      // As above, but vehicle is burning on a roll of 4, 5, or 6 on 1 die. (For
      // more information on burning vehi

      // No further aimed weapon fire permitted from Control vehicle Control turn
      result = 'turn sideways and roll, possibly on fire'
      Log.info(result, car)
    } else {
      Log.info('in > 14', car)
      car.status.nextMove[0].maneuver = 'vault into air'
      // vault into air
      // The vehicle vaults into
      // the air by the side (or front) tires, the tires
      // doing the vaulting taking 3d of damage.
      // The vehicle will then fly through the air
      // for 1 to 6 inches (roll 1 die) in the direction
      // the vehicle was traveling before the crash
      // result, revolving two sides for every inch
      // traveled. When it lands, the side that hits
      // takes collision damage at the vehicle’s initial speed. If the attempted maneuver was
      // a tight bend or a hard swerve, the vehicle
      // will flip end over end. Upon landing, the
      // vehicle will continue to roll as per result
      // 11 on Control table. All occupants take 1 point
      // of damage automatically. Body armor
      // does not protect against Control damage.***

      // No further aimed weapon fire permitted from Control vehicle Control turn
      result = 'vault into air'
      Log.info(result, car)
    }
    if (car.status.speed < 0) {
      console.log(`BUGBUG: Set speed of ${car.status.speed} to 0!`)
      car.status.speed = 0
    }
    Log.info(result, car)
    return result
  }
}
export default Control
