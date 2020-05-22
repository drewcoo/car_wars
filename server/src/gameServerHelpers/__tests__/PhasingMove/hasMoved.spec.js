import PhasingMove from '../../PhasingMove'
import GameObjectFactory from '../GameObjectFactory'

describe('PhasingMove', () => {
  describe('#hasMoved', () => {
    let vehicle

    beforeEach(() => {
      vehicle = GameObjectFactory.vehicle({})
      Object.assign(vehicle.phasing.rect, vehicle.rect)
    })

    it('if brPoint has moved, it has moved ', () => {
      vehicle.phasing.rect = vehicle.phasing.rect.move({
        distance: 100,
        degrees: vehicle.phasing.rect.facing,
      })
      expect(PhasingMove.hasMoved({ vehicle })).toBe(true)
    })

    it('if has turned, it has moved', () => {
      vehicle.phasing.rect.facing += 1
      expect(PhasingMove.hasMoved({ vehicle })).toBe(true)
    })

    it('if neither moved brPoint or turned, not moved', () => {
      expect(PhasingMove.hasMoved({ vehicle })).toBe(false)
    })
  })
})
