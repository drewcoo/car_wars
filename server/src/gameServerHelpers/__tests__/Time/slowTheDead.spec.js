import Time from '../../Time'
import Vehicle from '../../Vehicle'
import Movement from '../../Movement'
import GameObjectFactory from '../GameObjectFactory'

describe('Time', () => {
  describe('#slowTheDead', () => {
    Movement.driverOut = jest.fn()
    Movement.plantOut = jest.fn()
    Vehicle.enoughWheels = jest.fn()

    let _data, car, driver, match, speedBefore

    beforeEach(() => {
      driver = GameObjectFactory.character({})
      car = GameObjectFactory.car({})

      speedBefore = car.status.speed

      GameObjectFactory.putCrewInVehicle({ vehicle: car, crewMember: driver })

      match = GameObjectFactory.match({})
      GameObjectFactory.putVehicleInMatch({ match, vehicle: car })

      GameObjectFactory.putCharacterInMatch({ match, character: driver })

      _data = {
        cars: [car],
        characters: [driver],
        matches: [match],
      }

      speedBefore = car.status.speed
    })

    it("doesn't slow vehicles when driver alert, plant working, and enough wheels", () => {
      Movement.driverOut.mockReturnValueOnce(false)
      Movement.plantOut.mockReturnValueOnce(false)
      Vehicle.enoughWheels.mockReturnValueOnce(true)

      Time.slowTheDead({ match, _data })
      expect(car.status.speed).toEqual(speedBefore)
    })

    describe('slows vehicles when', () => {
      it('driver not alert', () => {
        Movement.driverOut.mockReturnValueOnce(true)
        Movement.plantOut.mockReturnValueOnce(false)
        Vehicle.enoughWheels.mockReturnValueOnce(true)

        Time.slowTheDead({ match, _data })
        expect(car.status.speed).toEqual(Math.sign(speedBefore) * (Math.abs(speedBefore) - 5))
      })

      it('plant not working', () => {
        Movement.driverOut.mockReturnValueOnce(false)
        Movement.plantOut.mockReturnValueOnce(true)
        Vehicle.enoughWheels.mockReturnValueOnce(true)

        Time.slowTheDead({ match, _data })
        expect(car.status.speed).toEqual(Math.sign(speedBefore) * (Math.abs(speedBefore) - 5))
      })

      it("doesn't have enough wheels: slow by 30MPH", () => {
        Movement.driverOut.mockReturnValueOnce(false)
        Movement.plantOut.mockReturnValueOnce(false)
        Vehicle.enoughWheels.mockReturnValueOnce(false)

        Time.slowTheDead({ match, _data })
        expect(car.status.speed).toEqual(Math.sign(speedBefore) * (Math.abs(speedBefore) - 30))
      })
    })
  })
})
