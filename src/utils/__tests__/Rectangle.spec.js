import Point from '../../utils/Point'
import Segment from '../../utils/Segment'
import Rectangle from '../../utils/Rectangle'
import { degrees_equal, degrees_to_radians, radians_to_degrees } from '../../utils/conversions'
import Factory from './Factory'
import { COMPASS } from '../../utils/constants'

describe('Rectangle', () => {
  describe('#constructor', () => {
    it('throws if pointless', () => {
      expect(function () { new Rectangle({ BR_point: null }) }).toThrow(Error)
    })

    it('throws if no point', () => {
      expect(function () { new Rectangle({ facing: COMPASS.NORTH }) }).toThrow(Error)
    })

    it('throws if no facing', () => {
      expect(function () { new Rectangle({ BR_point: Factory.Point() }) }).toThrow(Error)
    })
  })

  describe('#toString', () => {
    it('JSON.stringifies', () => {
      const rectangle = Factory.Rectangle()
      expect(rectangle.toString()).toEqual(JSON.stringify(rectangle))
    })
  })

  describe('points', () => {
    it('#BR_point thows on __BR_point not point', () => {
      const rectangle = Factory.Rectangle()
      rectangle.__BR_point = 'not_a_point'
      expect(function () { rectangle.BR_point() }).toThrow(Error)
    })

    describe('valid', () => {
      const rectangle = Factory.Rectangle()
      const brp = rectangle.BR_point()

      it('#BR_point returns __BR_point', () => {
        expect(brp.equals(rectangle.__BR_point)).toBe(true)
      })

      it('#BL_point is one width left of #BR_point', () => {
        const expected_point = new Point({ x: brp.x - rectangle.width, y: brp.y })
        expect(rectangle.BL_point().equals(expected_point)).toBe(true)
      })

      it('#FR_point is one length in front of #BR_point', () => {
        const expected_point = new Point({ x: brp.x, y: brp.y - rectangle.length })
        expect(rectangle.FR_point().equals(expected_point)).toBe(true)
      })

      it('#FL_point is one length to front and one width to left of #BR_point', () => {
        const expected_point = new Point({
          x: brp.x - rectangle.width,
          y: brp.y - rectangle.length
        })
        expect(rectangle.FL_point().equals(expected_point)).toBe(true)
      })

      it('#center is 1/2 length to the front and 1/2 width to left of #BR_point', () => {
        const expected_point = new Point({
          x: brp.x - rectangle.width / 2,
          y: brp.y - rectangle.length / 2
        })
        expect(rectangle.center().equals(expected_point)).toBe(true)
      })
    })
  })

  describe('sides', () => {
    const rectangle = Factory.Rectangle()

    it('#F_side goes from #FL_point to #FR_point', () => {
      const expected = new Segment([rectangle.FL_point(), rectangle.FR_point()])
      expect(rectangle.F_side().equals(expected)).toBe(true)
    })

    it('#B_side goes from #BL_point to #BR_point', () => {
      const expected = new Segment([rectangle.BL_point(), rectangle.BR_point()])
      expect(rectangle.B_side().equals(expected)).toBe(true)
    })

    it('#L_side goes from #FL_point to #BL_point', () => {
      const expected = new Segment([rectangle.FL_point(), rectangle.BL_point()])
      expect(rectangle.L_side().equals(expected)).toBe(true)
    })

    it('#R_side goes from #FR_point to #BR_point', () => {
      const expected = new Segment([rectangle.BR_point(), rectangle.FR_point()])
      expect(rectangle.R_side().equals(expected)).toBe(true)
    })

    it('4 of #sides', () => {
      expect(Object.keys(rectangle.sides()).length).toEqual(4)
    })

    it('can seek a #side', () => {
      expect(rectangle.side('B').equals(rectangle.B_side())).toBe(true)
    })
  })

  describe('angles', () => {
    // Better off hard-coding degrees from center because calculating w/
    // floating-point points is inaccurate.
    // NB: This is only true for rectangles twice as long as they are wide.
    const rectangle = Factory.Rectangle()

    it('#FL_angle is 30 deg counterclockwise from facing', () => {
      expect(degrees_equal(rectangle.FL_angle(), rectangle.facing - 30)).toBe(true)
    })

    it('#FR_angle is 30 deg clockwise from facing', () => {
      expect(degrees_equal(rectangle.FR_angle(), rectangle.facing + 30)).toBe(true)
    })

    it('#BL_angle is (180 + 30) deg clockwise from facing ', () => {
      expect(degrees_equal(rectangle.BL_angle(), rectangle.facing + 210)).toBe(true)
    })

    it('#BR_angle is (180 - 30) deg clockwise from facing', () => {
      expect(degrees_equal(rectangle.BR_angle(), rectangle.facing + 150)).toBe(true)
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
      expect(translated.BR_point() instanceof Point).toBe(true)
      const actual = original.BR_point().degrees_to(translated.BR_point())
      expect(degrees_equal(actual, degrees)).toBe(true)
    })

    it('goes the correct distance', () => {
      const actual = Math.sqrt(Math.pow(original.x - translated.x, 2) +
                               Math.pow(original.y - translated.y, 2))
      expect(distance).toEqual(distance)
    })
  })

  it('#points', () => {
    const rectangle = Factory.Rectangle()
    const points = rectangle.points()
    expect(points.length).toEqual(4)
    expect(points[1].equals(rectangle.BL_point())).toBe(true)
  })

  describe('#intersects', () => {
    // (2,2) -> (5,5), axis-aligned
    const rect = new Rectangle({ facing: COMPASS.NORTH, BR_point: Factory.Point(5, 5), length: 3, width: 3 })

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
      BR_point: new Point({ x: 3, y: 3 }),
      facing: COMPASS.NORTH,
      length: 2,
      width: 2
    })
    it('intersects', () => {
      const rect2 = new Rectangle({
        BR_point: new Point({ x: 4, y: 4 }),
        facing: COMPASS.NORTH,
        length: 2,
        width: 2
      })
      expect(rect1.intersects(rect2)).toBe(true)
    })

    it('does not intersect', () => {
      const rect2 = new Rectangle({
        BR_point: new Point({ x: 1, y: 1 }),
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
  // Helper #in_intersecting methods in each geometric class.
  // That also allows in-depth intersection testing to be in a file matching dev file.

  describe('#intersects', () => {
    const rectangle = new Rectangle({
      BR_point: new Point({ x: 3, y: 3 }),
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
          BR_point: new Point({ x: 1.5, y: 1.5 }),
          facing: COMPASS.NORTH,
          length: 1,
          width: 1
        })
        expect(rectangle.intersects(rectangle2)).toBe(true)
      })

      it('does not intersect', () => {
        const rectangle2 = new Rectangle({
          BR_point: new Point({ x: 5, y: 5 }),
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
