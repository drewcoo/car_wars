import Point from './Point'
import Intersection from './Intersection'
import { degreesParallel } from '../conversions'

class Segment {
  constructor (points) {
    this.points = points
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
    return degreesParallel(
      this.points[0].degreesTo(this.points[1]),
      segment2.points[0].degreesTo(segment2.points[1])
    )
  }

  isColinearWith (segment2) {
    const third = new Segment([this.points[0], segment2.points[0]])
    return this.isParallelTo(segment2) && this.isParallelTo(third)
  }

  equals (segment2) {
    return ((this.points[0].equals(segment2.points[0]) && this.points[1].equals(segment2.points[1])) ||
            (this.points[0].equals(segment2.points[1]) && this.points[1].equals(segment2.points[0])))
  }

  intersects (thing) { return this.isIntersecting(thing) }

  isIntersecting (thing) { return Intersection.exists(this, thing) }

  skew (segment2) {
    const thisDir = (this.points[0].degreesTo(this.points[1]) + 360) % 180
    const segment2Dir = (segment2.points[0].degreesTo(segment2.points[1]) + 360) % 180
    return Math.abs(thisDir - segment2Dir)
  }
}
export default Segment
