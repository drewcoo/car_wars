import { COMPASS } from '../../constants'
/* eslint-disable-next-line no-unused-vars */
import { degreesEqual } from '../../jestMatchers'
import Point from '../Point'
import GeometryFactory from './GeometryFactory'

describe('Point', () => {
  describe('#rotateAround', () => {
    it('can rotate 90 degrees clockwise around a point', () => {
      const init = new Point({ x: 2, y: 1 })
      const fixedPoint = new Point({ x: 1, y: 1 })
      const result = init.rotateAround({ fixedPoint: fixedPoint, degrees: 90 })
      expect(result.x).toEqual(1)
      expect(result.y).toEqual(2)
    })

    it('can rotate 90 degrees counterclockwise around a point', () => {
      const init = new Point({ x: 1, y: 2 })
      const fixedPoint = new Point({ x: 1, y: 1 })
      const result = init.rotateAround({ fixedPoint: fixedPoint, degrees: -90 })
      const expected = new Point({ x: 2, y: 1 })
      expect(result.equals(expected)).toBe(true)
    })
  })

  it('#toString', () => {
    const point = new Point({ x: 1, y: 2 })
    expect(point.toString()).toEqual('(1, 2)')
  })

  describe('#clone', () => {
    it('works', () => {
      const point = GeometryFactory.point()
      expect(point.clone().equals(point)).toBe(true)
    })
  })

  it('#toFixed', () => {
    const initial = GeometryFactory.point()
    const digits = 2
    const fixed = initial.toFixed(digits)
    expect(initial.x.toFixed(digits)).toEqual(fixed.x)
    expect(initial.y.toFixed(digits)).toEqual(fixed.y)
  })

  describe('#degreesTo', () => {
    it('returns degrees to NORTH', () => {
      const p1 = new Point({ x: 3, y: 3 })
      const p2 = new Point({ x: 3, y: 0 })
      expect(p1.degreesTo(p2)).degreesEqual(COMPASS.NORTH)
    })

    it('returns degrees to WEST', () => {
      const p1 = new Point({ x: 3, y: 3 })
      const p2 = new Point({ x: 0, y: 3 })
      expect(p1.degreesTo(p2)).degreesEqual(COMPASS.WEST)
    })
  })

  describe('#intersects', () => {
    describe('with point', () => {
      const otherPoint = new Point({ x: 3, y: 3 })

      it('intersects if same', () => {
        const thePoint = new Point({ x: 3, y: 3 })
        expect(thePoint.intersects(otherPoint)).toBe(true)
      })

      it('does not intersect if different', () => {
        const thePoint = new Point({ x: 3, y: 2 })
        expect(thePoint.intersects(otherPoint)).toBe(false)
      })
    })

    describe('with segment', () => {
      const segment = GeometryFactory.segment()

      it('intersects if end of segment', () => {
        const thePoint = segment.points[0]
        expect(thePoint.intersects(segment)).toBe(true)
      })

      it('intersects if in middle of segment', () => {
        const thePoint = segment.middle()
        expect(thePoint.intersects(segment)).toBe(true)
      })

      describe('does not intersect', () => {
        // colinear not on segment
        const thePoint = new Point({
          x: segment.points[0].x + segment.points[1].x,
          y: segment.points[0].y + segment.points[1].y,
        })

        it('does not intersect if colinear but not on segment', () => {
          expect(thePoint.intersects(segment)).toBe(false)
        })

        it('does not intersect if not colinear', () => {
          if (segment.points[0].y === segment.points[1].y) {
            thePoint.y += 1
          } else {
            thePoint.x += 1
          }
          expect(thePoint.intersects(segment)).toBe(false)
        })
      })
    })

    describe('with rectangle', () => {
      const rectangle = GeometryFactory.rectangle({})

      it('intersects if in center', () => {
        expect(rectangle.center().intersects(rectangle)).toBe(true)
      })

      it.skip('intersects other ways', () => {})
      it.skip('does not intesrsect', () => {})
    })
  })

  describe('#move', () => {
    const point = GeometryFactory.point()

    it('can move point NORTH 3', () => {
      const moved = point.move({ degrees: COMPASS.NORTH, distance: 3 })
      const expected = new Point({ x: point.x, y: point.y - 3 })
      expect(moved.equals(expected)).toBe(true)
    })

    it('can move point WEST 3', () => {
      const moved = point.move({ degrees: COMPASS.WEST, distance: 3 })
      const expected = new Point({ x: point.x - 3, y: point.y })
      expect(moved.equals(expected)).toBe(true)
    })

    it('must pass direction in radians or degrees', () => {
      expect(() => point.move({ distance: 2 })).toThrow()
    })
  })
})
