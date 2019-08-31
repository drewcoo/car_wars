import Intersection from './Intersection'
import Rectangle from './Rectangle'
import Segment from './Segment'
import { degrees_to_radians } from './conversions'

class Point {
  constructor({ x, y }) {
    this.x = x
    this.y = y
    if (this.x === undefined || this.y === undefined) {
      throw new Error(`(${this.x}, ${this.y}) - UNDEFINED!!!`)
    }
  }

  to_array() {
    return [this.x, this.y]
  }

  clone() {
    return new Point({x: this.x, y: this.y})
  }

  toFixed(digits) {
    return new Point({ x: this.x.toFixed(digits),
                       y: this.y.toFixed(digits) })
  }

  equals(point2) {
    return point2 instanceof Point &&
           this.x.toFixed(2) === point2.x.toFixed(2) &&
           this.y.toFixed(2) === point2.y.toFixed(2)
  }

  degrees_to(point) {
    return (Math.atan2((point.y - this.y), (point.x - this.x)) * 180 / Math.PI)
  }

  distance_to(point) {
    return Math.sqrt(Math.pow(this.x - point.x, 2) +
                     Math.pow(this.y - point.y, 2))
  }

  intersects(thing) { return this.is_intersecting(thing) }

  is_intersecting(thing) {
    switch(true) {
      case thing instanceof Point:
        return Intersection.point_point_exists({ point2: thing, point: this })
      case thing instanceof Segment:
        return Intersection.point_segment_exists({ point: this, segment: thing })
      case thing instanceof Rectangle:
        return Intersection.rectangle_point_exists({ rectangle: thing, point: this })
      default:
        throw new Error (`Checking intersection of unrecognized thing: ${thing}`)
    }
  }

  move({ degrees, radians, distance }) {
    if (degrees != null && radians != null) {
      throw new Error('Can only pass degrees or radians!')
    }
    const rads = radians || degrees_to_radians(degrees)
    return new Point({ x: this.x + distance * Math.cos(rads),
                       y: this.y + distance * Math.sin(rads) })
  }

  toString() {
    return JSON.stringify(this)
  }

  rotate_around({ fulcrum, degrees }) {
    let radians = degrees_to_radians(degrees) +
                      Math.atan2((this.y - fulcrum.y), (this.x - fulcrum.x))
    let dist = fulcrum.distance_to(this)
    let new_x = Math.cos(radians) * dist + fulcrum.x
    let new_y = Math.sin(radians) * dist + fulcrum.y
    return new Point({ x: new_x, y: new_y })
  }
}
export default Point
