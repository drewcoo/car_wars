import Dice from '../../../utils/Dice'
import Control from '../../Control'

describe('Control', () => {
  describe('#loseControl', () => {
    Control.checkNeeded = jest.fn()

    const car = {
      color: 'beige',
      log: [],
      status: {
        handling: 0,
        speed: 0,
      },
    }

    it('when table says "safe", do not lose control', () => {
      // we should lose control here unless the table says safe
      Control.checkNeeded.mockReturnValueOnce('safe')
      expect(Control.loseControl({ car })).toBe(false)
    })

    it('when table says "XX", lose control', () => {
      // we should never lose control here unless XX
      Control.checkNeeded.mockReturnValueOnce('XX')
      expect(Control.loseControl({ car })).toBe(true)
    })

    describe('when table gives a number', () => {
      const rollNeeded = 4
      Control.checkNeeded = jest.fn()
      Dice.roll = jest.fn()

      beforeEach(() => {
        Control.checkNeeded.mockReturnValueOnce(`${rollNeeded}`)
      })

      it('when roll under that (num - 1), lose control', () => {
        Dice.roll.mockReturnValueOnce(rollNeeded - 1)
        expect(Control.loseControl({ car })).toBe(true)
      })

      it('when roll that number, maintain control', () => {
        Dice.roll.mockReturnValueOnce(rollNeeded)
        expect(Control.loseControl({ car })).toBe(false)
      })
    })
  })
})
