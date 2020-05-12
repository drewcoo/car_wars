import Control from '../../Control'
import _ from 'lodash'
import Dice from 'src/utils/Dice'

describe('Control', () => {
  describe('#hazardCheck', () => {
    Control.loseControl = jest.fn()

    const car = {
      color: 'beige',
      log: [],
      phasing: {
        difficulty: 0,
      },
      status: {
        handling: 0,
        nextMove: [],
        speed: 0,
      },
    }
    const difficulty = 0

    it('pass when not #loseControl', () => {
      Control.loseControl.mockReturnValueOnce(false)
      expect(Control.hazardCheck({ car, difficulty })).toEqual('pass')
    })

    describe('#loseControl failure', () => {
      Dice.roll = jest.fn()
      Control.crashModifier = jest.fn()

      beforeEach(() => {
        Control.crashModifier.mockReturnValueOnce(0)
        Control.loseControl.mockReturnValueOnce(true)
      })

      it('roll 1-4: minor fishtail', () => {
        Dice.roll.mockReturnValueOnce(_.random(1, 4))
        expect(Control.hazardCheck({ car, difficulty })).toEqual(
          'minor fishtail',
        )
        expect(car.status.nextMove[0].fishtailDistance).toEqual(15)
        expect(['left', 'right']).toContain(
          car.status.nextMove[0].spinDirection,
        )
      })
      it('roll 5-8: major fishtail', () => {
        Dice.roll.mockReturnValueOnce(_.random(5, 8))
        expect(Control.hazardCheck({ car, difficulty })).toEqual(
          'major fishtail',
        )
        expect(car.status.nextMove[0].fishtailDistance).toEqual(30)
        expect(['left', 'right']).toContain(
          car.status.nextMove[0].spinDirection,
        )
      })
      it('roll 9,10: minor fishtail & roll Crash Table 1', () => {
        Dice.roll.mockReturnValueOnce(_.random(9, 10))
        expect(Control.hazardCheck({ car, difficulty })).toEqual(
          'minor fishtail and roll on Crash Table 1',
        )
        expect(car.status.nextMove[0].fishtailDistance).toEqual(15)
        expect(['left', 'right']).toContain(
          car.status.nextMove[0].spinDirection,
        )
      })
      it('roll 11-14: major fishtail & roll Crash Table 1', () => {
        Dice.roll.mockReturnValueOnce(_.random(11, 14))
        expect(Control.hazardCheck({ car, difficulty })).toEqual(
          'major fishtail and roll on Crash Table 1',
        )
        expect(car.status.nextMove[0].fishtailDistance).toEqual(30)
        expect(['left', 'right']).toContain(
          car.status.nextMove[0].spinDirection,
        )
      })
      it('roll 15 or more: major & minor fishtail & Crash Table 1', () => {
        Dice.roll.mockReturnValueOnce(_.random(15, 20))
        expect(Control.hazardCheck({ car, difficulty })).toEqual(
          'major and minor fishtail and roll on Crash Table 1',
        )
        expect(car.status.nextMove[0].fishtailDistance).toEqual(45)
        expect(['left', 'right']).toContain(
          car.status.nextMove[0].spinDirection,
        )
      })
    })
  })
})
