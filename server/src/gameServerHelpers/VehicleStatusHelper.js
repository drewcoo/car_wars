class VehicleStatusHelper {
  static driverAwake(vehicle) {
    return vehicle.design.components.crew.find(member => member.role === 'driver').damagePoints > 1
  }

  static numberOfWheels(vehicle) {
    return vehicle.design.components.tires.filter(filtire => filtire.wheelExists).length
  }

  static enoughWheels(vehicle) {
    return VehicleStatusHelper.numberOfWheels(vehicle) > 2
  }

  static canSteer(vehicle) {
    return (VehicleStatusHelper.driverAwake(vehicle) && VehicleStatusHelper.enoughWheels(vehicle))
  }

  static canAccelerate(vehicle) {
    const plantOk = vehicle.design.components.powerPlant.damagePoints > 0
    return (VehicleStatusHelper.driverAwake(vehicle) && VehicleStatusHelper.enoughWheels(vehicle) && plantOk)
  }

  static canBrake(vehicle) {
    return (VehicleStatusHelper.driverAwake(vehicle) && VehicleStatusHelper.enoughWheels(vehicle))
  }

}

export default VehicleStatusHelper
