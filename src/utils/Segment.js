import Point from './Point'
import Intersection from './Intersection'
import { degreesParallel } from './conversions'

class Segment {
  constructor (points) {
    if (points.length !== 2) {
      throw new Error(`"${points}" is not an array of two elements!`)
    }
    for (var i = 0; i < 2; i++) {
      if (!(points[i] instanceof Point)) {
        throw new Error(`arg0, "${points[i]}" (${typeof (points[i])}), must be a point!`)
      }
    }
    this.points = points
  }

  toString () {
    return JSON.stringify(this)
  }

  length () {
    return this.points[0].distanceTo(this.points[1])
  }

  middle () {
    return new Point({
      x: (this.points[0].x + this.points[1].x) / 2,
      y: (this.points[0].y + this.points[1].y) / 2
    })
  }

  isParallelTo (segment2) {
    var dir1 = this.points[0].degreesTo(this.points[1])
    var dir2 = segment2.points[0].degreesTo(segment2.points[1])
    return degreesParallel(dir1, dir2)
  }

  isColinearWith (segment2) {
    const third = new Segment([this.points[0], segment2.points[0]])
    return this.isParallelTo(segment2) && this.isParallelTo(third)
  }

  equals (segment2) {
    return segment2 instanceof Segment &&
           ((this.points[0].equals(segment2.points[0]) && this.points[1].equals(segment2.points[1])) ||
             (this.points[0].equals(segment2.points[1]) && this.points[1].equals(segment2.points[0])))
  }

  intersects (thing) { return this.isIntersecting(thing) }

  isIntersecting (thing) { return Intersection.exists(this, thing) }

  skew (segment2) {
    var thisDir = (this.points[0].degreesTo(this.points[1]) + 360) % 180
    var segment2Dir = (segment2.points[0].degreesTo(segment2.points[1]) + 360) % 180
    return Math.abs(thisDir - segment2Dir)
  }
}
export default Segment
