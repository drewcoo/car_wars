import Movement from '../../Movement'
import GameObjectFactory from '../GameObjectFactory'

describe('Movement', () => {
  describe('#plantOut', () => {
    const car = GameObjectFactory.car({})

    it('even with one DP, it runs', () => {
      car.design.components.powerPlant.damagePoints = 1
      expect(Movement.plantOut({ car })).toBe(false)
    })

    it('but at zero it is kaput', () => {
      car.design.components.powerPlant.damagePoints = 0
      expect(Movement.plantOut({ car })).toBe(true)
    })
  })
})
