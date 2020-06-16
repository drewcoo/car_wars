import Vehicle from '../../Vehicle'
import GameObjectFactory from '../GameObjectFactory'

describe('Vehicle', () => {
  let vehicle: any

  beforeEach(() => {
    Vehicle.driverAwake = jest.fn().mockImplementation(() => true)
    Vehicle.plantWorking = jest.fn().mockImplementation(() => true)
    Vehicle.weaponsOut = jest.fn().mockImplementation(() => false)
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
        Vehicle.driverAwake = jest.fn().mockImplementation(() => false)
        expect(Vehicle.isKilled({ vehicle })).toBe(true)
      })

      it('plant and weapons out', () => {
        Vehicle.plantWorking = jest.fn().mockImplementation(() => false)
        Vehicle.weaponsOut = jest.fn().mockImplementation(() => true)
        expect(Vehicle.isKilled({ vehicle })).toBe(true)
      })

      it('is only stopped, not dead', () => {
        Vehicle.driverAwake = jest.fn().mockImplementation(() => true)
        Vehicle.plantWorking = jest.fn().mockImplementation(() => true)
        Vehicle.weaponsOut = jest.fn().mockImplementation(() => false)
        expect(vehicle.status.killed).not.toBe(true)
        expect(Vehicle.isKilled({ vehicle })).toBe(false)
      })
    })

    it('is not killed', () => {
      expect(Vehicle.isKilled({ vehicle })).toBe(false)
    })
  })
})
