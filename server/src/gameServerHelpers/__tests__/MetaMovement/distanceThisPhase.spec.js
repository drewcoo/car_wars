import MetaMovement from '../../MetaMovement'
import _ from 'lodash'

describe('MetaMovement', () => {
  describe('#distanceThisPhase', () => {
    const speed = 55

    describe('must have valid phase number', () => {
      it('must be minimum phase 1', () => {
        expect(() => {
          MetaMovement.distanceThisPhase({ speed, phase: 0 })
        }).toThrow()
      })

      it('must be maximum phase 5', () => {
        expect(() => {
          MetaMovement.distanceThisPhase({ speed, phase: 6 })
        }).toThrow()
      })
    })
    describe('spot check', () => {
      it('moves 1.5 in phase 1', () => {
        expect(MetaMovement.distanceThisPhase({ speed, phase: 1 })).toEqual(1.5)
      })

      it('moves 1 in other phases', () => {
        expect(MetaMovement.distanceThisPhase({ speed, phase: _.random(2, 5) })).toEqual(1)
      })
    })
  })
})
