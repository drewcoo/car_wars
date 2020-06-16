import Character from '../../Character'
import Control from '../../Control'
import Vehicle from '../../Vehicle'
import _ from 'lodash'
import Dice from '../../../utils/Dice'
import GameObjectFactory from '../GameObjectFactory'

describe('Control', () => {
  describe('#hazardCheck', () => {
    Vehicle.driverId = jest.fn().mockImplementation(() => 'fake_ID')
    Character.skillLevel = jest.fn().mockImplementation(() => 0)

    const difficulty = 0
    const vehicle = GameObjectFactory.vehicle({ speed: 0 })
    vehicle.phasing.difficulty = difficulty
    vehicle.status.handling = 0

    it('pass when not #loseControl', () => {
      Control.loseControl == jest.fn().mockImplementation(() => false)
      expect(Control.hazardCheck({ vehicle, difficulty })).toEqual('pass')
    })

    describe('#loseControl failure', () => {
      beforeEach(() => {
        Control.crashModifier = jest.fn().mockImplementation(() => 0)
        Control.loseControl = jest.fn().mockImplementation(() => true)
      })

      it('roll 1-4: minor fishtail', () => {
        Dice.roll = jest.fn().mockImplementation(() => _.random(1, 4))
        expect(Control.hazardCheck({ vehicle, difficulty })).toEqual('minor fishtail')
        const nextMove: any = vehicle.status.nextMove[0]
        expect(nextMove.fishtailDistance).toEqual(15)
        expect(['left', 'right']).toContain(nextMove.spinDirection)
      })

      it('roll 5-8: major fishtail', () => {
        Dice.roll  = jest.fn().mockImplementation(() => _.random(5, 8))
        expect(Control.hazardCheck({ vehicle, difficulty })).toEqual('major fishtail')
        const nextMove: any = vehicle.status.nextMove[0]
        expect(nextMove.fishtailDistance).toEqual(30)
        expect(['left', 'right']).toContain(nextMove.spinDirection)
      })

      it('roll 9,10: minor fishtail & roll Crash Table 1', () => {
        Dice.roll  = jest.fn().mockImplementation(() => _.random(9, 10))
        expect(Control.hazardCheck({ vehicle, difficulty })).toEqual('minor fishtail and roll on Crash Table 1')
        const nextMove: any = vehicle.status.nextMove[0]
        expect(nextMove.fishtailDistance).toEqual(15)
        expect(['left', 'right']).toContain(nextMove.spinDirection)
      })

      it('roll 11-14: major fishtail & roll Crash Table 1', () => {
        Dice.roll  = jest.fn().mockImplementation(() => _.random(11, 14))
        expect(Control.hazardCheck({ vehicle, difficulty })).toEqual('major fishtail and roll on Crash Table 1')
        const nextMove: any = vehicle.status.nextMove[0]
        expect(nextMove.fishtailDistance).toEqual(30)
        expect(['left', 'right']).toContain(nextMove.spinDirection)
      })

      it('roll 15 or more: major & minor fishtail & Crash Table 1', () => {
        Dice.roll  = jest.fn().mockImplementation(() => _.random(15, 20))
        expect(Control.hazardCheck({ vehicle, difficulty })).toEqual('major and minor fishtail and roll on Crash Table 1')
        const nextMove: any = vehicle.status.nextMove[0]
        expect(nextMove.fishtailDistance).toEqual(45)
        expect(['left', 'right']).toContain(nextMove.spinDirection)
      })
    })
  })
})
