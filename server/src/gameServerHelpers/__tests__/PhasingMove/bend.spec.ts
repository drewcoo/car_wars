import PhasingMove from '../../PhasingMove'
import GameObjectFactory from '../GameObjectFactory'
import _ from 'lodash'
require('../../../utils/jestMatchers')

describe('PhasingMove', () => {
  describe('#bend', () => {
    let vehicle: any

    beforeEach(() => {
      vehicle = GameObjectFactory.vehicle({})
      vehicle.phasing.rect = vehicle.rect.move({
        degrees: vehicle.rect.facing,
        distance: vehicle.rect.length,
      })
    })

    it('left < 90°', () => {
      const degrees = _.random(0, -90)
      const result = PhasingMove.bend({ vehicle, degrees })

      expect(result.facing).degreesEqual(vehicle.rect.facing + degrees)

      expect(vehicle.rect.flPoint()).equalsPoint(result.blPoint())
    })

    it('right < 90°', () => {
      const degrees = _.random(0, 90)
      const result = PhasingMove.bend({ vehicle, degrees })

      expect(result.facing).degreesEqual(vehicle.rect.facing + degrees)

      expect(vehicle.rect.frPoint()).equalsPoint(result.brPoint())
    })

    it.skip("trying too far doesn't move you", () => {
      const degrees = _.random(91, 271)
      const result = PhasingMove.bend({ vehicle, degrees })

      expect(result.facing).degreesEqual(vehicle.rect.facing)

      expect(vehicle.rect.brPoint()).equalsPoint(result.brPoint())
    })
  })
})
