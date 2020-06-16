import Dice from '../../../utils/Dice'
import Control from '../../Control'
import GameObjectFactory from '../GameObjectFactory'

describe('Control', () => {
  describe('#loseControl', () => {
    const vehicle = GameObjectFactory.vehicle({ speed: 0 })
    vehicle.status.handling = 0

    it('when table says "Fsafe", do not lose control', () => {
      // we should lose control here unless the table says safe
      Control.checkNeeded = jest.fn().mockImplementation(() => 'safe')
      expect(Control.loseControl({ vehicle })).toBe(false)
    })

    it('when table says "XX", lose control', () => {
      // we should never lose control here unless XX
      Control.checkNeeded = jest.fn().mockImplementation(() => 'XX')
      expect(Control.loseControl({ vehicle })).toBe(true)
    })

    describe('when table gives a number', () => {
      const rollNeeded = 4

      beforeEach(() => {
        Control.checkNeeded = jest.fn().mockImplementation(() => `${rollNeeded}`)
      })

      it('when roll under that (num - 1), lose control', () => {
        Dice.roll = jest.fn().mockImplementation(() => rollNeeded - 1)
        expect(Control.loseControl({ vehicle })).toBe(true)
      })

      it('when roll that number, maintain control', () => {
        Dice.roll = jest.fn().mockImplementation(() => rollNeeded)
        expect(Control.loseControl({ vehicle })).toBe(false)
      })
    })
  })
})
