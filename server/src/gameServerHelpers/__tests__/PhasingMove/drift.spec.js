import PhasingMove from '../../PhasingMove'
import GameObjectFactory from '../GameObjectFactory'
import _ from 'lodash'
/* eslint-disable-next-line no-unused-vars */
import { degreesEqual, equalsPoint } from '../../../utils/jestMatchers'
import { INCH } from '../../../utils/constants'

describe('PhasingMove', () => {
  describe('#drift', () => {
    let car

    beforeEach(() => {
      car = GameObjectFactory.car({})
      car.phasing.rect = car.rect.move({
        degrees: car.rect.facing,
        distance: car.rect.length,
      })
    })

    it.skip('left', () => {
      const distance = _.random(0, -INCH / 2)
      const result = PhasingMove.drift({ car, distance })

      expect(result.facing).degreesEqual(car.rect.facing)
      console.log()
      expect(
        car.rect.frPoint().distanceTo(result.brPoint()) + car.rect.flPoint().distanceTo(result.brPoint()),
      ).toBeCloseTo(car.rect.frPoint().distanceTo(car.rect.flPoint()))
    })

    it.skip('right', () => {
      const distance = _.random(0, INCH / 2)
      const result = PhasingMove.drift({ car, distance })

      expect(result.facing).degreesEqual(car.rect.facing)
      expect(
        car.rect.frPoint().distanceTo(result.blPoint()) + car.rect.flPoint().distanceTo(result.blPoint()),
      ).toBeCloseTo(car.rect.frPoint().distanceTo(car.rect.flPoint()))
    })
  })
})
