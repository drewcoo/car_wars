import _ from 'lodash'
import Control from '../../Control'

describe('Control', () => {
  describe('#row', () => {
    describe('is always safe for -5MPH < speed < 5MPH', () => {
      it('at -2.5MPH', () => {
        const result = Control.row({ speed: -2.5 })
        expect(result).toEqual(_.fill(Array(result.length), 'safe'))
      })

      it('at 0MPH', () => {
        const result = Control.row({ speed: 0 })
        expect(result).toEqual(_.fill(Array(result.length), 'safe'))
      })

      it('at 2.5MPH', () => {
        const result = Control.row({ speed: 2.5 })
        expect(result).toEqual(_.fill(Array(result.length), 'safe'))
      })
    })

    it('cannot handle > 300MPH', () => {
      expect(() => {
        Control.row({ speed: 400 })
      }).toThrow(/not handled/i)
    })

    describe('returns expected results for', () => {
      const resultAt50mph =
        // prettier-ignore
        ['safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', 'safe', '2', '3', '4', '5']

      it('positive speeds', () => {
        expect(Control.row({ speed: 50 })).toEqual(resultAt50mph)
      })

      it('negative speeds', () => {
        expect(Control.row({ speed: -50 })).toEqual(resultAt50mph)
      })
    })
  })
})
