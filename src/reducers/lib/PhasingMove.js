import Point from '../../utils/Point';
import { FACE, INCH } from '../../utils/constants';

export class PhasingMove {
  static nothing({ car }) {
    console.log('nothing here');
    console.log(car.id);
  }

  static has_moved({ car }) {
    return !car.rect.BR_point().equals(car.phasing.rect.BR_point()) ||
           car.rect.facing !== car.phasing.rect.facing;
  }

  static reset({ car }) {
    car.phasing = {
      rect: car.rect.clone(),
      damage_marker_location: null,
      damage_message: '',
      difficulty: 0,
      //focus: true, do something with next player/next car instead.
      maneuver_index: 0,
      weapon_index: car.phasing.weapon_index,
      targets: null,
      target_index: 0, // BUGBUG: keep old targets? We want sustained fire . . .
      collision_detected: false,
      collisions: [],
    };
  }

  //car.phasing.rect = PhasingMove.forward({ car, distance = INCH });
  //car.phasing.rect = car.phasing.rect.move({distance: INCH, direction: car.phasing.rect.facing });

  static forward({ car, distance = INCH }) {
    return car.rect.move({ distance, direction: car.rect.facing });
  }

  static bend({ car, degrees }) {
    const current_facing_delta = car.phasing.rect.facing - car.rect.facing;
    const desired_facing = current_facing_delta + degrees;
    // Can't turn more than 90 deg.
    if (Math.abs(desired_facing) > 90) { return car.phasing.rect; }

    const facing_right = current_facing_delta > 0;
    const facing_left  = current_facing_delta < 0;
    const turning_right = degrees > 0;
    const turning_left  = degrees < 0;

    var result_rect = PhasingMove.forward({ car });

    if (turning_right) {
      if (!facing_left) {
        result_rect = result_rect.right_corner_turn(desired_facing);
      } else /* facing left */ {
        result_rect = result_rect.left_corner_turn(desired_facing);
      }
    } else /* turning left */ {
      if (!facing_right) {
        result_rect = result_rect.left_corner_turn(desired_facing);
      } else /* facing right */ {
        result_rect = result_rect.right_corner_turn(desired_facing);
      }
    }

    car.phasing.difficulty = Math.ceil(Math.abs(result_rect.facing - car.rect.facing) / 15);

    return result_rect;
  }

  static swerve({ car, degrees }) {
    //  |
    //  |
    //  |
    //  |
    // \|/
    //  V
    // TODO: make this use firsst the new drift and then the new bend usage
    // Each possibility tries to make a complete move - that way we can ghost collisions
    const current_facing = car.phasing.rect.facing - car.rect.facing;
    const desired_facing = current_facing + degrees;

    var result_rect = car.phasing.rect.clone();

    // Can't turn more than 90 deg.
    if (Math.abs(desired_facing) > 90) { return result_rect; }

    const facing_front = current_facing;
    const facing_left  = current_facing < 0;
    const facing_right = current_facing > 0;
    const turning_to_front = desired_facing === 0;
    const turning_left     = degrees < 0;
    const turning_right    = degrees > 0;

    const drift = (direction='right') => {
      result_rect = result_rect.move({
        direction: (result_rect.facing + FACE.RIGHT),
        distance: ((direction === 'right') ? INCH/4 : -INCH/4)
      });
      result_rect.facing += FACE.LEFT;
    }

    if (turning_to_front) {
      result_rect.__BR_point = result_rect.BR_point().clone();
      result_rect = car.rect.move({ direction: car.rect.facing,
                                       distance: INCH});
    } else if (turning_right) {
      if (facing_right) {
        result_rect = result_rect.right_corner_turn(degrees);
      } else if (facing_left) {
        result_rect = result_rect.left_corner_turn(degrees);
      } else /* facing forward */ {
         drift('left');
         result_rect = result_rect.right_corner_turn(degrees);
      }
    } else if (turning_left) {
      if (facing_left) {
        result_rect = result_rect.left_corner_turn(degrees);
      } else if (facing_right) {
        result_rect = result_rect.right_corner_turn(degrees);
      } else /* facing forward */ {
        drift('right');
        result_rect = result_rect.left_corner_turn(degrees);
      }
    }

    car.phasing.difficulty = Math.ceil(Math.abs(desired_facing) / 15);
    if (car.phasing.difficulty > 0) { car.phasing.difficulty++; }

    return result_rect;
  }

  static drift({ car, distance }) {
    const fwd_null = PhasingMove.forward({ car });
    //const fwd_null = car.rect.move({ direction: car.rect.facing + FACE.FRONT, distance: INCH });
    const result = car.phasing.rect.move({ direction: car.rect.facing + FACE.RIGHT, distance })
    result.facing = car.rect.facing;
    const current_dist = Math.floor(fwd_null.BR_point().distance_to(result.BR_point()));

    // Drifts are max 1/2".
    if (current_dist > INCH/2) { return car.phasing.rect; }

    // Set maneuver difficulty. Resolve that when the move is accepted.
    if (current_dist === 0) {
      car.phasing.difficulty = 0;
    } else if (current_dist > INCH/4) {
      car.phasing.difficulty = 3;
    } else {
      car.phasing.difficulty = 1;
    }

    return result;
  }
}
