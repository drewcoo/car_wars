import Movement from '../../Movement'
import GameObjectFactory from '../GameObjectFactory'

describe('Movement', () => {
  let car, driver

  beforeEach(() => {
    car = GameObjectFactory.car({})
    driver = car.design.components.crew.find((elem) => elem.role === 'driver')
  })

  xdescribe('#driverOut', () => {
    it('driver injured - not out', () => {
      driver.damagePoints = 2
      expect(Movement.driverOut({ car })).toBe(false)
    })
    it('driver unconscious - out', () => {
      driver.damagePoints = 1
      expect(Movement.driverOut({ car })).toBe(true)
    })
  })
})
