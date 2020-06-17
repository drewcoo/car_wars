import MetaMovement from '../../MetaMovement'
import GameObjectFactory from '../GameObjectFactory'
import Vehicle from '../../Vehicle'

describe('MetaMovement', () => {
  Vehicle.withId = jest.fn()

  let vehicle0: any, vehicle1: any, match0: any, match1: any, _data: any

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
      Vehicle.withId = jest.fn().mockImplementation(() => vehicle0)
      Vehicle.withId = jest.fn().mockImplementation(() => vehicle1)
    })

    xit('phase 4: vehicle0 moves 0; vehicle1 moves 1', () => {
      // instead, maybe call MetaMovement.allMovesThisturn({ match })
      // and mock Vehicle.withId({ id }) to inject the Vehicle data
      // but can I mock it so that calling with different ids returns different data
      // or do I just use matches with one vehicle for the test?
      console.log(match0)
      expect(
        MetaMovement.canMoveThisPhase({
          //match: _data.matches.find((elem: any) => elem.id === match0.id)
          match: match0,
        }),
      ).toEqual([vehicle1.id])
    })

    xit('phase 5: vehicle0 moves 1; vehicle1 moves 1', () => {
      expect(
        MetaMovement.canMoveThisPhase({
          match: _data.matches.find((elem: any) => elem.id === match1.id),
        }),
      ).toEqual([vehicle0.id, vehicle1.id])
    })
  })
})
