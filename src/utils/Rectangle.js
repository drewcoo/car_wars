import Point from './Point';
import Segment from './Segment';
import { FACE, INCH } from './constants';
import { degrees_to_radians } from './conversions';

class Rectangle {
  //
  // TODO: Add this.movement_direction so that I can handle moving in reverse?
  // Or bootleggers?
  //
  // Or does that only apply to vehicles, which have rectangles?
  //
  constructor(rect_data) {
    if (rect_data.BR_point === undefined) {
        throw new Error(`(${rect_data.BR_point.x}, ${rect_data.BR_point.y}) - UNDEFINED!!!`);
    }
    if (rect_data.facing === undefined) { throw new Error(`facing undefined!`); }
    this.__BR_point = rect_data.__BR_point || rect_data.BR_point;
    this.facing = (rect_data.facing + 360) % 360;
    this.length = rect_data.length || INCH;
    this.width = rect_data.width || INCH/2 ;
  }

  toString() {
    return JSON.stringify(this);
  }

  BR_point() {
    if (!this.__BR_point) {  throw new Error(`NO BR POINT!`); }
    return this.__BR_point.clone();
  }

  BL_point() {
    return this.__BR_point.move((this.facing + FACE.LEFT), this.width);
  }

  FR_point() {
    return this.__BR_point.move((this.facing + FACE.FRONT), this.length);
  }

  FL_point() {
    return this.BL_point().move((this.facing + FACE.FRONT), this.length);
  }

  center() {
    return new Segment([this.FL_point(), this.BR_point()]).middle();
  }

  F_side() {
    return new Segment([this.FR_point(), this.FL_point()]);
  }

  B_side() {
    return new Segment([this.BR_point(), this.BL_point()]);
  }

  L_side() {
    return new Segment([this.BL_point(), this.FL_point()]);
  }

  R_side() {
    return new Segment([this.BR_point(), this.FR_point()]);
  }

  FL_angle() {
    return this.facing - 30;
  }

  FR_angle() {
    return this.facing + 30;
  }

  BL_angle() {
    return this.FR_angle() + 180;
  }

  BR_angle() {
    return this.FL_angle() + 180;
  }

  equals(rect2) {
    return (
      this.BR_point().equals(rect2.BR_point()) &&
      this.facing === rect2.facing &&
      this.length === rect2.length &&
      this.width  === rect2.width
    );
  }

  clone() {
    return new Rectangle({ BR_point: this.BR_point(),
                           facing:   this.facing,
                           length:   this.length,
                           width:    this.width });
  }

  // returns a new rectangle, moved direction and distance from here
  // can make this take direction of movement later
  move({ direction, distance }) {
    const radians = degrees_to_radians(direction);
    return new Rectangle({ facing: direction,
                           width: this.width,
                           length: this.length,
                           BR_point: new Point({
                             x: this.__BR_point.x + distance * Math.sin(radians),
                             y: this.__BR_point.y - distance * Math.cos(radians) })
                           });
  }

  // can make this take direction of movement later
  left_corner_turn(degrees) {
    const result = this.clone();
    const brp = result.BR_point();
    const blp = result.BL_point();
    result.__BR_point = brp.rotate_around({ fulcrum: blp, degrees: degrees });
    result.facing += degrees;
    return result;
  }

  // can make this take direction of movement later
  right_corner_turn(degrees) {
    var result = this.clone();
    result.__BR_point = result.BR_point().rotate_around({ fulcrum: this.BR_point(), degrees });
    result.facing += degrees;
    return result;
  }

  // TODO: Should I aslo have some kind of drifty, sidling move here? One that
  // can take into account direction of movement?



  // returns false or skew between facing and a rect side
  // BUGBUG: Does this handle corners?
  intersect_rectangle(rect) {
    // BUGBUG: Doesn't handle overlapping rects with parallel lines
    // incl. exactly overlapping rects!

    const rect_sides = rect.sides();

    const intersects_rect = (side) => {
      return Object.keys(rect_sides).find(function(rect_key) {
        return side.intersect_segment(rect_sides[rect_key]);
      });
    }

    var skew = intersects_rect(this.L_side());
    if (!skew) { skew = intersects_rect(this.R_side(), rect); }
    if (skew) {
      console.log(`RECT skew: ${skew}`);
      return skew;
    } else {
      if (skew = intersects_rect(this.F_side(), rect)) {
        return skew + 90;
      }
    }

    // BUGBUG back collisions not handled!
    // Also this is missed up for sidling into things like with bootleggers.

    return false;

/*
  var skew = false;
  var found = Object.keys(this_sides).some(function(this_side_key) {
    return Object.keys(rect_sides).some(function(rect_side_key) {
      skew = this_sides[this_side_key].intersect_segment(rect_sides[rect_side_key]);
      return skew;
    });
  });
  return skew;
*/
  }

  points() {
    return [this.BR_point(), this.BL_point(), this.FR_point(), this.FL_point()];
  }

  side(abbr) {
    return this.sides()[abbr];
  }

  sides() {
    return { 'F': this.F_side(),
             'B': this.B_side(),
             'L': this.L_side(),
             'R': this.R_side() };
  }

  __between_angles(__query, __left, __right) {
    // revisit this - JS mod operator is funky
    var query = __query % 360;
    var left  = __left  % 360;
    var right = __right % 360;
    // Deal with arc spanning the 0/360 crossover
    if (left < 0)     { left += 360; }
    if (right < left) { right += 360; }
    if (query < left) { query += 360; }
    return (left <= query) && (query <= right);
  }

  arc_for_point(point) {
    var direction = this.center().direction_to(point) % 360;
/*
console.log(`arc_for_point: direction === ${direction}`);
console.log(`arc_for_point: this.FL_angle() ==== ${this.FL_angle()}`);
console.log(`arc_for_point: this.FR_angle() ==== ${this.FR_angle()}`);
console.log(`arc_for_point: this.BR_angle() ==== ${this.BR_angle()}`);
console.log(`arc_for_point: this.BL_angle() ==== ${this.BL_angle()}`);
*/
    if (this.__between_angles(direction, this.FL_angle(), this.FR_angle())) {
      return 'F';
    } else if (this.__between_angles(direction, this.FR_angle(), this.BR_angle())) {
      return 'R';
    } else if (this.__between_angles(direction, this.BR_angle(), this.BL_angle())) {
      return 'B';
    } else if (this.__between_angles(direction, this.BL_angle(), this.FL_angle())) {
      return 'L';
    } else {
      throw new Error(`Error: facing ${this.facing} cannot find arc for direction: ${direction}`);
    }
  }

  point_is_in_arc({point, arc_name}) {
    var direction = this.center().direction_to(point); // + this.facing;
    switch (arc_name) {
      case 'F':
        return this.__between_angles(direction, this.FL_angle(), this.FR_angle());
      case 'R':
        return this.__between_angles(direction, this.FR_angle(), this.BR_angle());
      case 'B':
        return this.__between_angles(direction, this.BR_angle(), this.BL_angle());
      case 'L':
        return this.__between_angles(direction, this.BL_angle(), this.FL_angle());
      default:
        throw new Error(`unknown arc name: "${arc_name}"`);
    }
  }
}
export default Rectangle;
