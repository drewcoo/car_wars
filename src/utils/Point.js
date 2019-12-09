import Intersection from './Intersection'
import Rectangle from './Rectangle'
import Segment from './Segment'
import { degreesToRadians } from './conversions'

class Point {
  constructor ({ x, y }) {
    this.x = x
    this.y = y
    if (this.x === undefined || this.y === undefined) {
      throw new Error(`(${this.x}, ${this.y}) - UNDEFINED!!!`)
    }
  }

  toArray () {
    return [this.x, this.y]
  }

  clone () {
    return new Point({ x: this.x, y: this.y })
  }

  toFixed (digits) {
    return new Point({
      x: this.x.toFixed(digits),
      y: this.y.toFixed(digits)
    })
  }

  equals (point2) {
    return point2 instanceof Point &&
           this.x.toFixed(2) === point2.x.toFixed(2) &&
           this.y.toFixed(2) === point2.y.toFixed(2)
  }

  degreesTo (point) {
    return (Math.atan2((point.y - this.y), (point.x - this.x)) * 180 / Math.PI)
  }

  distanceTo (point) {
    return Math.sqrt(Math.pow(this.x - point.x, 2) +
                     Math.pow(this.y - point.y, 2))
  }

  intersects (thing) { return this.isIntersecting(thing) }

  isIntersecting (thing) {
    switch (true) {
      case thing instanceof Point:
        return Intersection.pointPointExists({ point2: thing, point: this })
      case thing instanceof Segment:
        return Intersection.pointSegmentExists({ point: this, segment: thing })
      case thing instanceof Rectangle:
        return Intersection.rectanglePointExists({ rectangle: thing, point: this })
      default:
        throw new Error(`Checking intersection of unrecognized thing: ${thing}`)
    }
  }

  move ({ degrees, radians, distance }) {
    if (degrees != null && radians != null) {
      throw new Error('Can only pass degrees or radians!')
    }
    const rads = radians || degreesToRadians(degrees)
    return new Point({
      x: this.x + distance * Math.cos(rads),
      y: this.y + distance * Math.sin(rads)
    })
  }

  toString () {
    return JSON.stringify(this)
  }

  rotateAround ({ fulcrum, degrees }) {
    const radians = degreesToRadians(degrees) +
                      Math.atan2((this.y - fulcrum.y), (this.x - fulcrum.x))
    const dist = fulcrum.distanceTo(this)
    const newX = Math.cos(radians) * dist + fulcrum.x
    const newY = Math.sin(radians) * dist + fulcrum.y
    return new Point({ x: newX, y: newY })
  }
}
export default Point
