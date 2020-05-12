import Time from '../../Time'
import VehicleStatusHelper from '../../VehicleStatusHelper'
import GameObjectFactory from '../GameObjectFactory'

describe('Time', () => {
  describe('#slowTheDead', () => {
    VehicleStatusHelper.enoughWheels = jest.fn()
    let _data, car, driver, match, speedBefore

    beforeEach(() => {
      car = GameObjectFactory.car({})
      match = GameObjectFactory.match({ carIds: [car.id] })
      _data = {
        cars: [car],
        matches: [match],
      }

      driver = car.design.components.crew.find((elem) => elem.role === 'driver')
      match = _data.matches[0]
      speedBefore = car.status.speed
    })

    it("doesn't slow vehicles when driver alert, plant working, and enough wheels", () => {
      expect(driver.damagePoints).toBeGreaterThan(1)
      expect(car.design.components.powerPlant.damagePoints).toBeGreaterThan(0)
      VehicleStatusHelper.enoughWheels.mockReturnValueOnce(true)
      Time.slowTheDead({ match, _data })
      expect(car.status.speed).toEqual(speedBefore)
    })

    describe('slows vehicles when', () => {
      it('driver not alert', () => {
        driver.damagePoints = 1
        expect(car.design.components.powerPlant.damagePoints).toBeGreaterThan(0)
        VehicleStatusHelper.enoughWheels.mockReturnValueOnce(true)
        Time.slowTheDead({ match, _data })
        expect(car.status.speed).toEqual(
          Math.sign(speedBefore) * (Math.abs(speedBefore) - 5),
        )
      })

      it('plant not working', () => {
        expect(driver.damagePoints).toBeGreaterThan(1)
        car.design.components.powerPlant.damagePoints = 0
        VehicleStatusHelper.enoughWheels.mockReturnValueOnce(true)
        Time.slowTheDead({ match, _data })
        expect(car.status.speed).toEqual(
          Math.sign(speedBefore) * (Math.abs(speedBefore) - 5),
        )
      })
      it("doesn't have enough wheels", () => {
        expect(driver.damagePoints).toBeGreaterThan(1)
        expect(car.design.components.powerPlant.damagePoints).toBeGreaterThan(0)
        VehicleStatusHelper.enoughWheels.mockReturnValueOnce(false)
        Time.slowTheDead({ match, _data })
        expect(car.status.speed).toEqual(
          Math.sign(speedBefore) * (Math.abs(speedBefore) - 5),
        )
      })
    })
  })
})
