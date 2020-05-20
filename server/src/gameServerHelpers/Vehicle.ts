import { DATA } from '../DATA'
import Character from './Character'

class Vehicle {
  static canAccelerate(vehicle: any) {
    const plantOk = vehicle.design.components.powerPlant.damagePoints > 0
    return Vehicle.driverAwake(vehicle) && Vehicle.enoughWheels(vehicle) && plantOk
  }

  static canBrake(vehicle: any) {
    return Vehicle.driverAwake(vehicle) && Vehicle.enoughWheels(vehicle)
  }

  static canSteer(vehicle: any) {
    return Vehicle.driverAwake(vehicle) && Vehicle.enoughWheels(vehicle)
  }

  static driverAwake(vehicle: any) {
    return Vehicle.driver({ vehicle }).damagePoints > 1
  }

  static driver({ vehicle }: { vehicle: any}): any {
    return Character.withId({ id: Vehicle.driverId({ vehicle }) })
  }

  static driverId({ vehicle }: { vehicle: any }) {
    return vehicle.design.components.crew.find((element: any) => element.role === 'driver').id
  }

  static enoughWheels(vehicle: any) {
    return Vehicle.numberOfWheels(vehicle) > 2
  }

  static numberOfWheels(vehicle: any) {
    return vehicle.design.components.tires.filter((filtire: any) => filtire.wheelExists).length
  }

  static withId({ id }: { id: string }) {
    return DATA.cars.find((element: any) => element.id === id)
  }
}

export default Vehicle
