import Collisions from '../../Collisions'

describe('Collisions', () => {
  describe('#temporarySpeed({ thisDM, otherDM, speed })', () => {
    // p. 21

    describe('invalid params', () => {
      // figure out how to do typescript positive floats instead of these cases
      it('invalid 1st DM', () => {
        expect(() => {
          Collisions.temporarySpeed({
            thisDM: 0,
            otherDM: 1,
            speed: 100,
          })
        }).toThrow(/invalid DM/)
      })

      it('invalid 2nd DM', () => {
        expect(() => {
          Collisions.temporarySpeed({
            thisDM: 1,
            otherDM: -1,
            speed: 100,
          })
        }).toThrow(/invalid DM/)
      })
    })

    describe('a few valid params', () => {
      it('DM1: 2, DM2: 14 gives 0', () => {
        expect(
          Collisions.temporarySpeed({
            thisDM: 2,
            otherDM: 14,
            speed: 100,
          }),
        ).toBe(0)
      })

      it('DM1: 14, DM2: 2 gives 1', () => {
        expect(
          Collisions.temporarySpeed({
            thisDM: 14,
            otherDM: 2,
            speed: 100,
          }),
        ).toBe(100)
      })

      it('DM1: 1/3, DM2: 2/3 gives 1/4', () => {
        expect(
          Collisions.temporarySpeed({
            thisDM: 1 / 3,
            otherDM: 2 / 3,
            speed: 100,
          }),
        ).toBe(25)
      })

      it('DM1: 2/3, DM2: 1/3 gives 3/4', () => {
        expect(
          Collisions.temporarySpeed({
            thisDM: 2 / 3,
            otherDM: 1 / 3,
            speed: 100,
          }),
        ).toBe(75)
      })
    })
  })
})
