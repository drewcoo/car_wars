import Log from '../utils/Log'
import Character from './Character'
import Vehicle from './Vehicle'

class Movement {
  static canMoveThisPhase({ match }) {
    function checkMove(car) {
      if (
        Movement.distanceThisPhase({
          speed: car.status.speed,
          phase: match.time.phase.number,
        }) === 0
      ) {
        car.phasing.rect = car.rect
      } else {
        return true
      }
    }
    return match.carIds
      .map((id) => Vehicle.withId({ id }))
      .filter((car) => checkMove(car) > 0)
      .map((car) => car.id)
  }

  static distanceThisPhase({ speed, phase }) {
    const MovementChart = [
      [0, 0, 0, 0, 0], // 0 mph
      [0.5, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 0, 0.5, 0, 0],
      [1, 0, 1, 0, 0],

      [1, 0, 1, 0, 0.5], // 25 mph
      [1, 0, 1, 0, 1],
      [1, 0.5, 1, 0, 1],
      [1, 1, 1, 0, 1],
      [1, 1, 1, 0.5, 1],
    ]
    if (phase < 1 || phase > 5) {
      throw new Error(`There is no phase ${phase}`)
    }
    return MovementChart[(speed % 50) / 5][phase - 1] + Math.floor(speed / 50)
  }

  static driverOut({ car }) {
    const driverId = Vehicle.driverId({ vehicle: car })
    const driver = Character.withId({ id: driverId })
    // 1 is unconscious; 0 is dead
    return driver.damagePoints < 2
  }

  static isKilled({ car }) {
    // A "kill" is scored when an enemy vehicle can no longer move or fire, either
    // because of a direct attack, a crash during combat, surrender of the occupants,
    // or other circumstance
    Log.info('here', car)
    const statusKilled = typeof car.status.killed !== 'undefined' && car.status.killed === true
    const stopped = car.status.speed === 0
    const noDriver = Movement.driverOut({ car })
    const noPlant = Movement.plantOut({ car })
    const noWeapons = Movement.weaponsOut({ car })
    Log.info(
      `statusKilled[${statusKilled ? 'X' : ''}] stopped[${stopped ? 'X' : ''}] noDriver[${
        noDriver ? 'X' : ''
      }] noMove/Shoot[noPlant[${noPlant ? 'X' : ''}] noWeapons[${noWeapons ? 'X' : ''}]]`,
      car,
    )
    const result = statusKilled || (stopped && (noDriver || (noPlant && noWeapons)))
    Log.info(`vehicle killed? ${result}`, car)
    return result
  }

  static nextToMoveThisPhase({ match }) {
    if (match.time.phase.unmoved.length < 1) {
      return null
    }
    const ordered = match.time.phase.unmoved
      .map((id) => Vehicle.withId({ id }))
      .sort((a, b) => Math.abs(b.status.speed) - Math.abs(a.status.speed))
      .map((car) => car.id)

    // BUGBUG: Should handle same-speed disputes
    // Those are more complicated, involving prompting users to see if they want
    // to move or defer.
    const result = ordered.shift()
    match.time.phase.unmoved = ordered
    console.log(ordered)
    console.log(`but first ${result}`)
    return result
  }

  static plantOut({ car }) {
    return car.design.components.powerPlant.damagePoints === 0
  }

  static weaponsOut({ car }) {
    Log.info('in weapons out', car)
    const workingWeapon = car.design.components.weapons.find((weapon) => {
      const plantSitchOk =
        !weapon.requiresPlant || (weapon.requiresPlant && car.design.components.powerPlant.damagePoints > 0)
      return weapon.damagePoints > 0 && plantSitchOk
    })
    Log.info(workingWeapon, car)
    if (typeof workingWeapon !== 'undefined') {
      Log.info(
        `${workingWeapon.name} (${workingWeapon.id}): DP: ${workingWeapon.damagePoints}, requires plant: ${workingWeapon.requiresPlant} (${car.design.components.powerPlant.damagePoints} DP)`,
        car,
      )
    } else {
      Log.info('no working weapon found', car)
    }
    return typeof workingWeapon === 'undefined'
  }
}

export default Movement
