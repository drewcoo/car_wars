import Control from '../../Control'

describe('Control', () => {
  describe('#checkNeeded', () => {
    it('no - too slow!', () => {
      expect(Control.checkNeeded({ speed: 0, handlingStatus: -6 })).toEqual('safe')
    })

    it('50MPH/Handling -3 to catch off by one errors', () => {
      expect(Control.checkNeeded({ speed: 50, handlingStatus: -3 })).toEqual('2')
    })
  })
})
