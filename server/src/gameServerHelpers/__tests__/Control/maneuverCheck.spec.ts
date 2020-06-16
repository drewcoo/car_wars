import Character from '../../Character'
import Control from '../../Control'
import Vehicle from '../../Vehicle'
import _ from 'lodash'
import Dice from '../../../utils/Dice'
import { INCH } from '../../../utils/constants'
import GameObjectFactory from '../GameObjectFactory'

describe('Control', () => {
  describe('#maneuverCheck', () => {
    Vehicle.driverId = jest.fn().mockImplementation(() => 'fake_ID')
    Character.skillLevel = jest.fn().mockImplementation(() => 0)

    const vehicle: any = GameObjectFactory.vehicle({ speed: 0 })
    vehicle.phasing.difficulty = 0
    vehicle.rect.facing = 0

    beforeEach(() => {
      Control.crashModifier = jest.fn().mockImplementation(() => 0)
      vehicle.log = []
      vehicle.status = {
        handling: 0,
        nextMove: [],
        speed: 0,
      }
    })

    describe('immediately bounces', () => {
      it('if difficulty is 0 - no maneuver means no check', () => {
        Control.loseControl = jest.fn().mockImplementation(() => true)
        vehicle.phasing.difficulty = 0
        expect(Control.maneuverCheck({ vehicle })).toEqual('no change')
      })

      it("if there's no control loss", () => {
        Control.loseControl = jest.fn().mockImplementation(() => false)
        expect(Control.maneuverCheck({ vehicle })).toEqual('no change')
      })

      it('except always roll if forced to', () => {
        // severe problems on CT2 can force CT1 rolls
        Control.loseControl = jest.fn().mockImplementation(() => false)
        vehicle.phasing.difficulty = 0
        expect(Control.maneuverCheck({ vehicle, forceCrashTable2Roll: true })).not.toEqual('no change')
      })
    })

    describe('roll', () => {
      const initialFacing = vehicle.rect.facing

      it('roll 2 or less: trivial skid', () => {
        Dice.roll = jest.fn().mockImplementation(() => _.random(-1, 2))
        expect(Control.maneuverCheck({ vehicle, forceCrashTable2Roll: true })).toEqual('trivial skid')
        expect(vehicle.status.nextMove[0].maneuver).toEqual('skid')
        expect(vehicle.status.nextMove[0].maneuverDirection).toEqual(initialFacing)
        expect(vehicle.status.nextMove[0].maneuverDistance).toEqual(INCH / 4)
      })

      it('roll 3 or 4: minor skid', () => {
        Dice.roll = jest.fn().mockImplementation(() => _.random(3, 4))
        expect(Control.maneuverCheck({ vehicle, forceCrashTable2Roll: true })).toEqual('minor skid')
        expect(vehicle.status.nextMove[0].maneuver).toEqual('skid')
        expect(vehicle.status.nextMove[0].maneuverDirection).toEqual(initialFacing)
        expect(vehicle.status.nextMove[0].maneuverDistance).toEqual(INCH / 2)
      })

      it('roll 5 or 6: moderate skid', () => {
        Dice.roll = jest.fn().mockImplementation(() => _.random(5, 6))
        expect(Control.maneuverCheck({ vehicle, forceCrashTable2Roll: true })).toEqual('moderate skid')
        expect(vehicle.status.nextMove[0].maneuver).toEqual('skid')
        expect(vehicle.status.nextMove[0].maneuverDirection).toEqual(initialFacing)
        expect(vehicle.status.nextMove[0].maneuverDistance).toEqual((INCH * 3) / 4)
        expect(vehicle.status.nextMove[1].maneuver).toEqual('skid')
        expect(vehicle.status.nextMove[1].maneuverDirection).toEqual(initialFacing)
        expect(vehicle.status.nextMove[1].maneuverDistance).toEqual(INCH / 4)
        /// then?
      })

      it('roll 7 or 8: severe skid', () => {
        Dice.roll = jest.fn().mockImplementation(() => _.random(7, 8))
        expect(Control.maneuverCheck({ vehicle, forceCrashTable2Roll: true })).toEqual('severe skid')
        expect(vehicle.status.nextMove[0].maneuver).toEqual('skid')
        expect(vehicle.status.nextMove[0].maneuverDirection).toEqual(initialFacing)
        expect(vehicle.status.nextMove[0].maneuverDistance).toEqual(INCH)
        expect(vehicle.status.nextMove[1].maneuver).toEqual('skid')
        expect(vehicle.status.nextMove[1].maneuverDirection).toEqual(initialFacing)
        expect(vehicle.status.nextMove[1].maneuverDistance).toEqual(INCH / 2)
      })

      it('roll 9 or 10: spinout', () => {
        // more TBD
        Dice.roll = jest.fn().mockImplementation(() => _.random(9, 10))
        const result = Control.maneuverCheck({
          vehicle,
          forceCrashTable2Roll: true,
        })
        expect(result).toEqual('spinout')
        expect(vehicle.status.nextMove[0].maneuver).toEqual('spinout')
        expect(vehicle.status.nextMove[0].spinDirection).not.toEqual('')
        // more?
      })

      it('roll 11 or 12: turn sideways and roll', () => {
        // more TBD
        Dice.roll = jest.fn().mockImplementation(() => _.random(11, 12))
        expect(Control.maneuverCheck({ vehicle, forceCrashTable2Roll: true })).toEqual('turn sideways and roll')
        expect(vehicle.status.nextMove[0].maneuver).toEqual('turn sideways and roll')
      })

      it('roll 13 or 14: turn sideways and roll, possibly on fire', () => {
        Dice.roll = jest.fn().mockImplementation(() => _.random(13, 14))
        expect(Control.maneuverCheck({ vehicle, forceCrashTable2Roll: true })).toEqual(
          'turn sideways and roll, possibly on fire',
        )
        expect(vehicle.status.nextMove[0].maneuver).toEqual('turn sideways and roll, possibly on fire')
      })

      xit('roll 15 or more: vault into air', () => {
        Dice.roll = jest.fn().mockImplementation(() => _.random(15, 16))
        expect(Control.maneuverCheck({ vehicle, forceCrashTable2Roll: true })).toEqual('vault into air')
        expect(vehicle.status.nextMove[0].maneuver).toEqual('vault into air')
      })
    })
  })
})
