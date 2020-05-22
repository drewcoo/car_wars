import Vehicle from '../../Vehicle'
import GameObjectFactory from '../GameObjectFactory'

describe('Vehicle', () => {
  Vehicle.driverAwake = jest.fn()
  Vehicle.plantOut = jest.fn()
  Vehicle.weaponsOut = jest.fn()
  let vehicle

  beforeEach(() => {
    vehicle = GameObjectFactory.vehicle({})
  })

  describe('#isKilled', () => {
    it('is marked killed', () => {
      vehicle.status.killed = true
      expect(Vehicle.isKilled({ vehicle })).toBe(true)
    })

    describe('vehicle stopped', () => {
      beforeEach(() => {
        // status.isKilled is false by default
        vehicle.status.speed = 0
      })

      it('driver out', () => {
        Vehicle.driverAwake.mockReturnValueOnce(false)
        expect(Vehicle.isKilled({ vehicle })).toBe(true)
      })

      it('plant and weapons out', () => {
        Vehicle.plantOut.mockReturnValueOnce(true)
        Vehicle.weaponsOut.mockReturnValueOnce(true)
        expect(Vehicle.isKilled({ vehicle })).toBe(true)
      })

      it('is only stopped, not dead', () => {
        Vehicle.driverAwake.mockReturnValueOnce(true)
        Vehicle.plantOut.mockReturnValueOnce(false)
        Vehicle.weaponsOut.mockReturnValueOnce(false)
        expect(vehicle.status.killed).not.toBe(true)
        expect(Vehicle.isKilled({ vehicle })).toBe(false)
      })
    })

    it('is not killed', () => {
      expect(Vehicle.isKilled({ vehicle })).toBe(false)
    })
  })
})
