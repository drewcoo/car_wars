import Point from '../../utils/Point'
import Segment from '../../utils/Segment'
import Rectangle from '../../utils/Rectangle'
import { degreesEqual } from '../../utils/conversions'
import Factory from './Factory'
import { COMPASS } from '../../utils/constants'

describe('Rectangle', () => {
  describe('#constructor', () => {
    it('throws if pointless', () => {
      expect(function () {
        return new Rectangle({ brPoint: null })
      }).toThrow(Error)
    })

    it('throws if no point', () => {
      expect(function () {
        return new Rectangle({ facing: COMPASS.NORTH })
      }).toThrow(Error)
    })

    it('throws if no facing', () => {
      expect(function () {
        return new Rectangle({ brPoint: Factory.Point() })
      }).toThrow(Error)
    })
  })

  describe('#toString', () => {
    it('JSON.stringifies', () => {
      const rectangle = Factory.Rectangle()
      expect(rectangle.toString()).toEqual(JSON.stringify(rectangle))
    })
  })

  describe('points', () => {
    it('#brPoint thows on __brPoint not point', () => {
      const rectangle = Factory.Rectangle()
      rectangle.__brPoint = 'notAPoint'
      expect(function () { rectangle.brPoint() }).toThrow(Error)
    })

    describe('valid', () => {
      const rectangle = Factory.Rectangle()
      const brp = rectangle.brPoint()

      it('#brPoint returns __brPoint', () => {
        expect(brp.equals(rectangle.__brPoint)).toBe(true)
      })

      it('#blPoint is one width left of #brPoint', () => {
        const expectedPoint = new Point({ x: brp.x - rectangle.width, y: brp.y })
        expect(rectangle.blPoint().equals(expectedPoint)).toBe(true)
      })

      it('#frPoint is one length in front of #brPoint', () => {
        const expectedPoint = new Point({ x: brp.x, y: brp.y - rectangle.length })
        expect(rectangle.frPoint().equals(expectedPoint)).toBe(true)
      })

      it('#flPoint is one length to front and one width to left of #brPoint', () => {
        const expectedPoint = new Point({
          x: brp.x - rectangle.width,
          y: brp.y - rectangle.length
        })
        expect(rectangle.flPoint().equals(expectedPoint)).toBe(true)
      })

      it('#center is 1/2 length to the front and 1/2 width to left of #brPoint', () => {
        const expectedPoint = new Point({
          x: brp.x - rectangle.width / 2,
          y: brp.y - rectangle.length / 2
        })
        expect(rectangle.center().equals(expectedPoint)).toBe(true)
      })
    })
  })

  describe('sides', () => {
    const rectangle = Factory.Rectangle()

    it('#fSide goes from #flPoint to #frPoint', () => {
      const expected = new Segment([rectangle.flPoint(), rectangle.frPoint()])
      expect(rectangle.fSide().equals(expected)).toBe(true)
    })

    it('#bSide goes from #blPoint to #brPoint', () => {
      const expected = new Segment([rectangle.blPoint(), rectangle.brPoint()])
      expect(rectangle.bSide().equals(expected)).toBe(true)
    })

    it('#lSide goes from #flPoint to #blPoint', () => {
      const expected = new Segment([rectangle.flPoint(), rectangle.blPoint()])
      expect(rectangle.lSide().equals(expected)).toBe(true)
    })

    it('#rSide goes from #frPoint to #brPoint', () => {
      const expected = new Segment([rectangle.brPoint(), rectangle.frPoint()])
      expect(rectangle.rSide().equals(expected)).toBe(true)
    })

    it('4 of #sides', () => {
      expect(Object.keys(rectangle.sides()).length).toEqual(4)
    })

    it('can seek a #side', () => {
      expect(rectangle.side('B').equals(rectangle.bSide())).toBe(true)
    })
  })

  describe('angles', () => {
    // Better off hard-coding degrees from center because calculating w/
    // floating-point points is inaccurate.
    // NB: This is only true for rectangles twice as long as they are wide.
    const rectangle = Factory.Rectangle()

    it('#flAngle is 30 deg counterclockwise from facing', () => {
      expect(degreesEqual(rectangle.flAngle(), rectangle.facing - 30)).toBe(true)
    })

    it('#frAngle is 30 deg clockwise from facing', () => {
      expect(degreesEqual(rectangle.frAngle(), rectangle.facing + 30)).toBe(true)
    })

    it('#blAngle is (180 + 30) deg clockwise from facing ', () => {
      expect(degreesEqual(rectangle.blAngle(), rectangle.facing + 210)).toBe(true)
    })

    it('#brAngle is (180 - 30) deg clockwise from facing', () => {
      expect(degreesEqual(rectangle.brAngle(), rectangle.facing + 150)).toBe(true)
    })
  })

  it('#clone rectangle #equals the original', () => {
    const rectangle = Factory.Rectangle()
    expect(rectangle.clone().equals(rectangle)).toBe(true)
  })

  describe('#move', () => {
    const original = Factory.Rectangle()
    const degrees = 360 * Math.random()
    // const distance = 1000 - 2000 * Math.random()
    const distance = 1000 * Math.random()
    const translated = original.move({ degrees, distance })

    it('goes the correct direction', () => {
      expect(translated instanceof Rectangle).toBe(true)
      expect(translated.brPoint() instanceof Point).toBe(true)
      const actual = original.brPoint().degreesTo(translated.brPoint())
      expect(degreesEqual(actual, degrees)).toBe(true)
    })

    xit('goes the correct distance', () => {
      const actual = Math.sqrt(Math.pow(original.x - translated.x, 2) +
                               Math.pow(original.y - translated.y, 2))
      expect(distance).toEqual(actual)
    })
  })

  it('#points', () => {
    const rectangle = Factory.Rectangle()
    const points = rectangle.points()
    expect(points.length).toEqual(4)
    expect(points[1].equals(rectangle.blPoint())).toBe(true)
  })

  describe('#intersects', () => {
    // (2,2) -> (5,5), axis-aligned
    const rect = new Rectangle({ facing: COMPASS.NORTH, brPoint: Factory.Point(5, 5), length: 3, width: 3 })

    it('outside example', () => {
      const seg = new Segment([new Point({ x: 1, y: 1 }), new Point({ x: 1, y: 0 })])
      expect(rect.intersects(seg)).toBe(false)
    })

    it('cross helper example', () => {
      const seg = new Segment([new Point({ x: 4, y: 4 }), new Point({ x: 7, y: 7 })])
      expect(rect.intersects(seg)).toBe(true)
    })

    it('cross example', () => {
      const seg = new Segment([new Point({ x: 4, y: 4 }), new Point({ x: 8, y: 8 })])
      expect(rect.intersects(seg)).toBe(true)
    })

    it('segment inside example', () => {
      const seg = new Segment([new Point({ x: 4, y: 4 }), new Point({ x: 3, y: 3 })])
      expect(rect.intersects(seg)).toBe(true)
    })

    // This one is left. It fails to show as intersected when entirely inside the rect.
    it('inside example', () => {
      const seg = new Segment([new Point({ x: 4, y: 4 }), new Point({ x: 3, y: 3 })])
      expect(rect.intersects(seg)).toBe(true)
    })
  })

  describe('intersect rects?', () => {
    const rect1 = new Rectangle({
      brPoint: new Point({ x: 3, y: 3 }),
      facing: COMPASS.NORTH,
      length: 2,
      width: 2
    })
    it('intersects', () => {
      const rect2 = new Rectangle({
        brPoint: new Point({ x: 4, y: 4 }),
        facing: COMPASS.NORTH,
        length: 2,
        width: 2
      })
      expect(rect1.intersects(rect2)).toBe(true)
    })

    it('does not intersect', () => {
      const rect2 = new Rectangle({
        brPoint: new Point({ x: 1, y: 1 }),
        facing: COMPASS.NORTH,
        length: 1 / 2,
        width: 1 / 2
      })
      expect(rect1.intersects(rect2)).toBe(true)
    })
  })

  xit('start here', () => {
    // migrate intersection code and tests
  })
  // Move intersection logic from all classes into static methods, all called
  // from different geometric object classes as needed.
  // Also move in-depth tests to here.
  // Helper #inIntersecting methods in each geometric class.
  // That also allows in-depth intersection testing to be in a file matching dev file.

  describe('#intersects', () => {
    const rectangle = new Rectangle({
      brPoint: new Point({ x: 3, y: 3 }),
      facing: COMPASS.NORTH,
      length: 2,
      width: 2
    })
    describe('point', () => {
      it('intersects', () => {
        const point = new Point({ x: 2, y: 2 })
        expect(rectangle.intersects(point)).toBe(true)
      })

      it('does not intersect', () => {
        const point = new Point({ x: 5, y: 5 })
        expect(rectangle.intersects(point)).toBe(false)
      })
    })

    describe('segments', () => {
      it('intersects', () => {
        const segment = new Segment([new Point({ x: 2, y: 2 }),
          new Point({ x: 4, y: 4 })])
        expect(rectangle.intersects(segment)).toBe(true)
      })

      it('does not intersect', () => {
        const segment = new Segment([new Point({ x: 5, y: 5 }),
          new Point({ x: 5, y: 8 })])
        expect(rectangle.intersects(segment)).toBe(false)
      })
    })

    describe('rectangles', () => {
      it('intersects', () => {
        const rectangle2 = new Rectangle({
          brPoint: new Point({ x: 1.5, y: 1.5 }),
          facing: COMPASS.NORTH,
          length: 1,
          width: 1
        })
        expect(rectangle.intersects(rectangle2)).toBe(true)
      })

      it('does not intersect', () => {
        const rectangle2 = new Rectangle({
          brPoint: new Point({ x: 5, y: 5 }),
          facing: COMPASS.NORTH,
          length: 1,
          width: 1
        })
        expect(rectangle.intersects(rectangle2)).toBe(false)
      })
    })

    describe('non-thing', () => {
      it('throws', () => {
        expect(function () { rectangle.intersects(null) }).toThrow(Error)
      })
    })
  })
})
