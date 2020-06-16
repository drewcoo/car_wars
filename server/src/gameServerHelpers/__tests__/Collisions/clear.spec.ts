import Collisions from '../../Collisions'
import Match from '../../Match'
import GameObjectFactory from '../GameObjectFactory'

describe('Collisions', () => {
  describe('#clear', () => {
    const vehicle = GameObjectFactory.vehicle({})

    beforeEach(() => {
      vehicle.phasing.collisionDetected = false
      vehicle.collisionDetected = false
      vehicle.phasing.collisions = [] as any
      vehicle.collisions = [] as any
      Match.cars = jest.fn().mockImplementation(() => [vehicle])
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
      vehicle.collisions.push({ bar: '2' })// = ['bar', 'baz']
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
