import Dice from '../../utils/Dice';
import Damage from './Damage';

export class Collisions {
  static clear({ cars }) {
    for (let car of cars) {
      // This is ugly.
      car.phasing.collision_detected = false;
      car.collision_detected = false;
      car.phasing.collisions = [];
      car.collisions = [];
    }
  }


  static damage_modifier_from_weight(weight) {
    // p.17
    // pedestrians have DM of 1/5
    if (weight <= 2000) { return 1/3; }
    if (weight <= 4000) { return 2/3; }
    return Math.ceiling(weight/4000) + 1;
  }

  static temporary_speed({ this_dm, other_dm, speed }) {
    // p. 21
    const table = [
      [ 1/2, 1/4, 1/4, 1/4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
      [ 3/4, 1/2, 1/2, 1/4, 1/4, 1/4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
      [ 3/4, 1/2, 1/2, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
      [ 3/4, 3/4, 3/4, 1/2, 1/2, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 0, 0, 0, 0, 0, 0, 0 ],
      [ 1, 3/4, 3/4, 1/2, 1/2, 1/2, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4 ],
      [ 1, 3/4, 3/4, 3/4, 1/2, 1/2, 1/2, 1/2, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4 ],
      [ 1, 1, 3/4, 3/4, 3/4, 1/2, 1/2, 1/2, 1/2, 1/2, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4 ],
      [ 1, 1, 3/4, 3/4, 3/4, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4 ],
      [ 1, 1, 3/4, 3/4, 3/4, 3/4, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4 ],
      [ 1, 1, 1, 3/4, 3/4, 3/4, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4 ],
      [ 1, 1, 1, 3/4, 3/4, 3/4, 3/4, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4 ],
      [ 1, 1, 1, 3/4, 3/4, 3/4, 3/4, 3/4, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/4, 1/4, 1/4, 1/4 ],
      [ 1, 1, 1, 3/4, 3/4, 3/4, 3/4, 3/4, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/4, 1/4 ],
      [ 1, 1, 1, 3/4, 3/4, 3/4, 3/4, 3/4, 3/4, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/4 ],
      [ 1, 1, 1, 3/4, 3/4, 3/4, 3/4, 3/4, 3/4, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2 ],
      [ 1, 1, 1, 1, 3/4, 3/4, 3/4, 3/4, 3/4, 3/4, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2 ],
      [ 1, 1, 1, 1, 3/4, 3/4, 3/4, 3/4, 3/4, 3/4, 3/4, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2 ],
      [ 1, 1, 1, 1, 3/4, 3/4, 3/4, 3/4, 3/4, 3/4, 3/4, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2 ],
      [ 1, 1, 1, 1, 3/4, 3/4, 3/4, 3/4, 3/4, 3/4, 3/4, 3/4, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2 ],
      [ 1, 1, 1, 1, 3/4, 3/4, 3/4, 3/4, 3/4, 3/4, 3/4, 3/4, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2 ],
      [ 1, 1, 1, 1, 3/4, 3/4, 3/4, 3/4, 3/4, 3/4, 3/4, 3/4, 3/4, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2 ],
      [ 1, 1, 1, 1, 3/4, 3/4, 3/4, 3/4, 3/4, 3/4, 3/4, 3/4, 3/4, 3/4, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2 ]
    ];
    const row = (this_dm >= 1) ? (this_dm + 1) : (this_dm * 3 - 1);
    const column = (other_dm >= 1) ? (other_dm + 1) : (other_dm * 3 - 1);
    return table[row][column] * speed;
  }

  static ram_damage_by_speed(speed) {
    if (speed < 0) { throw new Error(`speed < 0! "${speed}"`); }
    if (speed % 5 !== 0) { throw new Error(`speed not multiple of 5: "${speed}"`); }
    switch (speed) {
      case 0:
        return '0d';
      case 5:
        return '1d-4';
      case 10:
        return '1d−2';
      case 15:
        return '1d−1';
      case 20:
      case 25:
        return '1d';
      default:
        return `${speed / 5 - 5}d`
    }
  }

  //
  // START HERE!!
  //
  // BUGBUG: Assumes forward movement; not reverse.
  static detect_with_cars({ cars, this_car }) {
    cars.forEach(function(car) {
      if (car.id === this_car.id) { return; }

      var rammer = { rammed: car.id };
      var rammed = { rammed_by: this_car.id };

      var skew = this_car.phasing.rect.intersect_rectangle( car.rect);

      if (skew) {
        car.collision_detected = true;
        this_car.phasing.collision_detected = true;

        var arc_of_rammed_vehicle = car.rect.arc_for_point(this_car.rect.F_side().middle());   //this_car.phasing.rect.center());
        console.log(`striker is in ${arc_of_rammed_vehicle} arc of rammed.`);

        var type = 'unknown';

        if ((arc_of_rammed_vehicle === 'F' && car.status.speed >= 0) ||
            (arc_of_rammed_vehicle === 'R' && car.status.speed <  0)) {
          // BUGBUG: handle reverse speeds

          rammer.type = rammed.type = 'head-on';
          var collision_speed = this_car.status.speed + car.status.speed;
          var damage_to_each = Collisions.ram_damage_by_speed(collision_speed);
          rammer.damage = rammed.damage = damage_to_each;
          rammer.damage_modifier = Collisions.damage_modifier_from_weight(this_car.design.attributes.weight);
          rammed.damage_modifier = Collisions.damage_modifier_from_weight(car.design.attributes.weight);

          if (this_car.status.speed <= car.status.speed) {
            rammer.handling_status = rammed.handling_status = - Math.floor(this_car.status.speed / 10);
            rammer.new_speed = 0;
            rammed.new_speed = car.status.speed - this_car.status.speed;
          } else {
            rammer.handling_status = rammed.handling_status = - Math.floor(car.status.speed / 10);
            rammed.new_speed = 0;
            rammer.new_speed = this_car.status.speed - car.status.speed;
          }
        } else if ((arc_of_rammed_vehicle === 'B' && car.status.speed >= 0) ||
                   (arc_of_rammed_vehicle === 'F' && car.status.speed <  0)) {
          // BUGBUG: handle reverse speeds
          rammer.type = rammed.type = 'rear-end';

          var collision_speed = this_car.status.speed - car.status.speed;
          var damage_to_each = Collisions.ram_damage_by_speed(collision_speed);
          rammer.damage = rammed.damage = damage_to_each;
          rammer.damage_modifier = Collisions.damage_modifier_from_weight(this_car.design.attributes.weight);
          rammed.damage_modifier = Collisions.damage_modifier_from_weight(car.design.attributes.weight);



/////////////////////////////////
        } else {
          if (Collisions.is_sideswipe({car: this_car, other: car, skew})) {
           console.log(`this_car.phasing.rect.facing : ${this_car.phasing.rect.facing}`);
           console.log(`this_car.rect.facing: ${this_car.rect.facing}`);
           console.log(`car.rect.facing: ${car.rect.facing}`);
           console.log(`Math.abs(car.rect.facing - this_car.phasing.rect.facing): ${Math.abs(car.rect.facing - this_car.phasing.rect.facing)}`);

           var facing_delta = Math.abs(car.rect.facing - this_car.phasing.rect.facing);

           rammed.type = (0 <= facing_delta && facing_delta <= 45) ? 'same-direction-sideswipe' : 'different-direction-sideswipe';
           rammer.type = rammed.type
/////////////////////////////////////
          } else {
            rammer.type = rammed.type = 't-bone';
          }
        }

        // possibly more than one collision - chain reaction?
        this_car.phasing.collisions.push(rammer);
        car.phasing.collisions.push(rammed);
        console.log(JSON.stringify(this_car.phasing.collisions));
        console.log(JSON.stringify(car.phasing.collisions));
        console.log(`Moving car completes move?  ${rammer.new_speed <= 0 ? 'No.' : 'Yes.'}`);
      }
    });
  }


  static is_sideswipe({ car, other, skew }) {
    var delta = Math.abs((car.phasing.rect.facing + 360 ) % 360 - (other.rect.facing + 360 ) % 360);
    // first mod to one side
    delta %= 180;
    // then anything > 45 deg from the middle is a sideswipe.
    //
    // BUGBUG: At exactly 45 degrees from perpendicular this could be a sideswipe
    // or not. pp 18-19 don't specify which to choose. I chose to treat the
    // boundary cases a non-sideswipes.
    return (delta < 45 || delta > 135);
  }

  // BUGBUG: Assumes forward movement; not reverse.
  static detect_with_walls({ this_car, walls }) {
    // shortcut - premature optimization?
    if (this_car.phasing.collision_detected) { return; }

    for (let wall of walls) {
      var skew = this_car.phasing.rect.intersect_rectangle(wall.rect);

      if (skew) {
        this_car.phasing.collision_detected = true;

        var type = 'unknown';
        if (Collisions.is_sideswipe({car: this_car, other: wall, skew})) {
          // TODO : determine same/opposite dir sideswipe based on facings.
          type = 'sideswipe';
        } else {
          // TODO: determine head-on, rear-end, or t-bone based on
          // which arc the car hit
          type = 'not_sideswipe';
        }
        console.log(type);

        // TODO: Movement, damage, HC mods

        this_car.phasing.collisions.push({type: type, rammed: wall});
      }
    }
  }

  static detect({ cars, walls, this_car }) {
    // clear old collision data just in case
    console.log('clear');
    Collisions.clear({ cars });
    console.log('with cars');
    Collisions.detect_with_cars({cars, this_car});
    console.log('with walls');
    Collisions.detect_with_walls({ walls, this_car});
    console.log('done detecting');
  }

  static resolve({ car, collision }) {
    if (collision.rammed.id.match(/wall/)) {
      console.log(`hit a wall: ${collision.rammed.id}`);
      console.log(`type: ${collision.type}`);
    } else if (collision.rammed.id.match(/car/)) {
      console.log(`hit a car: ${collision.rammed.id}`);
    } else {
      throw new Error(`unknown rammed thing: "${collision}"`);
    }
  }


  //
  //  (T-Bone, Head-On, Rear-End or Sideswipe)
  //
  // head-on - collide from the other vehicle's front arc
  //
  // rear end - collide from the other vehicle's back arc
  //
  // sideswipe - collide into a vehicles's side, from its side arc, but
  // in the direction of (or opposite of) it's front and back arcs
  // Can be same dir or opposite dir.
  //
  // t-bone - collie into a vehicle's side, from any direction opposite its
  // side arc
  //
  // all wall collisiions are sideswipe or head-on
  //
  /*
  Need to figure out mechanics for these:

   p.19: "The driver of the conforming vehicle selects an appropriate pivot corner from the choices shown in
Figure 10."

  p. 20: "If a collision occurs and it is on the border of two types of collisions, the defender
decides what type of collision it is."

  Also, beware this:
  p.20: "Note that subsequent phases in which
the vehicles are still in contact are not new
collisions"
  */
  //

  //
  //
}
