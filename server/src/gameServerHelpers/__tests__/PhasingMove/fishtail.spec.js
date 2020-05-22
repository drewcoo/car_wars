import PhasingMove from '../../PhasingMove'
import GameObjectFactory from '../GameObjectFactory'
/* eslint-disable-next-line no-unused-vars */
import { degreesEqual } from '../../../utils/jestMatchers'

describe('PhasingMove', () => {
  describe('#fishtail', () => {
    let vehicle, initialFacing

    beforeEach(() => {
      vehicle = GameObjectFactory.vehicle({})
      initialFacing = vehicle.phasing.rect.facing
    })

    describe('direction', () => {
      // fishtailing in a direction means your tail moves that way
      // so your facing goes opposite
      it('goes left', () => {
        vehicle.phasing.rect.facing -= 30
        PhasingMove.fishtail({ vehicle, direction: 'left', degrees: 30 })
        expect(vehicle.phasing.rect.facing).degreesEqual(initialFacing)
      })

      it('goes right', () => {
        vehicle.phasing.rect.facing += 30
        PhasingMove.fishtail({ vehicle, direction: 'right', degrees: 30 })
        expect(vehicle.phasing.rect.facing).degreesEqual(initialFacing)
      })

      it('does not go anywhere else', () => {
        expect(() => {
          PhasingMove.fishtail({ vehicle, direction: 'anywhere else', degrees: 30 })
        }).toThrow()
      })
    })
  })
})
