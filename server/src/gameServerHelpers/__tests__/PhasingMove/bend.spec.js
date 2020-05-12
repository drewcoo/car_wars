import PhasingMove from '../../PhasingMove'
import GameObjectFactory from '../GameObjectFactory'
import _ from 'lodash'
/* eslint-disable-next-line no-unused-vars */
import { degreesEqual, equalsPoint } from '../../../utils/jestMatchers'

describe('PhasingMove', () => {
  describe('#bend', () => {
    let car

    beforeEach(() => {
      car = GameObjectFactory.car({})
      car.phasing.rect = car.rect.move({
        degrees: car.rect.facing,
        distance: car.rect.length,
      })
    })

    it('left < 90°', () => {
      const degrees = _.random(0, -90)
      const result = PhasingMove.bend({ car, degrees })

      expect(result.facing).degreesEqual(car.rect.facing + degrees)

      expect(car.rect.flPoint()).equalsPoint(result.blPoint())
    })

    it('right < 90°', () => {
      const degrees = _.random(0, 90)
      const result = PhasingMove.bend({ car, degrees })

      expect(result.facing).degreesEqual(car.rect.facing + degrees)

      expect(car.rect.frPoint()).equalsPoint(result.brPoint())
    })

    it.skip("trying too far doesn't move you", () => {
      const degrees = _.random(91, 271)
      const result = PhasingMove.bend({ car, degrees })

      expect(result.facing).degreesEqual(car.rect.facing)

      expect(car.rect.brPoint()).equalsPoint(result.brPoint())
    })
  })
})
