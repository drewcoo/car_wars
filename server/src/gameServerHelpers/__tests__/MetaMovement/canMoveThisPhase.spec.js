import MetaMovement from '../../MetaMovement'
import GameObjectFactory from '../GameObjectFactory'
import Vehicle from '../../Vehicle'

xdescribe('MetaMovement', () => {
  Vehicle.withId = jest.fn()

  let vehicle0, vehicle1, match0, match1, _data

  beforeEach(() => {
    vehicle0 = GameObjectFactory.vehicle({ id: 'vehicle0', speed: 40 })
    vehicle1 = GameObjectFactory.vehicle({ id: 'vehicle1', speed: 50 })

    match0 = GameObjectFactory.match({ id: 'match0' })
    GameObjectFactory.putVehicleInMatch({ match: match0, vehicle: vehicle0 })
    GameObjectFactory.putVehicleInMatch({ match: match0, vehicle: vehicle1 })
    match0.time.phase.number = 4

    match1 = GameObjectFactory.match({ id: 'match1' })
    GameObjectFactory.putVehicleInMatch({ match: match1, vehicle: vehicle0 })
    GameObjectFactory.putVehicleInMatch({ match: match1, vehicle: vehicle1 })
    match1.time.phase.number = 5

    _data = {
      vehicles: [vehicle0, vehicle1],
      matches: [match0, match1],
    }
  })

  describe('#canMoveThisPhase', () => {
    beforeEach(() => {
      Vehicle.withId.mockReturnValueOnce(vehicle0)
      Vehicle.withId.mockReturnValueOnce(vehicle1)
    })

    it('phase 4: vehicle0 moves 0; vehicle1 moves 1', () => {
      expect(
        MetaMovement.canMoveThisPhase({
          match: _data.matches.find((elem) => elem.id === match0.id),
          _data,
        }),
      ).toEqual([vehicle1.id])
    })

    it('phase 5: vehicle0 moves 1; vehicle1 moves 1', () => {
      expect(
        MetaMovement.canMoveThisPhase({
          match: _data.matches.find((elem) => elem.id === match1.id),
          _data,
        }),
      ).toEqual([vehicle0.id, vehicle1.id])
    })
  })
})
