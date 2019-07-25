import Segment from './Segment';
import { degrees_to_radians } from './conversions';

// assumes a point as array [x, y]

class Point {
  constructor({x, y}) {
    this.x = x;
    this.y = y;
    if (this.x === undefined || this.y === undefined) {
      throw new Error(`(${this.x}, ${this.y}) - UNDEFINED!!!`);
    }
  }

  as_array() {
    return [this.x, this.y];
  }

  clone() {
    return new Point({x: this.x, y: this.y});
  }

  equals(point2) {
    return point2 && this.x === point2.x && this.y === point2.y;
  }

  // degrees
  direction_to(point) {
    return (Math.atan2((point.y - this.y), (point.x - this.x)) * 180 / Math.PI + 90);
  }

  distance_to(point) {
    return Math.sqrt(Math.pow(this.x - point.x, 2) +
                     Math.pow(this.y - point.y, 2));
  }

  move(direction, distance) {
    let radians = degrees_to_radians(direction);
    return new Point({ x: this.x + distance * Math.sin(radians),
                       y: this.y - distance * Math.cos(radians) });
  }

  toString() {
    return JSON.stringify(this);
  }

  rotate_around({ fulcrum, degrees }) {
    let radians = degrees_to_radians(degrees) +
                      Math.atan2((this.y - fulcrum.y), (this.x - fulcrum.x));
    let dist = fulcrum.distance_to(this);
    let new_x = Math.cos(radians) * dist + fulcrum.x;
    let new_y = Math.sin(radians) * dist + fulcrum.y;
    return new Point({ x: new_x, y: new_y });
  }
}
export default Point;
