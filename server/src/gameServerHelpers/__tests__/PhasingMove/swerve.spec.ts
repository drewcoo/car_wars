import PhasingMove from '../../PhasingMove'
import GameObjectFactory from '../GameObjectFactory'
import _ from 'lodash'
import '../../../utils/jestMatchers'

describe('PhasingMove', () => {
  describe('#swerve', () => {
    let vehicle: any

    beforeEach(() => {
      vehicle = GameObjectFactory.vehicle({})
      vehicle.phasing.rect = vehicle.rect.move({
        degrees: vehicle.rect.facing,
        distance: vehicle.rect.length,
      })
    })

    it('left', () => {
      const degrees = _.random(-1, -90)
      const result = PhasingMove.swerve({ vehicle, degrees })

      expect(result.facing).degreesEqual(vehicle.rect.facing + degrees)

      expect(vehicle.rect.side('F').middle()).equalsPoint(result.blPoint())
    })

    it('left, left', () => {
      const degrees = -15
      const initFacing = vehicle.rect.facing

      let result = PhasingMove.swerve({ vehicle, degrees })
      expect(result.facing).degreesEqual(initFacing + degrees)
      expect(vehicle.rect.side('F').middle()).equalsPoint(result.blPoint())
      vehicle.phasing.rect = result
      result = PhasingMove.swerve({ vehicle, degrees })
      expect(result.facing).degreesEqual(initFacing + 2 * degrees)
      expect(vehicle.rect.side('F').middle()).equalsPoint(result.blPoint())
    })

    it('right', () => {
      const degrees = _.random(1, 90)
      const result = PhasingMove.swerve({ vehicle, degrees })

      expect(result.facing).degreesEqual(vehicle.rect.facing + degrees)

      expect(vehicle.rect.side('F').middle()).equalsPoint(result.brPoint())
    })

    it.skip("trying too far doesn't move you", () => {
      const degrees = _.random(91, 269)
      expect(vehicle.rect.frPoint()).equalsPoint(vehicle.phasing.rect.brPoint())

      const result = PhasingMove.swerve({ vehicle, degrees })

      expect(result.facing).degreesEqual(vehicle.rect.facing)

      expect(vehicle.rect.frPoint()).equalsPoint(vehicle.phasing.rect.brPoint())
      expect(vehicle.rect.frPoint()).equalsPoint(result.brPoint())
    })
  })
})
