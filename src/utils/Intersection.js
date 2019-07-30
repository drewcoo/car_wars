import Point from './Point'
import Rectangle from './Rectangle'
import Segment from './Segment'

class Intersection {
  static exists(thing1, thing2) {
    switch(true) {
      case thing1 instanceof Point:
        switch(true) {
          case thing2 instanceof Point:
            return Intersection.point_point_exists({ point: thing1, point2: thing2 })
          case thing2 instanceof Segment:
            return Intersection.point_segment_exists({ point: thing1, segment: thing2 })
          case thing2 instanceof Rectangle:
            return Intersection.point_rectangle_exists({ point: thing1, rectangle: thing2 })
          default:
            throw new Error (`Checking intersection of unrecognized thing: ${thing2}`)
        }
      case thing1 instanceof Segment:
        switch(true) {
          case thing2 instanceof Point:
            return Intersection.segment_point_exists({ segment: thing1, point: thing2 })
          case thing2 instanceof Segment:
            return Intersection.segment_segment_exists({ segment: thing1, segment2: thing2 })
          case thing2 instanceof Rectangle:
            return Intersection.segment_rectangle_exists({ segment: thing1, rectangle: thing2 })
          default:
            throw new Error (`Checking intersection of unrecognized thing: ${thing2}`)
        }
      case thing1 instanceof Rectangle:
        switch(true) {
          case thing2 instanceof Point:
            return Intersection.rectangle_point_exists({ rectangle: thing1, point: thing2 })
          case thing2 instanceof Segment:
            return Intersection.rectangle_segment_exists({ rectangle: thing1, segment: thing2 })
          case thing2 instanceof Rectangle:
            return Intersection.rectangle_rectangle_exists({ rectangle: thing1, rectangle2: thing2 })
          default:
            throw new Error (`Checking intersection of unrecognized thing: ${thing2}`)
        }
      default:
        throw new Error (`Checking intersection of unrecognized thing1: ${thing1}`)
    }
  }


  static point_point_exists({ point, point2 }) {
    return point.equals(point2);
  }

  static point_rectangle_exists({ point, rectangle }) {
    // Actually, "is at least partially inside" would be mmore apt.
    // If a segment from a vertex to one of its ends crosses the opposite
    // rect sides, it's ouside.
    const segFR = new Segment([rectangle.FR_point(), point])
    const segFL = new Segment([rectangle.FL_point(), point])
    const segBR = new Segment([rectangle.BR_point(), point])
    const segBL = new Segment([rectangle.BL_point(), point])
    const outside = (
      Intersection.segment_segment_exists({ segment: segFR, segment2: rectangle.B_side() }) ||
      Intersection.segment_segment_exists({ segment: segFR, segment2: rectangle.L_side() }) ||
      Intersection.segment_segment_exists({ segment: segFL, segment2: rectangle.B_side() }) ||
      Intersection.segment_segment_exists({ segment: segFL, segment2: rectangle.R_side() }) ||
      Intersection.segment_segment_exists({ segment: segBR, segment2: rectangle.F_side() }) ||
      Intersection.segment_segment_exists({ segment: segBR, segment2: rectangle.L_side() }) ||
      Intersection.segment_segment_exists({ segment: segBL, segment2: rectangle.F_side() }) ||
      Intersection.segment_segment_exists({ segment: segBL, segment2: rectangle.R_side() })
    )
    return !outside
  }

  static point_segment_exists({ point, segment }) {
    const parts = point.distance_to(segment.points[0]) + point.distance_to(segment.points[1])
    return parts.toFixed(2) === segment.length().toFixed(2)
  }

  static rectangle_point_exists({ point, rectangle }) {
    return Intersection.point_rectangle_exists({ point, rectangle })
  }

  static rectangle_rectangle_exists({ rectangle, rectangle2 }) {
    // returns false or skew between facing and a rect side
    // BUGBUG: Does this handle corners?

    // BUGBUG: Doesn't handle overlapping rects with parallel lines
    // incl. exactly overlapping rects!

    // BUGBUG back collisions not handled!
    // Also this is missed up for sidling into things like with bootleggers.
    return (Intersection.segment_rectangle_exists({ rectangle, segment: rectangle2.F_side() }) ||
            Intersection.segment_rectangle_exists({ rectangle, segment: rectangle2.L_side() }) ||
            Intersection.segment_rectangle_exists({ rectangle, segment: rectangle2.B_side() }) ||
            Intersection.segment_rectangle_exists({ rectangle, segment: rectangle2.R_side() }))
  }

  static rectangle_segment_exists({ segment, rectangle }){
    return Intersection.segment_rectangle_exists({ segment, rectangle })
  }

  static segment_point_exists({ segment, point }) {
    return Intersection.point_segment_exists({ point, segment })
  }

  static segment_rectangle_exists({ segment, rectangle }) {
      const sides_intersect_segment = () => {
        return (Intersection.segment_segment_exists({ segment, segment2: rectangle.F_side() }) ||
                Intersection.segment_segment_exists({ segment, segment2: rectangle.R_side() }) ||
                Intersection.segment_segment_exists({ segment, segment2: rectangle.B_side() }) ||
                Intersection.segment_segment_exists({ segment, segment2: rectangle.L_side() }))
      }

      const segment_is_inside_rectangle = () => {
        return (Intersection.point_rectangle_exists({ point: segment.points[0], rectangle }) ||
                Intersection.point_rectangle_exists({ point: segment.points[1], rectangle }) )
      }
      // Also if a segment has both points inside the rect, call it intersecting.
      // We can check just one point.
      //if (this.sides_intersect_segment(segment)) { return true; }
      //return this.segment_is_inside(segment)
      return sides_intersect_segment() || segment_is_inside_rectangle()
  }

  static segment_segment_exists({ segment, segment2 }) {
    // from Stack Overflow - url forgotten
    const copypasta = (a, b, c, d, p, q, r, s) => {
      var det, gamma, lambda
      det = (c - a) * (s - q) - (r - p) * (d - b)
      if (det === 0) { return false }
      lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det
      gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det
      return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1)
    }

    const crosses = () => {
      return copypasta(segment.points[0].x, segment.points[0].y,
                       segment.points[1].x, segment.points[1].y,
                       segment2.points[0].x, segment2.points[0].y,
                       segment2.points[1].x, segment2.points[1].y)
    }

    const touches_or_overlaps = () => {
      return (Intersection.point_segment_exists({ segment, point: segment2.points[0] }) ||
              Intersection.point_segment_exists({ segment, point: segment2.points[1] }) ||
              Intersection.point_segment_exists({ segment: segment2, point: segment.points[0] }) ||
              Intersection.point_segment_exists({ segment: segment2, point: segment.points[1] }))
/*
        segment.contains_point(segment2.points[0]) ||
              segment.contains_point(segment2.points[1]) ||
              segment2.contains_point(segment.points[0]) ||
              segment2.contains_point(segment.points[1]))
              */
    }

    return crosses() || touches_or_overlaps()
  }
}
export default Intersection
