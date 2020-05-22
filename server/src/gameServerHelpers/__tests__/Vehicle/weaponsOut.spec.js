import Vehicle from '../../Vehicle'
import GameObjectFactory from '../GameObjectFactory'

describe('Vehicle', () => {
  describe('#weaponsOut', () => {
    let vehicle, weapons

    beforeEach(() => {
      vehicle = GameObjectFactory.vehicle({})
      weapons = vehicle.design.components.weapons.filter(elem => elem.type !== 'none')
    })

    it('vehicle has none', () => {
      vehicle.design.components.weapons = []
      expect(Vehicle.weaponsOut({ vehicle })).toBe(true)
    })

    it('vehicle has some', () => {
      expect(Vehicle.weaponsOut({ vehicle })).toBe(false)
    })

    it('weapons require plant but plant out', () => {
      weapons.forEach(w => (w.requiresPlant = true))
      vehicle.design.components.powerPlant.damagePoints = 0
      expect(Vehicle.weaponsOut({ vehicle })).toBe(true)
    })

    it('weapons all destroyed', () => {
      weapons.forEach(w => (w.damagePoints = 0))
      expect(Vehicle.weaponsOut({ vehicle })).toBe(true)
    })
  })
})
