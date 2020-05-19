import _ from 'lodash'
import PhasingMove from '../../PhasingMove'
import GameObjectFactory from '../GameObjectFactory'
/* eslint-disable-next-line no-unused-vars */
import { degreesEqual } from '../../../utils/jestMatchers'

describe('PhasingMove', () => {
  describe('#straight', () => {
    let car, distance, init, moved

    beforeEach(() => {
      car = GameObjectFactory.car({})
      //let signedDistance = _.random(-150, 150)
      distance = _.random(0, 150) //Math.abs(signedDistance)
      car.rect = car.phasing.rect.clone()
      init = car.phasing.rect.clone()
      moved = PhasingMove.straight({ car, distance })

      //expect(moved).toEqual(car.phasing.rect)
    })

    it('moves the distance', () => {
      const movedDistance = init.brPoint().distanceTo(moved.brPoint())
      expect(_.round(movedDistance)).toEqual(distance)
    })

    it('moves in the direction', () => {
      const direction = init.brPoint().degreesTo(moved.brPoint())
      expect(direction).degreesEqual(init.facing)
    })

    it('maintains facing', () => {
      expect(init.facing).toEqual(moved.facing)
    })
  })
})
