import Point from './Point';
import {intersect} from 'mathjs';

class Segment {
  constructor(points) {
    if (points.length !== 2) {
      throw new Error(`\"${points}\" is not an array of two elements!`);
    }
    for (var i = 0; i < 2; i ++) {
       if (!(points[i] instanceof Point)) {
         throw new Error(`arg0, \"${points[i]}\" (${typeof(points[i])}), must be a point!`);
       }
    }
    this.points = points;
  }

  toString() {
    return JSON.stringify(this);
  }

  length() {
    return this.points[0].distance_to(this.points[1]);
  }

  middle() {
    return new Point({ x: (this.points[0].x + this.points[1].x)/ 2,
                       y: (this.points[0].y + this.points[1].y)/ 2 });
  }

  is_parallel(segment2) {
    var dir1 = this.points[0].direction_to(this.points[1]) % 180;
    var dir2 = segment2.points[0].direction_to(segment2.points[1]) % 180;
    return dir1 === dir2;
  }

  is_colinear(segment2) {
    var dir1 = this.points[0].direction_to(this.points[1]) % 180;
    var dir2 = segment2.points[0].direction_to(segment2.points[1]) % 180;
    var dir3 = this.points[1].direction_to(segment2.points[0]) % 180;
    return dir1 === dir2 && dir1 === dir3;
  }

  equals(segment2) {
    return ( (this.points[0].equals(segment2.points[0]) && this.points[1].equals(segment2.points[1])) ||
             (this.points[0].equals(segment2.points[1]) && this.points[1].equals(segment2.points[0])) );
  }

  // returns false or the skew between the segments
  intersect_segment(segment2) {
    // from SO - url forgotten
    const copypasta = (a,b,c,d,p,q,r,s) => {
      var det, gamma, lambda;
      det = (c - a) * (s - q) - (r - p) * (d - b);
      if (det === 0) { return false; }
      lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
      gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
      return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }

    const is_nearer_than_my_other_end = (segment2) => {
      var seg1 = new Segment([this.points[0], segment2.points[0]]);
      var seg2 = new Segment([this.points[1], segment2.points[0]]);
      var seg3 = new Segment([this.points[0], segment2.points[1]]);
      var seg4 = new Segment([this.points[1], segment2.points[1]]);
      return (seg1.length() + seg2.length() ===  this.length() ||
              seg3.length() + seg4.length() ===  this.length());
    }

    // BUGBUG: hits on endpoints, I think
    // BUGBUG: dump colinear check?




    if (copypasta(this.points[0].x, this.points[0].y,
                  this.points[1].x, this.points[1].y,
                  segment2.points[0].x, segment2.points[0].y,
                  segment2.points[1].x, segment2.points[1].y) ||
        (this.is_colinear(segment2) && is_nearer_than_my_other_end(segment2))) {


/*
    var inter = intersect(this.points[0].as_array(), this.points[1].as_array(),
                       segment2.points[0].as_array(), segment2.points[1].as_array());
    if (inter !== null ) {
      // if inter not between segment ends, false
      if (!((inter[0] > this.points[0].x && inter[0] < this.points[1].x) ||
          (inter[0] < this.points[0].x && inter[0] > this.points[1].x))) {
            return false;
          }
          console.log(`between [${this.points[0].x},${this.points[0].y}] and [${this.points[1].x},${this.points[1].y}]`);
  console.log(inter);
  */

    /*

    if (intersect(this.points[0].as_array(), this.points[1].as_array(),
                       segment2.points[0].as_array(), segment2.points[1].as_array()
  ) !== null) {
      if (
        this.points[0].distance_to(new Point({ x: inter[0], y:inter[1]})) > this.length() ||
        this.points[1].distance_to(new Point({ x: inter[0], y:inter[1]})) > this.length()
        //this.points[0].distance_to(this.points[1]) !==
        //  this.points[0].distance_to(new Point({ x: inter[0], y:inter[1]}).distance_to(this.points[1]))

      ) {
        return false;
      }
      */

      var this_dir = (this.points[0].direction_to(this.points[1]) + 360) % 180;
      var segment2_dir = (segment2.points[0].direction_to(segment2.points[1]) + 360) % 180;
      var result = Math.abs(this_dir - segment2_dir);
      //console.log(result);
      //if (!result) { throw new Error(`FALSEY: "${result}"`); }
      return result;
    } else {
      return false;
    }
  }
}
export default Segment;
