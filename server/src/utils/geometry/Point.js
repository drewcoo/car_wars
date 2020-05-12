import { degreesToRadians } from '../conversions'
import Intersection from './Intersection'
import Segment from './Segment'

class Point {
  constructor({ x, y }) {
    this.x = x
    this.y = y
  }

  toString() {
    return `(${this.x}, ${this.y})`
  }

  clone() {
    return new Point({ x: this.x, y: this.y })
  }

  toFixed(digits) {
    return new Point({
      x: Number.parseFloat(this.x).toFixed(digits),
      y: Number.parseFloat(this.y).toFixed(digits),
    })
  }

  equals(point2) {
    return (
      this.x.toFixed(2) === point2.x.toFixed(2) &&
      this.y.toFixed(2) === point2.y.toFixed(2)
    )
  }

  degreesTo(point) {
    return (Math.atan2(point.y - this.y, point.x - this.x) * 180) / Math.PI
  }

  distanceTo(point) {
    return Math.sqrt(
      Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2),
    )
  }

  intersects(thing): boolean {
    return this.isIntersecting(thing)
  }

  isIntersecting(thing) {
    if (thing instanceof Point) {
      return (
        Intersection.pointPointExists({ point2: thing, point: this }) || false
      )
    }
    if (thing instanceof Segment) {
      return (
        Intersection.pointSegmentExists({ point: this, segment: thing }) ||
        false
      )
    }
    return (
      Intersection.rectanglePointExists({ rectangle: thing, point: this }) ||
      false
    )
  }

  move({ degrees, radians, distance }) {
    if (radians === undefined && degrees === undefined) {
      throw new Error('MUST pass at least one of degrees or radians')
    }

    const rads = radians || degreesToRadians(degrees || 0)

    return new Point({
      x: this.x + distance * Math.cos(rads),
      y: this.y + distance * Math.sin(rads),
    })
  }

  rotateAround({ fixedPoint, degrees }) {
    const radians =
      degreesToRadians(degrees) +
      Math.atan2(this.y - fixedPoint.y, this.x - fixedPoint.x)
    const dist = fixedPoint.distanceTo(this)
    const newX = Math.cos(radians) * dist + fixedPoint.x
    const newY = Math.sin(radians) * dist + fixedPoint.y
    return new Point({ x: newX, y: newY })
  }
}
export default Point
