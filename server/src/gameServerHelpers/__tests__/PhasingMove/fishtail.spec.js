import PhasingMove from '../../PhasingMove'
import GameObjectFactory from '../GameObjectFactory'
/* eslint-disable-next-line no-unused-vars */
import { degreesEqual } from '../../../utils/jestMatchers'

describe('PhasingMove', () => {
  describe('#fishtail', () => {
    let car, initialFacing

    beforeEach(() => {
      car = GameObjectFactory.car({})
      initialFacing = car.phasing.rect.facing
    })

    describe('direction', () => {
      // fishtailing in a direction means your tail moves that way
      // so your facing goes opposite
      it('goes left', () => {
        car.phasing.rect.facing -= 30
        PhasingMove.fishtail({ car, direction: 'left', degrees: 30 })
        expect(car.phasing.rect.facing).degreesEqual(initialFacing)
      })

      it('goes right', () => {
        car.phasing.rect.facing += 30
        PhasingMove.fishtail({ car, direction: 'right', degrees: 30 })
        expect(car.phasing.rect.facing).degreesEqual(initialFacing)
      })

      it('does not go anywhere else', () => {
        expect(() => {
          PhasingMove.fishtail({ car, direction: 'anywhere else', degrees: 30 })
        }).toThrow()
      })
    })
  })
})
