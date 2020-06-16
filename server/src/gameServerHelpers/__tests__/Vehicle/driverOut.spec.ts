import Vehicle from '../../Vehicle'
import GameObjectFactory from '../GameObjectFactory'

describe('Vehicle', () => {
  let vehicle: any, driver: any

  beforeEach(() => {
    vehicle = GameObjectFactory.vehicle({})
    driver = vehicle.design.components.crew.find((elem: any) => elem.role === 'driver')
  })

  xdescribe('#driverOut', () => {
    it('driver injured - not out', () => {
      driver.damagePoints = 2
      expect(Vehicle.driverAwake({ vehicle })).toBe(true)
    })
    it('driver unconscious - out', () => {
      driver.damagePoints = 1
      expect(Vehicle.driverAwake({ vehicle })).toBe(false)
    })
  })
})
