import Time from '../../Time'
import Vehicle from '../../Vehicle'
import GameObjectFactory from '../GameObjectFactory'

xdescribe('Time', () => {
  describe('#slowTheDead', () => {
    Vehicle.driverAwake = jest.fn()
    Vehicle.plantOut = jest.fn()
    Vehicle.enoughWheels = jest.fn()

    let _data, vehicle, driver, match, speedBefore

    beforeEach(() => {
      driver = GameObjectFactory.character({})
      vehicle = GameObjectFactory.vehicle({})

      speedBefore = vehicle.status.speed

      GameObjectFactory.putCrewInVehicle({ vehicle, crewMember: driver })

      match = GameObjectFactory.match({})
      GameObjectFactory.putVehicleInMatch({ match, vehicle })

      GameObjectFactory.putCharacterInMatch({ match, character: driver })

      _data = {
        cars: [car],
        characters: [driver],
        matches: [match],
      }

      speedBefore = vehicle.status.speed
    })

    it("doesn't slow vehicles when driver alert, plant working, and enough wheels", () => {
      !Vehicle.driverAwake.mockReturnValueOnce(false)
      Vehicle.plantOut.mockReturnValueOnce(false)
      Vehicle.enoughWheels.mockReturnValueOnce(true)

      Time.slowTheDead({ match })
      expect(vehicle.status.speed).toEqual(speedBefore)
    })

    describe('slows vehicles when', () => {
      it('driver not alert', () => {
        !Vehicle.driverAwake.mockReturnValueOnce(true)
        Vehicle.plantOut.mockReturnValueOnce(false)
        Vehicle.enoughWheels.mockReturnValueOnce(true)

        Time.slowTheDead({ match })
        expect(vehicle.status.speed).toEqual(Math.sign(speedBefore) * (Math.abs(speedBefore) - 5))
      })

      it('plant not working', () => {
        !Vehicle.driverAwake.mockReturnValueOnce(false)
        Vehicle.plantOut.mockReturnValueOnce(true)
        Vehicle.enoughWheels.mockReturnValueOnce(true)

        Time.slowTheDead({ match })
        expect(vehicle.status.speed).toEqual(Math.sign(speedBefore) * (Math.abs(speedBefore) - 5))
      })

      it("doesn't have enough wheels: slow by 30MPH", () => {
        !Vehicle.driverAwake.mockReturnValueOnce(false)
        Vehicle.plantOut.mockReturnValueOnce(false)
        Vehicle.enoughWheels.mockReturnValueOnce(false)

        Time.slowTheDead({ match })
        expect(vehicle.status.speed).toEqual(Math.sign(speedBefore) * (Math.abs(speedBefore) - 30))
      })
    })
  })
})
