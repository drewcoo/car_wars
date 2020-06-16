import PhasingMove from '../../PhasingMove'
import GameObjectFactory from '../GameObjectFactory'
import _ from 'lodash'
import { INCH } from '../../../utils/constants'

describe('PhasingMove', () => {
  describe('#drift', () => {
    let vehicle: any

    beforeEach(() => {
      vehicle = GameObjectFactory.vehicle({})
      vehicle.phasing.rect = vehicle.rect.move({
        degrees: vehicle.rect.facing,
        distance: vehicle.rect.length,
      })
    })

    it.skip('left', () => {
      const distance = _.random(0, -INCH / 2)
      const result = PhasingMove.drift({ vehicle, distance })
      expect(result.facing).degreesEqual(vehicle.rect.facing)
      expect(
        vehicle.rect.frPoint().distanceTo(result.brPoint()) + vehicle.rect.flPoint().distanceTo(result.brPoint()),
      ).toBeCloseTo(vehicle.rect.frPoint().distanceTo(vehicle.rect.flPoint()))
    })

    it.skip('right', () => {
      const distance = _.random(0, INCH / 2)
      const result = PhasingMove.drift({ vehicle, distance })

      expect(result.facing).degreesEqual(vehicle.rect.facing)
      expect(
        vehicle.rect.frPoint().distanceTo(result.blPoint()) + vehicle.rect.flPoint().distanceTo(result.blPoint()),
      ).toBeCloseTo(vehicle.rect.frPoint().distanceTo(vehicle.rect.flPoint()))
    })
  })
})
