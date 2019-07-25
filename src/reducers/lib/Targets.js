import {INCH} from '../../utils/constants';
import Segment from '../../utils/Segment';
import Point from '../../utils/Point';
/*
Target = {
  car_id: number,
  location_name: string,
  point: Point,
  segment: Segment,
  // ??? hit_modifier(s):,
}

*/

export class Targets {
  constructor({ car, cars, walls }) {
    this.car = car;
    this.cars = cars;
    this.walls = walls;
  }

  targetable_points(target) {
    //var turret_loc = new Segement([target.rect.BR_point(), target.rect.FL_point()]).middle();
    return [
      { car_id: target.id, name: 'FR', location: target.rect.FR_point(), display_point: target.rect.FR_point() },
      { car_id: target.id, name: 'FL', location: target.rect.FL_point(), display_point: target.rect.FL_point() },
      { car_id: target.id, name: 'BR', location: target.rect.BR_point(), display_point: target.rect.BR_point() },
      { car_id: target.id, name: 'BL', location: target.rect.BL_point(), display_point: target.rect.BL_point() },
    //  { car_id: target.id, name: 'turret', location: turret_loc, display_point: turret_loc },
    ];
  }

  targetable_sides(target) {
    return [
      { car_id: target.id, name: 'F',  location: target.rect.F_side(),   display_point: target.rect.F_side().middle()},
      { car_id: target.id, name: 'B',  location: target.rect.B_side(),   display_point: target.rect.B_side().middle()},
      { car_id: target.id, name: 'L',  location: target.rect.L_side(),   display_point: target.rect.L_side().middle()},
      { car_id: target.id, name: 'R',  location: target.rect.R_side(),   display_point: target.rect.R_side().middle()},
    ];
  }

  all_targetable_locations() {
    return this.cars.filter(element => {
      return this.car.id !== element.id;
    }).map(element => {
      return this.targetable_locations(element);
    }).flat();
  }
//////////////////////

//VVV
  all_other_car_rects() {
    return this.cars.filter(element => {
      return this.car.id !== element.id;
    }).map(element => {
      return element.rect;
    });
  }

  all_wall_rects() {
    return this.walls.map(element => {
      return element.rect;
    });
  }

  all_rects() {
    return this.all_wall_rects().concat(this.all_other_car_rects());
  }

  rect_points_in_arc(rect) {
    var firing_arc = this.car.design.components.weapons[this.car.phasing.weapon_index].location;
    return rect.points().filter(point => {
      //return this.car.phasing.rect.point_is_in_arc({ point: point, arc_name: firing_arc })
      return (this.car.phasing.rect.arc_for_point(point) === firing_arc);
    });
  }

  shot_blocked_by_wall({source_point, target_point}) {
    var line_to_target = new Segment([source_point, target_point]);
    return this.all_wall_rects().some(function(wall_rect) {
      var sides = wall_rect.sides();
      return Object.keys(sides).some(function(side_key) {
        return line_to_target.intersect_segment(sides[side_key]);
      });
    });
  }

  shot_blocked_by_car({source_point, target_point}) {
    var line_to_target = new Segment([source_point, target_point]);
    var all_car_rects = this.cars.map(element => { return element.rect; });
    return all_car_rects.some(function(car_rect) {
      return Object.keys(car_rect.sides()).some(function(side_key) {
        return line_to_target.intersect_segment(car_rect.side(side_key));
      });
    });
  }

  shot_blocked({source_point, target_point, ignore=null}) {
    var line_to_target = new Segment([source_point, target_point]);
    return this.all_rects().some(function(rect) {
      return Object.keys(rect.sides()).some(function(side_key) {
        if(ignore !== null && ignore.equals(rect.side(side_key))) {
          return false;
        }
        return line_to_target.intersect_segment(rect.side(side_key));
      });
    });
  }

/*
target_points_in_arc() {
  //var car = get_current_car();
  var weapon_loc = this.car.design.components.weapons[this.car.phasing.weapon_index].location;
  var source_point = this.car.phasing.rect.side(weapon_loc).middle();

  // .flatMap instead??  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap
  var possible_targets = this.all_other_car_rects().map(rect => {
    return rect.points().filter(point => {
      return (
        //this.car.phasing.rect.point_is_in_arc({ point: point, arc_name: weapon_loc }) &&
        this.car.phasing.rect.arc_for_point(point) === weapon_loc &&
        !this.shot_blocked({source_point: source_point, target_point: point})
      )
    });
  }).flat(); //.reverse();
  return possible_targets;
}
*/

  target_points_in_arc() {
    //var car = get_current_car();
    var weapon_loc = this.car.design.components.weapons[this.car.phasing.weapon_index].location;
    var source_point = this.car.phasing.rect.side(weapon_loc).middle();

    var other_cars = this.cars.filter(element => {
      return this.car.id !== element.id;
    });

    var all_points = other_cars.map(other_car => {
      return this.targetable_points(other_car);
    }).flat();

    console.log(all_points);

    var results = all_points.filter(point => {
      return (
        this.car.phasing.rect.point_is_in_arc({ point: point.location, arc_name: weapon_loc }) &&
        !this.shot_blocked({source_point: source_point, target_point: point.location})
      )
    });

    return results;
  }


  target_sides_in_arc() {
    //var car = get_current_car();
    var weapon_loc = this.car.design.components.weapons[this.car.phasing.weapon_index].location;
    var source_point = this.car.phasing.rect.side(weapon_loc).middle();

    console.log(`source point: ${source_point}`);

    var other_cars = this.cars.filter(element => {
      return this.car.id !== element.id;
    });


    var all_sides = other_cars.map(other_car => {
      return this.targetable_sides(other_car);
    }).flat();


    // BUGBUG: This is cheating so that I don't need to map out a bunch of
    // triangles in the arc, figuring out what parts are occluded.
    // The cheat is to sample. Pick a higher sample rate to do better
    // and maybe take longer.
    var results = all_sides.filter(side => {
      //var matches = 0;
      var slices = 32;

      var log_str = '';
      var hits = 0;

      for (var i = 1; i < slices; i++) {
        var try_point = new Point({ x: side.location.points[0].x + (side.location.points[1].x - side.location.points[0].x) * (i/slices),
                                    y: side.location.points[0].y + (side.location.points[1].y - side.location.points[0].y) * (i/slices) });
        log_str += `${side.name} point: ${try_point}\n`;

        //if (this.car.phasing.rect.point_is_in_arc({ point: try_point, arc_name: weapon_loc }) &&
        if (this.car.phasing.rect.arc_for_point(try_point) === weapon_loc &&
            !this.shot_blocked({ source_point: source_point, target_point: try_point, /*ignore: side.location*/})) {
              //matches++;
                console.log(log_str);
              hits++;
              console.log(`${side.name} point: ${try_point}`);
              // Because we don't count end points as intersections.
              // BUGBUG: FIX inersect code to handle corners/ends of segments
              if (hits > 1) { return true; }

        }

        //if (matches > 1) { return true; }
      }
    });
    /////////////////////////////

    return results;
  }

  targets_in_arc() {
    var weapon_loc = this.car.design.components.weapons[this.car.phasing.weapon_index].location;
    var source = this.car.phasing.rect.side(weapon_loc).middle();
    return this.target_points_in_arc().concat(this.target_sides_in_arc()).sort(
      (a, b) => source.distance_to(a.display_point) - source.distance_to(b.display_point)
    );
  }



}
export default Targets;

///////////////////////////////////////
/*

TargetLocation:
car_id
name
is_side // point if false
nearest_point
display_point
*/
