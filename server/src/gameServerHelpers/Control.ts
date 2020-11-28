import _ from 'lodash'
import { INCH } from '../utils/constants'
import Dice from '../utils/Dice'
import Log from '../utils/Log'
import Character from './Character'
import Vehicle from './Vehicle'

class Control {
  static table =
    // prettier-ignore
    [
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
      ['safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', '3', '4', '6', 'XX', 'XX', 'XX', 'XX'],
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
      ['safe', '3', '4', '5', '6', 'XX', 'XX', 'XX', 'XX', 'XX', 'XX', 'XX', 'XX', 'XX'], // 295-300
    ]

  static statusIndex = [7, 6, 5, 4, 3, 2, 1, 0, -1, -2, -3, -4, -5, -6]

  static checkNeeded({ speed, handlingStatus }: { speed: number; handlingStatus: number }) {
    const row = Control.row({ speed })
    const column = Control.statusIndex.indexOf(handlingStatus)
    return row[column]
  }

  static crashModifier({ speed }: { speed: number }) {
    const absSpeed = Math.abs(speed)
    if (absSpeed < 5) {
      return null
    }
    const tableRow = Math.ceil(absSpeed / 10) - 1
    const mods =
      // prettier-ignore
      [-3, -2, -1, 0, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9]
    return mods[tableRow]
  }

  // pass in a car and get everything from it?
  // also set everything on it, including moving it plus future moves
  // a.k.a. Crash Table 2
  static hazardCheck({ vehicle, difficulty }: { vehicle: any; difficulty: number }) {
    let result = 'pass'
    Log.info(
      `hazard check, modified handling: ${vehicle.status.handling} - ${difficulty} = ${vehicle.status.handling -
        difficulty}`,
      vehicle,
    )
    vehicle.status.handling = Control.normalizeHandlingStatus(vehicle.status.handling - difficulty)

    if (!Control.loseControl({ vehicle })) {
      return result
    }
    const dieRoll = Dice.roll('2d')

    const characterId = Vehicle.driverId({ vehicle })
    const character = Character.withId({ id: characterId })
    const skillLevel: any = Character.skillLevel({ skill: 'driver', character })
    const skillBonus = skillLevel < 0 ? 0 : skillLevel

    Log.info(`speed: ${vehicle.status.speed}`, vehicle)
    const crashModifier: any = Control.crashModifier({ speed: vehicle.status.speed })
    Log.info(`crashModifier: ${crashModifier}`, vehicle)

    Log.info(
      `crash roll = ${dieRoll} (2d) + ${difficulty} (difficulty) - ${skillBonus} (skill) + ${crashModifier} (crash mod)`,
      vehicle,
    )
    const crashRoll = dieRoll + difficulty - skillBonus + crashModifier
    Log.info(`total crash roll: ${crashRoll}`, vehicle)

    Log.info(`${vehicle.color} FISHTAILS!`, vehicle)

    if (typeof vehicle.status.nextMove[0] === 'undefined') {
      vehicle.status.nextMove[0] = {
        spinDirection: '',
        fishtailDistance: 0,
        maneuver: null,
        maneuverDirection: null,
        maneuverDistance: 0,
      }
    }

    const spinDirection =
      vehicle.status.nextMove[0].spinDirection !== ''
        ? vehicle.status.nextMove[0].spinDirection
        : Control.spinDirection()
    Log.info(`fishtail to the ${spinDirection}`, vehicle)
    const oldDistance = Math.abs(vehicle.status.nextMove[0].fishtailDistance)

    if (crashRoll <= 4) {
      if (oldDistance < 15) {
        vehicle.status.nextMove[0].fishtailDistance = 15
        vehicle.status.nextMove[0].spinDirection = spinDirection
        // Any further aimed weapon fire from Control vehicle on Control turn will be at a −3 to hit
        result = 'minor fishtail'
      } else {
        result = 'NOT a minor fishtail'
      }
    } else if (crashRoll <= 8) {
      if (Math.abs(vehicle.status.nextMove[0].fishtailDistance) < 30) {
        vehicle.status.nextMove[0].fishtailDistance = 30
        vehicle.status.nextMove[0].spinDirection = spinDirection
        // Any further aimed weapon fire from Control vehicle on Control turn will be at a −6 to hit
        result = 'major fishtail'
      } else {
        result = 'NOT a major fishtail'
      }
    } else if (crashRoll <= 10) {
      if (vehicle.status.nextMove[0].maneuver === null) {
        vehicle.status.nextMove[0].fishtailDistance = 15
        vehicle.status.nextMove[0].spinDirection = spinDirection
        Log.info('fishtail 1/4" plus maneuver check . . .', vehicle)
        // Any further aimed weapon fire from Control vehicle on Control turn will be at a −6 to hit
        result = 'minor fishtail and roll on Crash Table 1'
      } else {
        result = 'NOT minor fishtail and roll on Crash Table 1'
      }
    } else if (crashRoll <= 14) {
      if (Math.abs(vehicle.status.nextMove[0].fishtailDistance) < 30 || vehicle.status.nextMove[0].maneuver === null) {
        vehicle.status.nextMove[0].fishtailDistance = 30
        vehicle.status.nextMove[0].spinDirection = spinDirection
        Log.info('fishtail 1/2" plus maneuver check . . .', vehicle)
        // No further aimed weapon fire permitted from Control vehicle Control turn
        result = 'major fishtail and roll on Crash Table 1'
      } else {
        result = 'NOT and roll on Crash Table 1'
      }
    } else {
      if (Math.abs(vehicle.status.nextMove[0].fishtailDistance) < 45) {
        vehicle.status.nextMove[0].fishtailDistance = 45
        vehicle.status.nextMove[0].spinDirection = spinDirection
        Log.info('fishtail 3/4" plus maneuver check . . .', vehicle)
        // No further aimed weapon fire permitted from Control vehicle Control turn
        result = 'major and minor fishtail and roll on Crash Table 1'
      } else {
        result = 'NOT major and minor fishtail and roll on Crash Table 1'
      }
    }
    Log.info(result, vehicle)
    return result
  }

  static loseControl({ vehicle }: { vehicle: any }) {
    const needed = Control.checkNeeded({
      speed: vehicle.status.speed,
      handlingStatus: vehicle.status.handling,
    })
    Log.info(`lose control: ${needed}`, vehicle)
    if (needed === 'safe') {
      return false
    }
    if (needed === 'XX') {
      return true
    }
    const roll = Dice.roll('1d')
    const result = roll < parseInt(needed)
    Log.info(`control roll: ${roll} (control loss? ${result})`, vehicle)
    return result
  }

  // pass in a car and get everything from it?
  // also set everything on it, including moving it plus future moves
  // a.k.a. Crash Table 1
  static maneuverCheck({ vehicle, forceCrashTable2Roll = false }: { vehicle: any; forceCrashTable2Roll?: boolean }) {
    Log.info('maneuver check', vehicle)

    const characterId = Vehicle.driverId({ vehicle })
    const character = Character.withId({ id: characterId })
    const skillLevel = Character.skillLevel({ skill: 'driver', character })
    const skillBonus = skillLevel < 0 ? 0 : skillLevel

    let result = 'no change'
    if (!forceCrashTable2Roll && (vehicle.phasing.difficulty === 0 || !Control.loseControl({ vehicle }))) {
      return result
    } // no maneuver; no check

    const dieRoll = Dice.roll('2d')
    // p.17 The difficulty of the maneuver (or hazard) that caused the loss of
    // control plays an important part in determining a crash result. Take
    // the modified Difficulty rating of the hazard or maneuver, subtract 3,
    // and add the result (negative or positive) to the Crash Table roll.
    // Thus, a D4 maneuver gives a +1 to the roll, while a D1 maneuver gives a −2
    const modifiedDifficulty = vehicle.phasing.difficulty !== 0 ? vehicle.phasing.difficulty - 3 : 0
    const crashModifier: any = Control.crashModifier({ speed: vehicle.status.speed })
    Log.info(
      `crash roll = ${dieRoll} (2d) + ${modifiedDifficulty} (modded difficulty) - ${skillBonus} (skill) + ${crashModifier} (crash mod)`,
      vehicle,
    )
    const crashRoll = dieRoll + modifiedDifficulty - skillBonus + crashModifier
    Log.info(`${vehicle.color} LOST CONTROL!!! crash roll number: ${crashRoll}`, vehicle)

    Log.info(vehicle.status, vehicle)

    if (typeof vehicle.status.nextMove[0] === 'undefined') {
      vehicle.status.nextMove[0] = {
        spinDirection: '',
        fishtailDistance: 0,
        maneuver: null,
        maneuverDirection: null,
        maneuverDistance: 0,
      }
    }
    Log.info(`spinDirection: ${vehicle.status.nextMove[0].spinDirection}`, vehicle)

    if (crashRoll <= 2) {
      Log.info('in <= 2', vehicle)
      if (vehicle.status.nextMove[0].maneuver === null) {
        // do Control next turn: PhasingMove.skid({ vehicle, INCH / 4 })
        // Any further aimed weapon fire from Control vehicle on Control turn will be at a −3 to hit
        vehicle.status.nextMove[0].maneuver = 'skid'
        vehicle.status.nextMove[0].maneuverDirection = vehicle.rect.facing
        vehicle.status.nextMove[0].maneuverDistance = INCH / 4
        result = 'trivial skid'
      } else {
        result = 'NOT a trivial skid'
      }
      Log.info(result, vehicle)
    } else if (crashRoll <= 4) {
      Log.info('in <= 4', vehicle)
      const distance = INCH / 2
      if (
        vehicle.status.nextMove[0].maneuver === null ||
        (vehicle.status.nextMove[0].maneuver === 'skid' && vehicle.maneuverDistance < distance)
      ) {
        // do Control next turn: PhasingMove.skid({ vehicle, INCH / 2 })
        vehicle.status.speed -= 5
        // Any further aimed weapon fire from Control vehicle on Control turn will be at a −6 to hit
        vehicle.status.nextMove[0].maneuver = 'skid'
        vehicle.status.nextMove[0].maneuverDirection = vehicle.rect.facing
        vehicle.status.nextMove[0].maneuverDistance = distance
        result = 'minor skid'
      } else {
        result = 'NOT a minor skid'
      }
      Log.info(result, vehicle)
    } else if (crashRoll <= 6) {
      Log.info('in <= 6', vehicle)
      const distance = (INCH * 3) / 4
      if (
        vehicle.status.nextMove[0].maneuver === null ||
        (vehicle.status.nextMove[0].maneuver === 'skid' && vehicle.maneuverDistance < distance)
      ) {
        // do Control next turn: PhasingMove.skid({ vehicle, INCH * 3/4 })
        vehicle.status.speed -= 10
        // each tire loses 1 DP
        // No further aimed weapon fire permitted from Control vehicle Control turn
        // trivial skid on next move
        vehicle.status.nextMove[0] = {
          spinDirection: vehicle.status.nextMove[0].spinDirection,
          fishtailDistance: vehicle.status.nextMove[0].fishtailDistance || 0,
          maneuver: 'skid',
          maneuverDirection: vehicle.rect.facing,
          maneuverDistance: distance,
        }
        vehicle.status.nextMove[1] = {
          spinDirection: '',
          fishtailDistance: 0,
          maneuver: 'skid',
          maneuverDirection: vehicle.rect.facing,
          maneuverDistance: INCH / 4,
        }
        result = 'moderate skid'
      } else {
        result = 'NOT a moderate skid'
      }
      Log.info(result, vehicle)
    } else if (crashRoll <= 8) {
      Log.info('in <= 8', vehicle)
      const distance = INCH
      if (
        vehicle.status.nextMove[0].maneuver === null ||
        (vehicle.status.nextMove[0].maneuver === 'skid' && vehicle.maneuverDistance < distance)
      ) {
        // No further aimed weapon fire permitted from Control vehicle Control turn
        vehicle.status.speed -= 20
        vehicle.status.nextMove[0] = {
          spinDirection: vehicle.status.nextMove[0].spinDirection,
          fishtailDistance: vehicle.status.nextMove[0].fishtailDistance || 0,
          maneuver: 'skid',
          maneuverDirection: vehicle.rect.facing,
          maneuverDistance: distance,
        }
        vehicle.status.nextMove[1] = {
          spinDirection: '',
          fishtailDistance: 0,
          maneuver: 'skid',
          maneuverDirection: vehicle.rect.facing,
          maneuverDistance: INCH / 2,
        }
        result = 'severe skid'
      } else {
        result = 'NOT a severe skid'
      }
      Log.info(result, vehicle)
    } else if (crashRoll <= 10) {
      Log.info('in <= 10', vehicle)
      const direction = Control.spinDirection()
      // spinout
      if (vehicle.status.nextMove[0].spinDirection === '') {
        vehicle.status.nextMove[0].spinDirection = direction
        vehicle.status.nextMove[0].maneuver = 'spinout'
      }
      Log.info(`speed: ${vehicle.status.speed}`, vehicle)
      const quarterTurns = Math.ceil(vehicle.status.speed / 20)
      Log.info(`${quarterTurns} quarter turns`, vehicle)
      for (let i = 0; i < quarterTurns; i++) {
        if (typeof vehicle.status.nextMove[i] === 'undefined') {
          vehicle.status.nextMove[i] = { fishtailDistance: 0 }
        }

        if (typeof vehicle.status.nextMove[i].fishtailDistance === 'undefined') {
          vehicle.status.nextMove[i].fishtailDistance = 0
        }
        vehicle.status.nextMove[i] = {
          spinDirection: direction,
          fishtailDistance: vehicle.status.nextMove[i].fishtailDistance,
          maneuver: 'spinout',
          maneuverDirection: vehicle.rect.facing,
          maneuverDistance: 0,
        }
      }
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
      // vehicle is facing the direction it is moving, // movement continues on as usual. If the car
      // is facing sideways it must perform an immediate T-stop. It may discontinue a T-stop
      // by turning “into” the direction of the skid
      // and then continue the turn. If the vehicle
      // is facing backward and is traveling faster
      // than its reverse top speed, it must slow
      // down by at least 5 mph per turn until it is
      // under its normal top speed for reverse.***

      // No further aimed weapon fire permitted from Control vehicle Control turn
      result = 'spinout'
      Log.info(result, vehicle)
    } else if (crashRoll <= 12) {
      Log.info('in <= 12', vehicle)
      vehicle.status.nextMove[0].maneuver = 'turn sideways and roll'
      // Car turns sideways (as in a Tstop; see Figure 7, p. 14) and rolls. The
      // driver is no longer in control. The car decelerates at 20 mph per turn. Each phase
      // it moves, it goes 1” in the direction it was
      // traveling and rolls 1/4 of a complete roll –
      // e.g., in the first phase it moves 1”, turns
      // sideways, and rolls onto its side; the next
      // phase it moves, it goes 1” and rolls onto its
      // top, etc. It takes 1d damage to the side (top, // etc.) rolled onto each phase. When the bottom hits, each tire takes 1d damage. After
      // all tires are gone, the bottom takes damage
      // when it hits. Occupants may jump out at any
      // time, or stay inside and hope that no damage
      // reaches the interior. A car or trike may be
      // driven after it stops rolling if it is right side
      // up and has tires on at least three corners. A
      // cycle won’t be drivable after a roll.***

      // No further aimed weapon fire permitted from Control vehicle Control turn
      result = 'turn sideways and roll'
      Log.info(result, vehicle)
    } else if (crashRoll <= 14) {
      Log.info('in <= 14', vehicle)
      vehicle.status.nextMove[0].maneuver = 'turn sideways and roll, possibly on fire'
      // As above, but vehicle is burning on a roll of 4, 5, or 6 on 1 die. (For
      // more information on burning vehi

      // No further aimed weapon fire permitted from Control vehicle Control turn
      result = 'turn sideways and roll, possibly on fire'
      Log.info(result, vehicle)
    } else {
      Log.info('in > 14', vehicle)
      vehicle.status.nextMove[0].maneuver = 'vault into air'
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
      Log.info(result, vehicle)
    }
    if (vehicle.status.speed < 0) {
      console.log(`BUGBUG: Set speed of ${vehicle.status.speed} to 0!`)
      vehicle.status.speed = 0
    }
    Log.info(result, vehicle)
    return result
  }

  static normalizeHandlingStatus(status: any) {
    return _.clamp(status, -6, 7)
  }

  static row({ speed }: { speed: any }) {
    const absSpeed = Math.abs(speed)
    if (absSpeed > 300) {
      throw new Error('Speeds > 300MPH not handled')
    }
    if (absSpeed < 5) {
      // prettier-ignore
      return (
        ['safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe']
      )
    }
    const tableRow = Math.ceil(absSpeed / 10) - 1
    return Control.table[tableRow]
  }

  static spinDirection() {
    return _.random(1) === 1 ? 'right' : 'left'
  }
}
export default Control
