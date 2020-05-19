import Movement from '../../Movement'
import GameObjectFactory from '../GameObjectFactory'

describe('Movement', () => {
  describe('#nextToMoveThisPhase', () => {
    let car0, car1, car2, match, _data

    beforeEach(() => {
      car0 = GameObjectFactory.car({ id: 'car0', speed: 40 })
      car1 = GameObjectFactory.car({ id: 'car1', speed: -50 })
      car2 = GameObjectFactory.car({ id: 'car2', speed: 5 })

      match = GameObjectFactory.match({
        carIds: [car0.id, car1.id, car2.id],
      })

      _data = {
        cars: [car0, car1, car2],
        matches: [match],
      }
    })

    it('when everyone has moved, returns null', () => {
      match.time.phase.unmoved = []
      expect(Movement.nextToMoveThisPhase({ match, _data })).toBeNull()
    })

    xit('greatest Math.abs(speed) next', () => {
      match.time.phase.number = 1
      match.time.phase.unmoved = [car0.id, car1.id, car2.id]
      expect(Movement.nextToMoveThisPhase({ match, _data })).toEqual(car1.id)
    })
  })
})
