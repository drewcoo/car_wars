import Point from '../Point'
import Segment from '../Segment'
import Factory from './Factory'

describe('Segment', () => {
  describe('#length', () => {
    it('is distance between points', () => {
      const segment = Factory.Segment()
      expect(segment.length()).toEqual(segment.points[0].distanceTo(segment.points[1]))
    })
  })

  describe('#isParallelTo', () => {
    it('vertical lines are parallel', () => {
      expect(Factory.Segment('vertical').isParallelTo(Factory.Segment('vertical'))).toBe(true)
    })

    it('horizontal lines are parallel', () => {
      expect(Factory.Segment('horizontal').isParallelTo(Factory.Segment('horizontal'))).toBe(true)
    })
  })

  describe('#isColinearWith', () => {
    it('is vertical colinear', () => {
      const seg1 = Factory.Segment('vertical')
      const seg2 = Factory.Segment('vertical')
      seg2.points[0].x = seg1.points[1].x
      seg2.points[1].x = seg1.points[1].x
      expect(seg1.isColinearWith(seg2)).toBe(true)
    })
  })

  describe('#intersects', () => {
    const segment = new Segment([new Point({ x: 3, y: 3 }),
      new Point({ x: 3, y: 6 })])

    describe('is colinear', () => {
      it('does not intersect', () => {
        const comparison = new Segment([new Point({ x: 3, y: 9 }),
          new Point({ x: 3, y: 7 })])
        expect(segment.intersects(comparison)).toBe(false)
      })

      it('shares one vertex', () => {
        const comparison = new Segment([new Point({ x: 3, y: 9 }),
          new Point({ x: 3, y: 6 })])
        expect(segment.intersects(comparison)).toBe(true)
      })

      it('horizontal - also shares one vertex', () => {
        const segment2 = new Segment([new Point({ x: 3, y: 3 }),
          new Point({ x: 6, y: 3 })])
        const comparison = new Segment([new Point({ x: 9, y: 3 }),
          new Point({ x: 4, y: 3 })])
        const intersection = segment2.intersects(comparison)
        expect(intersection).toBe(true)
      })

      it('overlaps, more than one point', () => {
        const comparison = new Segment([new Point({ x: 3, y: 9 }),
          new Point({ x: 3, y: 5 })])
        expect(segment.intersects(comparison)).toBe(true)
      })

      it('shares both vertices', () => {
        const comparison = new Segment([new Point({ x: 3, y: 6 }),
          new Point({ x: 3, y: 3 })])
        expect(segment.intersects(comparison)).toBe(true)
      })

      it('second eclipsed by first', () => {
        const comparison = new Segment([new Point({ x: 3, y: 5 }),
          new Point({ x: 3, y: 4 })])
        expect(segment.intersects(comparison)).toBe(true)
      })

      it('first eclipsed by second', () => {
        const comparison = new Segment([new Point({ x: 3, y: 0 }),
          new Point({ x: 3, y: 9 })])
        expect(segment.intersects(comparison)).toBe(true)
      })
    })

    describe('is not colinear', () => {
      it('is parallel', () => {
        const comparison = new Segment([new Point({ x: 4, y: 3 }),
          new Point({ x: 4, y: 6 })])
        expect(segment.intersects(comparison)).toBe(false)
      })

      it('shares a vertex', () => {
        const comparison = new Segment([new Point({ x: 3, y: 6 }),
          new Point({ x: 6, y: 4 })])
        expect(segment.intersects(comparison)).toBe(true)
      })

      it('one has a vertex in the middle of the other', () => {
        const comparison = new Segment([new Point({ x: 3, y: 4 }),
          new Point({ x: 6, y: 4 })])
        expect(segment.intersects(comparison)).toBe(true)
      })

      it('crosses in the middles', () => {
        const comparison = new Segment([new Point({ x: 1, y: 4 }),
          new Point({ x: 6, y: 4 })])
        expect(segment.intersects(comparison)).toBe(true)
      })

      it('does not cross', () => {
        const comparison = new Segment([new Point({ x: 1, y: 2 }),
          new Point({ x: 2, y: 6 })])
        expect(segment.intersects(comparison)).toBe(false)
      })
    })
  })

  describe('#skew', () => {
    it('both vertical', () => {
      const seg1 = Factory.Segment('vertical')
      const seg2 = Factory.Segment('vertical')
      expect(seg1.skew(seg2)).toEqual(0)
    })

    it('both horizontal', () => {
      const seg1 = Factory.Segment('horizontal')
      const seg2 = Factory.Segment('horizontal')
      expect(seg1.skew(seg2)).toEqual(0)
    })

    it('the crossed', () => {
      const seg1 = Factory.Segment('vertical')
      const seg2 = Factory.Segment('horizontal')
      expect(seg1.skew(seg2)).toEqual(90)
    })
  })

  describe('#touchesOrOverlaps', () => {
    it('one', () => {
      const seg = Factory.Segment()
      const pt = new Point({
        x: (seg.points[0].x + seg.points[1].x) / 2,
        y: (seg.points[0].y + seg.points[1].y) / 2
      })
      // expect(`${seg} + ${pt}`).toEqual('  ')
      expect(seg.intersects(pt)).toBe(true)
    })

    it('two', () => {
      const p1 = new Point({ x: 4, y: 4 })
      const p2 = new Point({ x: 7, y: 7 })
      const seg = new Segment([p1, p2])
      const pt = new Point({ x: 5, y: 5 })
      expect(seg.intersects(pt)).toBe(true)
    })
  })
})
