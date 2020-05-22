import Intersection from './Intersection'
import Point from './Point'
import Segment from './Segment'
import { FACE, INCH } from '../constants'

enum SideStrings {
  B = 'B',
  F = 'F',
  L = 'L',
  R = 'R',
}

interface Sides {
  B: Segment
  F: Segment
  L: Segment
  R: Segment
}

interface Corners {
  FL: Point
  FR: Point
  BL: Point
  BR: Point
}

class Rectangle {
  _brPoint: Point
  facing: number
  length: number
  width: number

  //
  // TODO: Add this.movementDirection so that I can handle moving in reverse?
  // Or bootleggers?
  //
  // Or does that only apply to vehicles, which have rectangles?
  //
  // bugbug - not ANY
  constructor({ _brPoint, facing, length = INCH, width = INCH/2 }: { _brPoint: Point, facing: number, length?: number, width?: number }) {
    this._brPoint = new Point(_brPoint)
    this.facing = (facing + 360) % 360
    this.length = length
    this.width = width
  }

  hello(): string {
    return 'hello'
  }

  brPoint(): Point {
    return this._brPoint.clone()
  }

  blPoint(): Point {
    return this._brPoint.move({
      degrees: this.facing + FACE.LEFT,
      distance: this.width,
    })
  }

  frPoint(): Point {
    return this._brPoint.move({
      degrees: this.facing + FACE.FRONT,
      distance: this.length,
    })
  }

  flPoint(): Point {
    return this.blPoint().move({
      degrees: this.facing + FACE.FRONT,
      distance: this.length,
    })
  }

  center(): Point {
    return new Segment([this.flPoint(), this.brPoint()]).middle()
  }

  fSide(): Segment {
    return new Segment([this.frPoint(), this.flPoint()])
  }

  bSide(): Segment {
    return new Segment([this.brPoint(), this.blPoint()])
  }

  lSide(): Segment {
    return new Segment([this.blPoint(), this.flPoint()])
  }

  rSide(): Segment {
    return new Segment([this.brPoint(), this.frPoint()])
  }

  flAngle(): number {
    return this.facing - 30
  }

  frAngle(): number {
    return this.facing + 30
  }

  blAngle(): number {
    return this.frAngle() + 180
  }

  brAngle(): number {
    return this.flAngle() + 180
  }

  equals(rect2: Rectangle): boolean {
    return (
      this.brPoint().equals(rect2.brPoint()) &&
      this.facing === rect2.facing &&
      this.length === rect2.length &&
      this.width === rect2.width
    )
  }

  clone(): Rectangle {
    return new Rectangle({
      _brPoint: new Point({ x: this.brPoint().x, y: this.brPoint().y }),
      facing: this.facing,
      length: this.length,
      width: this.width,
    })
  }

  // returns a new rectangle, moved direction and distance from here
  // can make this take direction of movement later
  move({ degrees, distance, slide = false }: { degrees: number, distance: number, slide?: boolean }): Rectangle {
    const result = new Rectangle({
      _brPoint: this.brPoint().move({ degrees, distance }),
      facing: slide ? this.facing : degrees,
      length: this.length,
      width: this.width,
    })
    return result
  }

  // can make this take direction of movement later
  backLeftCornerPivot(degrees: number): Rectangle {
    const blp = this.blPoint()
    return new Rectangle({
      _brPoint: this.brPoint().rotateAround({ fixedPoint: blp, degrees: degrees }),
      facing: this.facing += degrees,
      length: this.length,
      width: this.width,
    })
  }

  // can make this take direction of movement later
  backRightCornerPivot(degrees: number): Rectangle {
    const result = this.clone()
    result._brPoint = result.brPoint().rotateAround({ fixedPoint: this.brPoint(), degrees })
    result.facing += degrees
    return result
  }

  // can make this take direction of movement later
  frontLeftCornerPivot(degrees: number): Rectangle {
    const result = this.clone()
    const flp = result.flPoint()
    result._brPoint = result.brPoint().rotateAround({ fixedPoint: flp, degrees: degrees })
    result.facing += degrees
    return result
  }

  // can make this take direction of movement later
  frontRightCornerPivot(degrees: number): Rectangle {
    const result = this.clone()
    result._brPoint = result.brPoint().rotateAround({ fixedPoint: this.frPoint(), degrees })
    result.facing += degrees
    return result
  }

  // TODO: Should I aslo have some kind of drifty, sidling move here? One that
  // can take into account direction of movement?

  intersects(thing: (Point | Segment | Rectangle)): boolean {
    return this.isIntersecting(thing)
  }

  isIntersecting(thing: (Point | Segment | Rectangle)): boolean {
    return Intersection.exists(this, thing)
  }

  points(): Point[] {
    return [this.brPoint(), this.blPoint(), this.frPoint(), this.flPoint()]
  }

  // abbr is short for abbreviation!
  side(abbr: SideStrings): Segment {
    return this.sides()[abbr]
  }

  sides(): Sides {
    return {
      'B': this.bSide(),
      'F': this.fSide(),
      'L': this.lSide(),
      'R': this.rSide(),
    }
  }

  corners(): Corners {
    return {
      'FL': this.flPoint(),
      'FR': this.frPoint(),
      'BL': this.blPoint(),
      'BR': this.brPoint(),
    }
  }

  angleIsBetween(_query: number, _left: number, _right: number): boolean {
    // revisit this - JS mod operator is funky
    let max = ((_right - _left) % 360) - 720
    while (max < 0) {
      max += 360
    }

    let query = ((_query - _left) % 360) - 720
    while (query < 0) {
      query += 360
    }

    return query < max
  }

  arcForPoint(point: Point): string {
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
  pointIsInArc({ point, arcName }: { point: Point, arcName: string }): boolean {
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
