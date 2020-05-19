import PhasingMove from '../../PhasingMove'
import Vehicle from '../../Vehicle'
import GameObjectFactory from '../GameObjectFactory'

describe('PhasingMove', () => {
  describe('#possibleSpeeds', () => {
    Vehicle.canAccelerate = jest.fn()
    Vehicle.canBrake = jest.fn()

    let car

    beforeEach(() => {
      car = GameObjectFactory.car({})
      // set to low speed to make this simpler
      car.status.speed = 5
    })

    describe('no acceleration', () => {
      it('or braking', () => {
        Vehicle.canAccelerate.mockReturnValueOnce(false)
        Vehicle.canBrake.mockReturnValueOnce(false)
        const expected = [{ damageDice: '', difficulty: 0, speed: 5 }]
        expect(PhasingMove.possibleSpeeds({ car })).toEqual(expected)
      })

      it('but can brake', () => {
        Vehicle.canAccelerate.mockReturnValueOnce(false)
        Vehicle.canBrake.mockReturnValueOnce(true)
        // set to lower speed to make this simple
        const expected = [
          { damageDice: '', difficulty: 0, speed: 0 },
          { damageDice: '', difficulty: 0, speed: 5 },
        ]
        expect(PhasingMove.possibleSpeeds({ car })).toEqual(expected)
      })
    })

    it('has full range - also damage for some decel', () => {
      Vehicle.canAccelerate.mockReturnValueOnce(true)
      Vehicle.canBrake.mockReturnValueOnce(true)
      car.status.speed = 35
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
      expect(PhasingMove.possibleSpeeds({ car })).toEqual(expected)
    })
  })
})
