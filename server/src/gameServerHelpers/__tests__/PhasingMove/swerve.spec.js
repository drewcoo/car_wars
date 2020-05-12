import PhasingMove from '../../PhasingMove'
import GameObjectFactory from '../GameObjectFactory'
import _ from 'lodash'
/* eslint-disable-next-line no-unused-vars */
import { degreesEqual, equalsPoint } from '../../../utils/jestMatchers'

describe('PhasingMove', () => {
  describe('#swerve', () => {
    let car

    beforeEach(() => {
      car = GameObjectFactory.car({})
      car.phasing.rect = car.rect.move({
        degrees: car.rect.facing,
        distance: car.rect.length,
      })
    })

    it('left', () => {
      const degrees = _.random(-1, -90)
      const result = PhasingMove.swerve({ car, degrees })

      expect(result.facing).degreesEqual(car.rect.facing + degrees)

      expect(car.rect.side('F').middle()).equalsPoint(result.blPoint())
    })

    it('right', () => {
      const degrees = _.random(1, 90)
      const result = PhasingMove.swerve({ car, degrees })

      expect(result.facing).degreesEqual(car.rect.facing + degrees)

      expect(car.rect.side('F').middle()).equalsPoint(result.brPoint())
    })

    it.skip("trying too far doesn't move you", () => {
      const degrees = _.random(91, 269)
      expect(car.rect.frPoint()).equalsPoint(car.phasing.rect.brPoint())

      const result = PhasingMove.swerve({ car, degrees })

      expect(result.facing).degreesEqual(car.rect.facing)

      expect(car.rect.frPoint()).equalsPoint(car.phasing.rect.brPoint())
      expect(car.rect.frPoint()).equalsPoint(result.brPoint())
    })
  })
})
