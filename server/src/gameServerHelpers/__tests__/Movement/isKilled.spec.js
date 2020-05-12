import Movement from '../../Movement'
import GameObjectFactory from '../GameObjectFactory'

describe('Movement', () => {
  Movement.driverOut = jest.fn()
  Movement.plantOut = jest.fn()
  Movement.weaponsOut = jest.fn()
  let car

  beforeEach(() => {
    car = GameObjectFactory.car({})
  })

  describe('#isKilled', () => {
    it('is marked killed', () => {
      car.status.killed = true
      expect(Movement.isKilled({ car })).toBe(true)
    })

    describe('car stopped', () => {
      beforeEach(() => {
        // status.isKilled is false by default
        car.status.speed = 0
      })

      it('driver out', () => {
        Movement.driverOut.mockReturnValueOnce(true)
        expect(Movement.isKilled({ car })).toBe(true)
      })

      it('plant and weapons out', () => {
        Movement.plantOut.mockReturnValueOnce(true)
        Movement.weaponsOut.mockReturnValueOnce(true)
        expect(Movement.isKilled({ car })).toBe(true)
      })

      it('is only stopped, not dead', () => {
        Movement.driverOut.mockReturnValueOnce(false)
        Movement.plantOut.mockReturnValueOnce(false)
        Movement.weaponsOut.mockReturnValueOnce(false)
        expect(car.status.killed).not.toBe(true)
        expect(Movement.isKilled({ car })).toBe(false)
      })
    })

    it('is not killed', () => {
      expect(Movement.isKilled({ car })).toBe(false)
    })
  })
})
