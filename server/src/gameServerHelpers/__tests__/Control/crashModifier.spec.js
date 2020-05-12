import Control from '../../Control'

describe('Control', () => {
  describe('#crashModifier', () => {
    it('returns null at < 5MPH', () => {
      // because no crashing? no damage?
      expect(Control.crashModifier({ speed: 0 })).toBeNull()
    })

    it('works with negative speeds', () => {
      expect(Control.crashModifier({ speed: -70 })).toEqual(2)
    })

    it('works with positive speeds', () => {
      expect(Control.crashModifier({ speed: 25 })).toEqual(-1)
    })
  })
})
