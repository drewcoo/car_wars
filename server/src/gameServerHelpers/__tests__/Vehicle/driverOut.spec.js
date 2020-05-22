import Vehicle from '../../Vehicle'
import GameObjectFactory from '../GameObjectFactory'

describe('Vehicle', () => {
  let vehicle, driver

  beforeEach(() => {
    vehicle = GameObjectFactory.vehicle({})
    driver = vehicle.design.components.crew.find((elem) => elem.role === 'driver')
  })

  xdescribe('#driverOut', () => {
    it('driver injured - not out', () => {
      driver.damagePoints = 2
      expect(Vehicle.driverOut({ vehicle })).toBe(false)
    })
    it('driver unconscious - out', () => {
      driver.damagePoints = 1
      expect(Vehicle.driverOut({ vehicle })).toBe(true)
    })
  })
})
