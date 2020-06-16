import _ from 'lodash'
import PhasingMove from '../../PhasingMove'
import GameObjectFactory from '../GameObjectFactory'
import '../../../utils/jestMatchers'
import Rectangle from '../../../utils/geometry/Rectangle'

describe('PhasingMove', () => {
  describe('#straight', () => {
    let vehicle, distance: number, init: Rectangle, moved: Rectangle

    beforeEach(() => {
      vehicle = GameObjectFactory.vehicle({})
      //let signedDistance = _.random(-150, 150)
      distance = _.random(0, 150) //Math.abs(signedDistance)
      vehicle.rect = vehicle.phasing.rect.clone()
      init = vehicle.phasing.rect.clone()
      moved = PhasingMove.straight({ vehicle, distance })

      //expect(moved).toEqual(vehicle.phasing.rect)
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
