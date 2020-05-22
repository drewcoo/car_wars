import Collisions from '../../Collisions'
import Match from '../../Match'
import GameObjectFactory from '../GameObjectFactory'

describe('Collisions', () => {
  describe('#clear', () => {
    Match.cars = jest.fn()
    const vehicle = GameObjectFactory.vehicle({})
    Match.cars.mockReturnValue([vehicle])

    beforeEach(() => {
      vehicle.phasing.collisionDetected = false
      vehicle.collisionDetected = false
      vehicle.phasing.collisions = []
      vehicle.collisions = []
    })

    it('clears non-phasing .collisionDetected', () => {
      vehicle.collisionDetected = true
      Collisions.clear({ match: 'foo' })
      expect(vehicle.collisionDetected).toBe(false)
    })

    it('clears phasing .collisionDetected', () => {
      vehicle.phasing.collisionDetected = true
      Collisions.clear({ match: 'foo' })
      expect(vehicle.phasing.collisionDetected).toBe(false)
    })

    it('clears non-phasing collisions array', () => {
      vehicle.collisions = ['bar', 'baz']
      Collisions.clear({ match: 'foo' })
      expect(vehicle.collisions.length).toEqual(0)
    })

    it('clears phasing collisions array', () => {
      vehicle.phasing.collisions = ['bar', 'baz']
      Collisions.clear({ match: 'foo' })
      expect(vehicle.phasing.collisions.length).toEqual(0)
    })
  })
})
