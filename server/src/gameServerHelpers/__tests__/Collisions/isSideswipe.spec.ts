import _ from 'lodash'
import Collisions from '../../Collisions'

describe('Collisions', () => {
  describe('#isSideswipe (assuming we hit the side)', () => {
    // rammer strikes with rammer.phasing.rect
    // rammmed is struck in rammed.rect

    // At exactly 45 degrees from perpendicular this could be a sideswipe
    // or not. pp 18-19 don't specify which to choose.
    // I chose to treat the boundary cases a non-sideswipes.

    it('plus < 45 degrees difference? Yes!', () => {
      const rammer = { phasing: { rect: { facing: 0 } } }
      const rammed = { rect: { facing: _.random(0.1, 44.9) } }
      expect(Collisions.isSideswipe({ rammer, rammed })).toBe(true)
    })
    it('minus < 45 degrees difference? Yes!', () => {
      const rammer = { phasing: { rect: { facing: 0 } } }
      const rammed = { rect: { facing: -1 * _.random(0.1, 44.9) } }
      expect(Collisions.isSideswipe({ rammer, rammed })).toBe(true)
    })

    it('plus exactly 45 degrees? No.', () => {
      const rammer = { phasing: { rect: { facing: 0 } } }
      const rammed = { rect: { facing: 45 } }
      expect(Collisions.isSideswipe({ rammer, rammed })).toBe(false)
    })
    it('minus exactly 45 degrees? No.', () => {
      const rammer = { phasing: { rect: { facing: 0 } } }
      const rammed = { rect: { facing: -45 } }
      expect(Collisions.isSideswipe({ rammer, rammed })).toBe(false)
    })

    it('plus between 45 and 90 degrees? No.', () => {
      const rammer = { phasing: { rect: { facing: _.random(45.1, 89.9) } } }
      const rammed = { rect: { facing: 0 } }
      expect(Collisions.isSideswipe({ rammer, rammed })).toBe(false)
    })

    it('minus between 45 and 90 degrees? No.', () => {
      const rammer = {
        phasing: { rect: { facing: -1 * _.random(45.1, 89.9) } },
      }
      const rammed = { rect: { facing: 0 } }
      expect(Collisions.isSideswipe({ rammer, rammed })).toBe(false)
    })
  })
})
