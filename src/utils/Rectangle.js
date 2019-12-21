import Intersection from './Intersection'
import Point from './Point'
import Segment from './Segment'
import { FACE, INCH } from './constants'

class Rectangle {
  //
  // TODO: Add this.movementDirection so that I can handle moving in reverse?
  // Or bootleggers?
  //
  // Or does that only apply to vehicles, which have rectangles?
  //
  constructor (rectData) {
    if (!(rectData.brPoint instanceof Point)) {
      throw new Error('What is the point?')
    }
    if (rectData.facing === undefined) { throw new Error('facing undefined!') }
    this.__brPoint = rectData.__brPoint || rectData.brPoint
    /*
    if (!(this.__brPoint instanceof Point)) {
      this.__brPoint = new Point(this.__brPoint)
    }
    */
    this.facing = (rectData.facing + 360) % 360
    this.length = rectData.length || INCH
    this.width = rectData.width || INCH / 2
  }

  toString () {
    return JSON.stringify(this)
    /*
    return JSON.stringify({
      __brPoint: this.__brPoint.toString(),
      facing: this.facing,
      length: this.length,
      width: this.width
    })
    */
  }

  brPoint () {
    if (!(this.__brPoint instanceof Point)) { throw new Error('NO BR POINT!') }
    return this.__brPoint.clone()
  }

  blPoint () {
    return this.__brPoint.move({ degrees: (this.facing + FACE.LEFT), distance: this.width })
  }

  frPoint () {
    return this.__brPoint.move({ degrees: (this.facing + FACE.FRONT), distance: this.length })
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
      rect2 instanceof Rectangle &&
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
      brPoint: this.__brPoint.move({ degrees, distance }),
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
    result.__brPoint = brp.rotateAround({ fulcrum: blp, degrees: degrees })
    result.facing += degrees
    return result
  }

  // can make this take direction of movement later
  rightCornerTurn (degrees) {
    var result = this.clone()
    result.__brPoint = result.brPoint().rotateAround({ fulcrum: this.brPoint(), degrees })
    result.facing += degrees
    return result
  }

  // TODO: Should I aslo have some kind of drifty, sidling move here? One that
  // can take into account direction of movement?

  intersects (thing) { return this.isIntersecting(thing) }

  isIntersecting (thing) { return Intersection.exists(this, thing) }

  points () {
    return [this.brPoint(), this.blPoint(), this.frPoint(), this.flPoint()]
  }

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

  angleDelta (__query, _Left, _Right) {
    // revisit this - JS mod operator is funky
    var query = __query % 360
    var left = _Left % 360
    var right = _Right % 360
    // Deal with arc spanning the 0/360 crossover
    if (left < 0) { left += 360 }
    if (right < left) { right += 360 }
    if (query < left) { query += 360 }
    return (left <= query) && (query <= right)
  }

  arcForPoint (point) {
    var direction = this.center().degreesTo(point) % 360
    if (this.angleDelta(direction, this.flAngle(), this.frAngle())) {
      return 'F'
    } else if (this.angleDelta(direction, this.frAngle(), this.brAngle())) {
      return 'R'
    } else if (this.angleDelta(direction, this.brAngle(), this.blAngle())) {
      return 'B'
    } else if (this.angleDelta(direction, this.blAngle(), this.flAngle())) {
      return 'L'
    } else {
      throw new Error(`Error: facing ${this.facing} cannot find arc for direction: ${direction}`)
    }
  }

  pointIsInArc ({ point, arcName }) {
    var direction = this.center().degreesTo(point) // + this.facing
    switch (arcName) {
      case 'F':
        return this.angleDelta(direction, this.flAngle(), this.frAngle())
      case 'R':
        return this.angleDelta(direction, this.frAngle(), this.brAngle())
      case 'B':
        return this.angleDelta(direction, this.brAngle(), this.blAngle())
      case 'L':
        return this.angleDelta(direction, this.blAngle(), this.flAngle())
      default:
        throw new Error(`unknown arc name: "${arcName}"`)
    }
  }
}
export default Rectangle
