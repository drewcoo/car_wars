import Dice from '../Dice'

describe('Dice#roll', () => {
  it('should throw when not passed a "d"', () => {
    expect(() => {
      Dice.roll('1')
    }).toThrow(TypeError)
  })

  it('should roll a six-sided die for "1d"', () => {
    const roll = Dice.roll('1d')
    expect(roll).toBeGreaterThan(0)
    expect(roll).toBeLessThan(7)
  })

  it('should handle positive modifier', () => {
    const modifier = Math.floor(10 * Math.random())
    expect(Dice.roll(`0d+${modifier}`)).toEqual(modifier)
  })

  it('should handle negative modifier', () => {
    const modifier = Math.floor(1 * Math.random())
    expect(Dice.roll(`0d-${modifier}`)).toEqual(0 - modifier)
  })
})
