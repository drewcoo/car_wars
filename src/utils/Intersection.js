import Point from './Point'
import Rectangle from './Rectangle'
import Segment from './Segment'

class Intersection {
  static exists (thing1, thing2) {
    switch (true) {
      case thing1 instanceof Point:
        switch (true) {
          case thing2 instanceof Point:
            return Intersection.pointPointExists({ point: thing1, point2: thing2 })
          case thing2 instanceof Segment:
            return Intersection.pointSegmentExists({ point: thing1, segment: thing2 })
          case thing2 instanceof Rectangle:
            return Intersection.pointRectangleExists({ point: thing1, rectangle: thing2 })
          default:
            throw new Error(`Checking intersection of unrecognized thing: ${thing2}`)
        }
      case thing1 instanceof Segment:
        switch (true) {
          case thing2 instanceof Point:
            return Intersection.segmentPointExists({ segment: thing1, point: thing2 })
          case thing2 instanceof Segment:
            return Intersection.segmentSegmentExists({ segment: thing1, segment2: thing2 })
          case thing2 instanceof Rectangle:
            return Intersection.segmentRectangleExists({ segment: thing1, rectangle: thing2 })
          default:
            throw new Error(`Checking intersection of unrecognized thing: ${thing2}`)
        }
      case thing1 instanceof Rectangle:
        switch (true) {
          case thing2 instanceof Point:
            return Intersection.rectanglePointExists({ rectangle: thing1, point: thing2 })
          case thing2 instanceof Segment:
            return Intersection.rectangleSegmentExists({ rectangle: thing1, segment: thing2 })
          case thing2 instanceof Rectangle:
            return Intersection.rectangleRectangleExists({ rectangle: thing1, rectangle2: thing2 })
          default:
            throw new Error(`Checking intersection of unrecognized thing: ${thing2}`)
        }
      default:
        throw new Error(`Checking intersection of unrecognized thing1: ${thing1}`)
    }
  }

  static pointPointExists ({ point, point2 }) {
    return point.equals(point2)
  }

  static pointRectangleExists ({ point, rectangle }) {
    // Actually, "is at least partially inside" would be mmore apt.
    // If a segment from a vertex to one of its ends crosses the opposite
    // rect sides, it's ouside.
    const segFR = new Segment([rectangle.frPoint(), point])
    const segFL = new Segment([rectangle.flPoint(), point])
    const segBR = new Segment([rectangle.brPoint(), point])
    const segBL = new Segment([rectangle.blPoint(), point])
    const outside = (
      Intersection.segmentSegmentExists({ segment: segFR, segment2: rectangle.bSide() }) ||
      Intersection.segmentSegmentExists({ segment: segFR, segment2: rectangle.lSide() }) ||
      Intersection.segmentSegmentExists({ segment: segFL, segment2: rectangle.bSide() }) ||
      Intersection.segmentSegmentExists({ segment: segFL, segment2: rectangle.rSide() }) ||
      Intersection.segmentSegmentExists({ segment: segBR, segment2: rectangle.fSide() }) ||
      Intersection.segmentSegmentExists({ segment: segBR, segment2: rectangle.lSide() }) ||
      Intersection.segmentSegmentExists({ segment: segBL, segment2: rectangle.fSide() }) ||
      Intersection.segmentSegmentExists({ segment: segBL, segment2: rectangle.rSide() })
    )
    return !outside
  }

  static pointSegmentExists ({ point, segment }) {
    const parts = point.distanceTo(segment.points[0]) + point.distanceTo(segment.points[1])
    return parts.toFixed(2) === segment.length().toFixed(2)
  }

  static rectanglePointExists ({ point, rectangle }) {
    return Intersection.pointRectangleExists({ point, rectangle })
  }

  static rectangleRectangleExists ({ rectangle, rectangle2 }) {
    // returns false or skew between facing and a rect side
    // BUGBUG: Does this handle corners?

    // BUGBUG: Doesn't handle overlapping rects with parallel lines
    // incl. exactly overlapping rects!

    // BUGBUG back collisions not handled!
    // Also this is missed up for sidling into things like with bootleggers.
    return (Intersection.segmentRectangleExists({ rectangle, segment: rectangle2.fSide() }) ||
            Intersection.segmentRectangleExists({ rectangle, segment: rectangle2.lSide() }) ||
            Intersection.segmentRectangleExists({ rectangle, segment: rectangle2.bSide() }) ||
            Intersection.segmentRectangleExists({ rectangle, segment: rectangle2.rSide() }))
  }

  static rectangleSegmentExists ({ segment, rectangle }) {
    return Intersection.segmentRectangleExists({ segment, rectangle })
  }

  static segmentPointExists ({ segment, point }) {
    return Intersection.pointSegmentExists({ point, segment })
  }

  static segmentRectangleExists ({ segment, rectangle }) {
    const sidesIntersectSegment = () => {
      return (Intersection.segmentSegmentExists({ segment, segment2: rectangle.fSide() }) ||
                Intersection.segmentSegmentExists({ segment, segment2: rectangle.rSide() }) ||
                Intersection.segmentSegmentExists({ segment, segment2: rectangle.bSide() }) ||
                Intersection.segmentSegmentExists({ segment, segment2: rectangle.lSide() }))
    }

    const segmentIsInsideRectangle = () => {
      return (Intersection.pointRectangleExists({ point: segment.points[0], rectangle }) ||
                Intersection.pointRectangleExists({ point: segment.points[1], rectangle }))
    }
    // Also if a segment has both points inside the rect, call it intersecting.
    // We can check just one point.
    // if (this.sidesIntersectSegment(segment)) { return true; }
    // return this.segmentIsInside(segment)
    return sidesIntersectSegment() || segmentIsInsideRectangle()
  }

  static segmentSegmentExists ({ segment, segment2 }) {
    // from Stack Overflow - url forgotten
    const copypasta = (a, b, c, d, p, q, r, s) => {
      var det, gamma, lambda
      det = (c - a) * (s - q) - (r - p) * (d - b)
      if (det === 0) { return false }
      lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det
      gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det
      return (lambda > 0 && lambda < 1) && (gamma > 0 && gamma < 1)
    }

    const crosses = () => {
      return copypasta(segment.points[0].x, segment.points[0].y,
        segment.points[1].x, segment.points[1].y,
        segment2.points[0].x, segment2.points[0].y,
        segment2.points[1].x, segment2.points[1].y)
    }

    const touchesOrOverlaps = () => {
      return (Intersection.pointSegmentExists({ segment, point: segment2.points[0] }) ||
              Intersection.pointSegmentExists({ segment, point: segment2.points[1] }) ||
              Intersection.pointSegmentExists({ segment: segment2, point: segment.points[0] }) ||
              Intersection.pointSegmentExists({ segment: segment2, point: segment.points[1] }))
      /*
        segment.containsPoint(segment2.points[0]) ||
              segment.containsPoint(segment2.points[1]) ||
              segment2.containsPoint(segment.points[0]) ||
              segment2.containsPoint(segment.points[1]))
              */
    }

    return crosses() || touchesOrOverlaps()
  }
}
export default Intersection
