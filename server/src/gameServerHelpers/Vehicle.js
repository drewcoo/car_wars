import { DATA } from '../DATA'

class Vehicle {
  static canAccelerate(vehicle) {
    const plantOk = vehicle.design.components.powerPlant.damagePoints > 0
    return Vehicle.driverAwake(vehicle) && Vehicle.enoughWheels(vehicle) && plantOk
  }

  static canBrake(vehicle) {
    return Vehicle.driverAwake(vehicle) && Vehicle.enoughWheels(vehicle)
  }

  static canSteer(vehicle) {
    return Vehicle.driverAwake(vehicle) && Vehicle.enoughWheels(vehicle)
  }

  static driverAwake(vehicle) {
    const driverId = vehicle.design.components.crew.find((member) => member.role === 'driver').id
    const driver = DATA.characters.find((element) => element.id === driverId)
    return driver.damagePoints > 1
  }

  static driverId({ vehicle }) {
    return vehicle.design.components.crew.find((element) => element.role === 'driver').id
  }

  static enoughWheels(vehicle) {
    return Vehicle.numberOfWheels(vehicle) > 2
  }

  static numberOfWheels(vehicle) {
    return vehicle.design.components.tires.filter((filtire) => filtire.wheelExists).length
  }

  static withId({ id }) {
    return DATA.cars.find((element) => element.id === id)
  }
}

export default Vehicle
