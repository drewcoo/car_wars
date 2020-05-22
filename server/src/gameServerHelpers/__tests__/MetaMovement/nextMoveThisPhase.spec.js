import MetaMovement from '../../MetaMovement'
import GameObjectFactory from '../GameObjectFactory'

xdescribe('MetaMovement', () => {
  describe('#nextToMoveThisPhase', () => {
    let vehicle0, vehicle1, vehicle2, match, _data

    beforeEach(() => {
      vehicle0 = GameObjectFactory.vehicle({ id: 'vehicle0', speed: 40 })
      vehicle1 = GameObjectFactory.vehicle({ id: 'vehicle1', speed: -50 })
      vehicle2 = GameObjectFactory.vehicle({ id: 'vehicle2', speed: 5 })

      match = GameObjectFactory.match({
        vehicleIds: [vehicle0.id, vehicle1.id, vehicle2.id],
      })

      _data = {
        vehicles: [vehicle0, vehicle1, vehicle2],
        matches: [match],
      }
    })

    it('when everyone has moved, returns null', () => {
      match.time.phase.unmoved = []
      expect(MetaMovement.nextToMoveThisPhase({ match, _data })).toBeNull()
    })

    xit('greatest Math.abs(speed) next', () => {
      match.time.phase.number = 1
      match.time.phase.unmoved = [vehicle0.id, vehicle1.id, vehicle2.id]
      expect(MetaMovement.nextToMoveThisPhase({ match, _data })).toEqual(vehicle1.id)
    })
  })
})
