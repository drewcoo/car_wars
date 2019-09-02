import Point from './Point'
import Intersection from './Intersection'
//import {intersect} from 'mathjs'
import { degrees_parallel } from './conversions'

class Segment {
  constructor(points) {
    if (points.length !== 2) {
      throw new Error(`"${points}" is not an array of two elements!`)
    }
    for (var i = 0; i < 2; i ++) {
       if (!(points[i] instanceof Point)) {
         throw new Error(`arg0, "${points[i]}" (${typeof(points[i])}), must be a point!`)
       }
    }
    this.points = points
  }

  toString() {
    return JSON.stringify(this)
  }

  length() {
    return this.points[0].distance_to(this.points[1])
  }

  middle() {
    return new Point({ x: (this.points[0].x + this.points[1].x)/ 2,
                       y: (this.points[0].y + this.points[1].y)/ 2 })
  }

  is_parallel_to(segment2) {
    var dir1 = this.points[0].degrees_to(this.points[1])
    var dir2 = segment2.points[0].degrees_to(segment2.points[1])
    return degrees_parallel(dir1, dir2)
  }

  is_colinear_with(segment2) {
    const third = new Segment([this.points[0], segment2.points[0]])
    return this.is_parallel_to(segment2) && this.is_parallel_to(third)
  }

  equals(segment2) {
    return segment2 instanceof Segment &&
           ( (this.points[0].equals(segment2.points[0]) && this.points[1].equals(segment2.points[1])) ||
             (this.points[0].equals(segment2.points[1]) && this.points[1].equals(segment2.points[0])) )
  }

  intersects(thing) { return this.is_intersecting(thing) }

  is_intersecting(thing) { return Intersection.exists(this, thing) }

  skew(segment2) {
    var this_dir = (this.points[0].degrees_to(this.points[1]) + 360) % 180
    var segment2_dir = (segment2.points[0].degrees_to(segment2.points[1]) + 360) % 180
    return Math.abs(this_dir - segment2_dir)
  }
}
export default Segment
