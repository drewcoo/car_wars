import PhasingMove from '../../PhasingMove'
import GameObjectFactory from '../GameObjectFactory'

describe('PhasingMove', () => {
  describe('#hasMoved', () => {
    let car

    beforeEach(() => {
      car = GameObjectFactory.car({})
      Object.assign(car.phasing.rect, car.rect)
    })

    it('if brPoint has moved, it has moved ', () => {
      car.phasing.rect = car.phasing.rect.move({
        distance: 100,
        degrees: car.phasing.rect.facing,
      })
      expect(PhasingMove.hasMoved({ car })).toBe(true)
    })

    it('if has turned, it has moved', () => {
      car.phasing.rect.facing += 1
      expect(PhasingMove.hasMoved({ car })).toBe(true)
    })

    it('if neither moved brPoint or turned, not moved', () => {
      expect(PhasingMove.hasMoved({ car })).toBe(false)
    })
  })
})
