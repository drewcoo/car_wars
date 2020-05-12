import Collisions from '../../Collisions'
describe('Collisions', () => {
  describe('#handlingChange', () => {
    it('handles zero', () => {
      expect(Collisions.handlingChange({ speed: 0 })).toEqual(1)
    })

    it('handles negative', () => {
      expect(Collisions.handlingChange({ speed: -25 })).toEqual(2)
    })

    it('handles positive', () => {
      expect(Collisions.handlingChange({ speed: 100 })).toEqual(10)
    })
  })
})
