import Collisions from '../../Collisions'
import Match from '../../Match'
import GameObjectFactory from '../GameObjectFactory'

describe('Collisions', () => {
  describe('#clear', () => {
    Match.cars = jest.fn()
    const car = GameObjectFactory.car({})
    Match.cars.mockReturnValue([car])

    beforeEach(() => {
      car.phasing.collisionDetected = false
      car.collisionDetected = false
      car.phasing.collisions = []
      car.collisions = []
    })

    it('clears non-phasing .collisionDetected', () => {
      car.collisionDetected = true
      Collisions.clear({ match: 'foo' })
      expect(car.collisionDetected).toBe(false)
    })

    it('clears phasing .collisionDetected', () => {
      car.phasing.collisionDetected = true
      Collisions.clear({ match: 'foo' })
      expect(car.phasing.collisionDetected).toBe(false)
    })

    it('clears non-phasing collisions array', () => {
      car.collisions = ['bar', 'baz']
      Collisions.clear({ match: 'foo' })
      expect(car.collisions.length).toEqual(0)
    })

    it('clears phasing collisions array', () => {
      car.phasing.collisions = ['bar', 'baz']
      Collisions.clear({ match: 'foo' })
      expect(car.phasing.collisions.length).toEqual(0)
    })
  })
})
