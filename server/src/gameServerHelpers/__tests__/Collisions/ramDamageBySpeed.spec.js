import Collisions from '../../Collisions'

describe('Collisions', () => {
  describe('#ramDamageBySpeed', () => {
    it('throws for negative (ram) speed', () => {
      expect(() => {
        Collisions.ramDamageBySpeed(-10)
      }).toThrow()
    })
    it('throws for invalid speeds - not multiple of 5', () => {
      expect(() => {
        Collisions.ramDamageBySpeed(9.2)
      }).toThrow()
    })
    it('does  0 damage at 0MPH', () => {
      expect(Collisions.ramDamageBySpeed(0)).toBe('0d')
    })
    it('does 1d-2 damage at 10MPH', () => {
      expect(Collisions.ramDamageBySpeed(10)).toBe('1d-2')
    })
    it('does 1d-4 damage at 5MPH', () => {
      expect(Collisions.ramDamageBySpeed(5)).toBe('1d-4')
    })
    it('does 5d damage at 15MPH', () => {
      expect(Collisions.ramDamageBySpeed(15)).toBe('1d-1')
    })
    it('does 1d damage at 25MPH', () => {
      expect(Collisions.ramDamageBySpeed(25)).toBe('1d')
    })

    it('does 5d damage at 50MPH', () => {
      expect(Collisions.ramDamageBySpeed(50)).toBe('5d')
    })
  })
})
