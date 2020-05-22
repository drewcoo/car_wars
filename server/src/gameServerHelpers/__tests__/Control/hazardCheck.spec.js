import Character from '../../Character'
import Control from '../../Control'
import Vehicle from '../../Vehicle'
import _ from 'lodash'
import Dice from '../../../utils/Dice'
import GameObjectFactory from '../GameObjectFactory'

describe('Control', () => {
  describe('#hazardCheck', () => {
    Control.loseControl = jest.fn()
    Vehicle.driverId = jest.fn()
    Character.skillLevel = jest.fn()

    Vehicle.driverId.mockReturnValue('fake_ID')
    Character.skillLevel.mockReturnValue(0)

    const difficulty = 0
    const vehicle = GameObjectFactory.vehicle({ speed: 0 })
    vehicle.phasing.difficulty = difficulty
    vehicle.status.handling = 0

    it('pass when not #loseControl', () => {
      Control.loseControl.mockReturnValueOnce(false)
      expect(Control.hazardCheck({ vehicle, difficulty })).toEqual('pass')
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
        expect(Control.hazardCheck({ vehicle, difficulty })).toEqual('minor fishtail')
        expect(vehicle.status.nextMove[0].fishtailDistance).toEqual(15)
        expect(['left', 'right']).toContain(vehicle.status.nextMove[0].spinDirection)
      })

      it('roll 5-8: major fishtail', () => {
        Dice.roll.mockReturnValueOnce(_.random(5, 8))
        expect(Control.hazardCheck({ vehicle, difficulty })).toEqual('major fishtail')
        expect(vehicle.status.nextMove[0].fishtailDistance).toEqual(30)
        expect(['left', 'right']).toContain(vehicle.status.nextMove[0].spinDirection)
      })

      it('roll 9,10: minor fishtail & roll Crash Table 1', () => {
        Dice.roll.mockReturnValueOnce(_.random(9, 10))
        expect(Control.hazardCheck({ vehicle, difficulty })).toEqual('minor fishtail and roll on Crash Table 1')
        expect(vehicle.status.nextMove[0].fishtailDistance).toEqual(15)
        expect(['left', 'right']).toContain(vehicle.status.nextMove[0].spinDirection)
      })

      it('roll 11-14: major fishtail & roll Crash Table 1', () => {
        Dice.roll.mockReturnValueOnce(_.random(11, 14))
        expect(Control.hazardCheck({ vehicle, difficulty })).toEqual('major fishtail and roll on Crash Table 1')
        expect(vehicle.status.nextMove[0].fishtailDistance).toEqual(30)
        expect(['left', 'right']).toContain(vehicle.status.nextMove[0].spinDirection)
      })

      it('roll 15 or more: major & minor fishtail & Crash Table 1', () => {
        Dice.roll.mockReturnValueOnce(_.random(15, 20))
        expect(Control.hazardCheck({ vehicle, difficulty })).toEqual('major and minor fishtail and roll on Crash Table 1')
        expect(vehicle.status.nextMove[0].fishtailDistance).toEqual(45)
        expect(['left', 'right']).toContain(vehicle.status.nextMove[0].spinDirection)
      })
    })
  })
})
