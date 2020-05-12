import PhasingMove from '../../PhasingMove'
import VehicleStatusHelper from '../../VehicleStatusHelper'
import GameObjectFactory from '../GameObjectFactory'

describe('PhasingMove', () => {
  describe('#possibleSpeeds', () => {
    VehicleStatusHelper.canAccelerate = jest.fn()
    VehicleStatusHelper.canBrake = jest.fn()

    let car

    beforeEach(() => {
      car = GameObjectFactory.car({})
      // set to low speed to make this simpler
      car.status.speed = 5
    })

    describe('no acceleration', () => {
      it('or braking', () => {
        VehicleStatusHelper.canAccelerate.mockReturnValueOnce(false)
        VehicleStatusHelper.canBrake.mockReturnValueOnce(false)
        const expected = [{ damageDice: '', difficulty: 0, speed: 5 }]
        expect(PhasingMove.possibleSpeeds({ car })).toEqual(expected)
      })

      it('but can brake', () => {
        VehicleStatusHelper.canAccelerate.mockReturnValueOnce(false)
        VehicleStatusHelper.canBrake.mockReturnValueOnce(true)
        // set to lower speed to make this simple
        const expected = [
          { damageDice: '', difficulty: 0, speed: 0 },
          { damageDice: '', difficulty: 0, speed: 5 },
        ]
        expect(PhasingMove.possibleSpeeds({ car })).toEqual(expected)
      })
    })

    it('has full range - also damage for some decel', () => {
      VehicleStatusHelper.canAccelerate.mockReturnValueOnce(true)
      VehicleStatusHelper.canBrake.mockReturnValueOnce(true)
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
