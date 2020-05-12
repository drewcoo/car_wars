import Movement from '../../Movement'
import _ from 'lodash'

describe('Movement', () => {
  describe('#distanceThisPhase', () => {
    const speed = 55

    describe('must have valid phase number', () => {
      it('must be minimum phase 1', () => {
        expect(() => {
          Movement.distanceThisPhase({ speed, phase: 0 })
        }).toThrow()
      })

      it('must be maximum phase 5', () => {
        expect(() => {
          Movement.distanceThisPhase({ speed, phase: 6 })
        }).toThrow()
      })
    })
    describe('spot check', () => {
      it('moves 1.5 in phase 1', () => {
        expect(Movement.distanceThisPhase({ speed, phase: 1 })).toEqual(1.5)
      })

      it('moves 1 in other phases', () => {
        expect(
          Movement.distanceThisPhase({ speed, phase: _.random(2, 5) }),
        ).toEqual(1)
      })
    })
  })
})
