import Movement from '../../Movement'
import GameObjectFactory from '../GameObjectFactory'

describe('Movement', () => {
  describe('#weaponsOut', () => {
    let car, weapons

    beforeEach(() => {
      car = GameObjectFactory.car({})
      weapons = car.design.components.weapons.filter(elem => elem.type !== 'none')
    })

    it('car has none', () => {
      car.design.components.weapons = []
      expect(Movement.weaponsOut({ car })).toBe(true)
    })

    it('car has some', () => {
      expect(Movement.weaponsOut({ car })).toBe(false)
    })

    it('weapons require plant but plant out', () => {
      weapons.forEach(w => (w.requiresPlant = true))
      car.design.components.powerPlant.damagePoints = 0
      expect(Movement.weaponsOut({ car })).toBe(true)
    })

    it('weapons all destroyed', () => {
      weapons.forEach(w => (w.damagePoints = 0))
      expect(Movement.weaponsOut({ car })).toBe(true)
    })
  })
})
