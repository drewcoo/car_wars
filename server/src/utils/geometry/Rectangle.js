import Intersection from './Intersection'
import Point from './Point'
import Segment from './Segment'
import { FACE, INCH } from '../constants'

class Rectangle {
  //
  // TODO: Add this.movementDirection so that I can handle moving in reverse?
  // Or bootleggers?
  //
  // Or does that only apply to vehicles, which have rectangles?
  //
  // bugbug - not ANY
  constructor (rectData) {
    this._brPoint = new Point(rectData._brPoint || rectData.brPoint)
    this.facing = (rectData.facing + 360) % 360
    this.length = rectData.length || INCH
    this.width = rectData.width || INCH / 2
  }

  brPoint () {
    return this._brPoint.clone()
  }

  blPoint () {
    return this._brPoint.move({ degrees: (this.facing + FACE.LEFT), distance: this.width })
  }

  frPoint () {
    return this._brPoint.move({ degrees: (this.facing + FACE.FRONT), distance: this.length })
  }

  flPoint () {
    return this.blPoint().move({ degrees: (this.facing + FACE.FRONT), distance: this.length })
  }

  center () {
    return new Segment([this.flPoint(), this.brPoint()]).middle()
  }

  fSide () {
    return new Segment([this.frPoint(), this.flPoint()])
  }

  bSide () {
    return new Segment([this.brPoint(), this.blPoint()])
  }

  lSide () {
    return new Segment([this.blPoint(), this.flPoint()])
  }

  rSide () {
    return new Segment([this.brPoint(), this.frPoint()])
  }

  flAngle () {
    return this.facing - 30
  }

  frAngle () {
    return this.facing + 30
  }

  blAngle () {
    return this.frAngle() + 180
  }

  brAngle () {
    return this.flAngle() + 180
  }

  equals (rect2) {
    return (
      this.brPoint().equals(rect2.brPoint()) &&
      this.facing === rect2.facing &&
      this.length === rect2.length &&
      this.width === rect2.width
    )
  }

  clone () {
    return new Rectangle({
      brPoint: this.brPoint(),
      facing: this.facing,
      length: this.length,
      width: this.width
    })
  }

  // returns a new rectangle, moved direction and distance from here
  // can make this take direction of movement later
  move ({ degrees, distance }) {
    return new Rectangle({
      brPoint: this._brPoint.move({ degrees, distance }),
      facing: degrees, // || this.facing, //????
      length: this.length,
      width: this.width
    })
  }

  // can make this take direction of movement later
  leftCornerTurn (degrees) {
    const result = this.clone()
    const brp = result.brPoint()
    const blp = result.blPoint()
    result._brPoint = brp.rotateAround({ fixedPoint: blp, degrees: degrees })
    result.facing += degrees
    return result
  }

  // can make this take direction of movement later
  rightCornerTurn (degrees) {
    let result = this.clone()
    result._brPoint = result.brPoint().rotateAround({ fixedPoint: this.brPoint(), degrees })
    result.facing += degrees
    return result
  }

  // TODO: Should I aslo have some kind of drifty, sidling move here? One that
  // can take into account direction of movement?

  intersects (thing) { return this.isIntersecting(thing) }

  isIntersecting (thing) { return Intersection.exists(this, thing) }

  points (): [Point, Point, Point, Point] {
    return [this.brPoint(), this.blPoint(), this.frPoint(), this.flPoint()]
  }

  // abbr is short for abbreviation!
  side (abbr) {
    return this.sides()[abbr]
  }

  sides () {
    return {
      B: this.bSide(),
      F: this.fSide(),
      L: this.lSide(),
      R: this.rSide()
    }
  }

  angleIsBetween (_query, _left, _right) {
    // revisit this - JS mod operator is funky
    let query = _query % 360
    let left = _left % 360
    let right = _right % 360
    // Deal with arc spanning the 0/360 crossover
    if (left < 0) { left += 360 }
    if (right < left) { right += 360 }
    if (query < left) { query += 360 }
    return (left <= query) && (query <= right)
  }

  arcForPoint (point) {
    const direction = this.center().degreesTo(point) % 360
    if (this.angleIsBetween(direction, this.flAngle(), this.frAngle())) {
      return 'F'
    } else if (this.angleIsBetween(direction, this.frAngle(), this.brAngle())) {
      return 'R'
    } else if (this.angleIsBetween(direction, this.brAngle(), this.blAngle())) {
      return 'B'
    } else if (this.angleIsBetween(direction, this.blAngle(), this.flAngle())) {
      return 'L'
    } else {
      // Maybe the point is *in* the car!!!
      throw new Error(`Error: facing ${this.facing} cannot find arc for direction: ${direction}`)
    }
  }

  // BUGBUG: Need to change FRBL to FACE.F and check for type FACE instead
  pointIsInArc ({ point, arcName }) {
    const direction = this.center().degreesTo(point) // + this.facing
    switch (arcName) {
      case 'F':
        return this.angleIsBetween(direction, this.flAngle(), this.frAngle())
      case 'R':
        return this.angleIsBetween(direction, this.frAngle(), this.brAngle())
      case 'B':
        return this.angleIsBetween(direction, this.brAngle(), this.blAngle())
      case 'L':
        return this.angleIsBetween(direction, this.blAngle(), this.flAngle())
      default:
        throw new Error(`unknown arc name: "${arcName}"`)
    }
  }
}
export default Rectangle
