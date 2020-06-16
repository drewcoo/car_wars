import PhasingMove from '../../PhasingMove'
import Vehicle from '../../Vehicle'
import GameObjectFactory from '../GameObjectFactory'

describe('PhasingMove', () => {
  describe('#possibleSpeeds', () => {
    let vehicle: any

    beforeEach(() => {
      vehicle = GameObjectFactory.vehicle({})
      // set to low speed to make this simpler
      vehicle.status.speed = 5
    })

    describe('no acceleration', () => {
      it('or braking', () => {
        Vehicle.canAccelerate = jest.fn().mockImplementation(() => false)
        Vehicle.canBrake = jest.fn().mockImplementation(() => false)
        const expected = [{ damageDice: '', difficulty: 0, speed: 5 }]
        expect(PhasingMove.possibleSpeeds({ vehicle })).toEqual(expected)
      })

      it('but can brake', () => {
        Vehicle.canAccelerate = jest.fn().mockImplementation(() => false)
        Vehicle.canBrake = jest.fn().mockImplementation(() => true)
        // set to lower speed to make this simple
        const expected = [
          { damageDice: '', difficulty: 0, speed: 0 },
          { damageDice: '', difficulty: 0, speed: 5 },
        ]
        expect(PhasingMove.possibleSpeeds({ vehicle })).toEqual(expected)
      })
    })

    it('has full range - also damage for some decel', () => {
      Vehicle.canAccelerate = jest.fn().mockImplementation(() => true)
      Vehicle.canBrake = jest.fn().mockImplementation(() => true)
      vehicle.status.speed = 35
      const expected = [
        { damageDice: '0d+2', difficulty: 7, speed: 0 },
        { damageDice: '', difficulty: 5, speed: 5 },
        { damageDice: '', difficulty: 3, speed: 10 },
        { damageDice: '', difficulty: 2, speed: 15 },
        { damageDice: '', difficulty: 1, speed: 20 },
        { damageDice: '', difficulty: 0, speed: 25 },
        { damageDice: '', difficulty: 0, speed: 30 },
        { damageDice: '', difficulty: 0, speed: 35 },
        { damageDice: '', difficulty: 0, speed: 40 },
        { damageDice: '', difficulty: 0, speed: 45 },
      ]
      expect(PhasingMove.possibleSpeeds({ vehicle })).toEqual(expected)
    })
  })
})
