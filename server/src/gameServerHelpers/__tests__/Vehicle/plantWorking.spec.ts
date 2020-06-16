import Vehicle from '../../Vehicle'
import GameObjectFactory from '../GameObjectFactory'

describe('Vehicle', () => {
  describe('#plantWorking', () => {
    const vehicle = GameObjectFactory.vehicle({})

    it('even with one DP, it runs', () => {
      vehicle.design.components.powerPlant.damagePoints = 1
      expect(Vehicle.plantWorking({ vehicle })).toBe(true)
    })

    it('but at zero it is kaput', () => {
      vehicle.design.components.powerPlant.damagePoints = 0
      expect(Vehicle.plantWorking({ vehicle })).toBe(false)
    })
  })
})
