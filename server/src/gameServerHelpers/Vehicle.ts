import { DATA } from '../DATA'
import Character from './Character'
import Log from '../utils/Log'


class Vehicle {
  static canAccelerate({ vehicle }: { vehicle: any }) {
    const plantOk = vehicle.design.components.powerPlant.damagePoints > 0
    return Vehicle.driverAwake({ vehicle }) && Vehicle.enoughWheels({ vehicle }) && plantOk
  }

  static canBrake({ vehicle }: { vehicle: any }) {
    return Vehicle.driverAwake({ vehicle }) && Vehicle.enoughWheels({ vehicle })
  }

  static canSteer({ vehicle }: { vehicle: any }) {
    return Vehicle.driverAwake({ vehicle }) && Vehicle.enoughWheels({ vehicle })
  }

  static driverAwake({ vehicle }: { vehicle: any }) {
    return Vehicle.driver({ vehicle }).damagePoints > 1
  }

  static driver({ vehicle }: { vehicle: any}): any {
    return Character.withId({ id: Vehicle.driverId({ vehicle }) })
  }

  static driverId({ vehicle }: { vehicle: any }) {
    return vehicle.design.components.crew.find((element: any) => element.role === 'driver').id
  }

  static enoughWheels({ vehicle }: { vehicle: any }) {
    return Vehicle.numberOfWheels({ vehicle }) > 2
  }

  static isKilled({ vehicle }: { vehicle: any }) {
    // A "kill" is scored when an enemy vehicle can no longer move or fire, either
    // because of a direct attack, a crash during combat, surrender of the occupants,
    // or other circumstance
    const statusKilled = typeof vehicle.status.killed !== 'undefined' && vehicle.status.killed === true
    const stopped = vehicle.status.speed === 0
    const noDriver = !Vehicle.driverAwake({ vehicle })
    const noPlant = !Vehicle.plantWorking({ vehicle })
    const noWeapons = Vehicle.weaponsOut({ vehicle })
    const result = statusKilled || (stopped && (noDriver || (noPlant && noWeapons)))
    return result
  }

  static numberOfWheels({ vehicle }: { vehicle: any }) {
    return vehicle.design.components.tires.filter((filtire: any) => filtire.wheelExists).length
  }

  static plantWorking({ vehicle }: { vehicle: any }) {
    return vehicle.design.components.powerPlant.damagePoints !== 0
  }

  static weaponsOut({ vehicle }: { vehicle: any }) {``
    Log.info('in weapons out', vehicle)
    const workingWeapon = vehicle.design.components.weapons.find((weapon: any) => {
      const plantSitchOk =
        !weapon.requiresPlant || (weapon.requiresPlant && vehicle.design.components.powerPlant.damagePoints > 0)
      return weapon.damagePoints > 0 && plantSitchOk
    })
    Log.info(workingWeapon, vehicle)
    if (typeof workingWeapon !== 'undefined') {
      Log.info(
        `${workingWeapon.name} (${workingWeapon.id}): DP: ${workingWeapon.damagePoints}, requires plant: ${workingWeapon.requiresPlant} (${vehicle.design.components.powerPlant.damagePoints} DP)`,
        vehicle,
      )
    } else {
      Log.info('no working weapon found', vehicle)
    }
    return typeof workingWeapon === 'undefined'
  }

  static withId({ id }: { id: string }) {
    return DATA.cars.find((element: any) => element.id === id)
  }
}

export default Vehicle
