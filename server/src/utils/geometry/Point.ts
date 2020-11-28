import { degreesToRadians } from '../conversions'
import Intersection from './Intersection'
import Segment from './Segment'
import Rectangle from './Rectangle'

class Point {
  x: number
  y: number

  constructor({ x, y }: { x: number; y: number }) {
    this.x = x
    this.y = y
  }

  toString(): string {
    return `(${this.x}, ${this.y})`
  }

  clone(): Point {
    return new Point({ x: this.x, y: this.y })
  }

  toFixed(digits: number): Point {
    return new Point({
      x: Number.parseFloat(this.x.toFixed(digits)),
      y: Number.parseFloat(this.y.toFixed(digits)),
    })
  }

  equals(point2: Point): boolean {
    return this.x.toFixed(2) === point2.x.toFixed(2) && this.y.toFixed(2) === point2.y.toFixed(2)
  }

  degreesTo(point: Point): number {
    return (Math.atan2(point.y - this.y, point.x - this.x) * 180) / Math.PI
  }

  distanceTo(point: Point): number {
    return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2))
  }

  intersects(thing: Point | Segment | Rectangle): boolean {
    return this.isIntersecting(thing)
  }

  isIntersecting(thing: Point | Segment | Rectangle): boolean {
    if (thing instanceof Point) {
      return Intersection.pointPointExists({ point2: thing, point: this }) || false
    }
    if (thing instanceof Segment) {
      return Intersection.pointSegmentExists({ point: this, segment: thing }) || false
    }
    return Intersection.rectanglePointExists({ rectangle: thing, point: this }) || false
  }

  move({ degrees, radians, distance }: { degrees?: number; radians?: number; distance: number }): Point {
    /*
    if (!radians && !degrees) {
      throw new Error('MUST pass at least one of degrees or radians')
    }
*/
    const rads = radians || degreesToRadians(degrees || 0)

    return new Point({
      x: this.x + distance * Math.cos(rads),
      y: this.y + distance * Math.sin(rads),
    })
  }

  rotateAround({ fixedPoint, degrees }: { fixedPoint: Point; degrees: number }): Point {
    const radians = degreesToRadians(degrees) + Math.atan2(this.y - fixedPoint.y, this.x - fixedPoint.x)
    const dist = fixedPoint.distanceTo(this)
    const newX = Math.cos(radians) * dist + fixedPoint.x
    const newY = Math.sin(radians) * dist + fixedPoint.y
    return new Point({ x: newX, y: newY })
  }
}
export default Point
