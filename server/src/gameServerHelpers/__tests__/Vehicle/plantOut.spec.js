import Vehicle from '../../Vehicle'
import GameObjectFactory from '../GameObjectFactory'

describe('Vehicle', () => {
  describe('#plantOut', () => {
    const vehicle = GameObjectFactory.vehicle({})

    it('even with one DP, it runs', () => {
      vehicle.design.components.powerPlant.damagePoints = 1
      expect(Vehicle.plantOut({ vehicle })).toBe(false)
    })

    it('but at zero it is kaput', () => {
      vehicle.design.components.powerPlant.damagePoints = 0
      expect(Vehicle.plantOut({ vehicle })).toBe(true)
    })
  })
})
