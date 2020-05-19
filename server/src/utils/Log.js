import Vehicle from '../gameServerHelpers/Vehicle'

class Log {
  //
  // Doesn't handle things like always failing on snake eyes.
  // Do something better later.
  //
  // Examples: '4d-3', '2d', '1d+2'
  static info(message, target) {
    if (target != null) {
      target.log.push(`${message}`)
    }
    const color = target ? target.color : ''
    console.log(`${color}: ${message}`)
    if (target.inVehicleId) {
      const vehicle = Vehicle.withId({ id: vehicleId })
      Log.info(`${target.name}: ${message}`, vehicle)
    }
  }
}
export default Log
