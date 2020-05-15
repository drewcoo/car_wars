import Movement from '../../Movement'
import GameObjectFactory from '../GameObjectFactory'

describe('Movement', () => {
  let car0, car1, match0, match1, _data

  beforeEach(() => {
    car0 = GameObjectFactory.car({ id: 'car0', speed: 40 })
    car1 = GameObjectFactory.car({ id: 'car1', speed: 50 })

    match0 = GameObjectFactory.match({
      id: 'match0',
      carIds: [car0.id, car1.id],
    })
    match0.time.phase.number = 4
    match1 = GameObjectFactory.match({
      id: 'match1',
      carIds: [car0.id, car1.id],
    })
    match1.time.phase.number = 5

    _data = {
      cars: [car0, car1],
      matches: [match0, match1],
    }
  })

  describe('#canMoveThisPhase', () => {
    it('phase 4: car0 moves 0; car1 moves 1', () => {
      expect(
        Movement.canMoveThisPhase({
          match: _data.matches.find((elem) => elem.id === match0.id),
          _data,
        }),
      ).toEqual([car1.id])
    })

    it('phase 5: car0 moves 1; car1 moves 1', () => {
      expect(
        Movement.canMoveThisPhase({
          match: _data.matches.find((elem) => elem.id === match1.id),
          _data,
        }),
      ).toEqual([car0.id, car1.id])
    })
  })
})