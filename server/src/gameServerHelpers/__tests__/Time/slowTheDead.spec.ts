import Time from '../../Time'
import Vehicle from '../../Vehicle'
import Match from '../../Match'
import GameObjectFactory from '../GameObjectFactory'

describe('Time', () => {
  describe('#slowTheDead', () => {
    let speedBefore: number
    const vehicle = GameObjectFactory.vehicle({})
    const match = GameObjectFactory.match({})
    GameObjectFactory.putVehicleInMatch({ match, vehicle })

    Match.cars = jest.fn().mockImplementation(() => [vehicle])

    beforeEach(() => {
      speedBefore = vehicle.status.speed
    })

    it("doesn't slow vehicles when driver alert, plant working, and enough wheels", () => {
      Vehicle.driverAwake = jest.fn().mockImplementation(() => true)
      Vehicle.plantWorking = jest.fn().mockImplementation(() => true)
      Vehicle.enoughWheels = jest.fn().mockImplementation(() => true)
      Time.slowTheDead({ match })
      expect(vehicle.status.speed).toEqual(speedBefore)
    })

    describe('slows vehicles when', () => {
      it('driver not alert', () => {
        Vehicle.driverAwake = jest.fn().mockImplementation(() => false)
        Vehicle.plantWorking = jest.fn().mockImplementation(() => true)
        Vehicle.enoughWheels = jest.fn().mockImplementation(() => true)
        Time.slowTheDead({ match })
        expect(vehicle.status.speed).toEqual(Math.sign(speedBefore) * (Math.abs(speedBefore) - 5))
      })

      it('plant not working', () => {
        Vehicle.driverAwake = jest.fn().mockImplementation(() => true)
        Vehicle.plantWorking = jest.fn().mockImplementation(() => false)
        Vehicle.enoughWheels = jest.fn().mockImplementation(() => true)
        Time.slowTheDead({ match })
        expect(vehicle.status.speed).toEqual(Math.sign(speedBefore) * (Math.abs(speedBefore) - 5))
      })

      it("doesn't have enough wheels: slow by 30MPH", () => {
        Vehicle.driverAwake = jest.fn().mockImplementation(() => true)
        Vehicle.plantWorking = jest.fn().mockImplementation(() => true)
        Vehicle.enoughWheels = jest.fn().mockImplementation(() => false)
        Time.slowTheDead({ match })
        expect(vehicle.status.speed).toEqual(Math.sign(speedBefore) * (Math.abs(speedBefore) - 30))
      })
    })
  })
})
