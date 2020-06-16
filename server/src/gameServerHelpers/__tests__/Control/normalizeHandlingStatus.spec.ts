import _ from 'lodash'
import Control from '../../Control'

describe('Control', () => {
  describe('#normalizeHandlingStatus: -6 <= handling <= 7', () => {
    it('keeps value if in range', () => {
      const num = _.random(-6, 7)
      expect(Control.normalizeHandlingStatus(num)).toEqual(num)
    })
    it('negative status has minimum of -6', () => {
      // p. 10 Handling status cannot get worse than −6
      expect(Control.normalizeHandlingStatus(-8)).toEqual(-6)
    })
    it('positive status has max of 7', () => {
      // p. 9 a vehicle’s handling status
      // can never be adjusted above its starting
      // Handling Class, as modified for the driver’s skill and reflexes
      expect(Control.normalizeHandlingStatus(10)).toEqual(7)
    })
  })
})
