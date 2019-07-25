import React from 'react';
//import Car from './Car';
import { useSelector } from 'react-redux';

import { WallData } from '../maps/arena_map_1';
import Rectangle from '../utils/Rectangle';
import Segment from '../utils/Segment';
import Point from '../utils/Point';
import CrewMember from '../reducers/lib/CrewMember';
import Weapon from '../reducers/lib/Weapon';

import { FACE, INCH } from '../utils/constants';


const FiringArc = () => {
  const players = useSelector((state) => state.players);
  const current_player = players.all[players.current_index];
  const cars = useSelector((state) => state.cars);
  const get_current_car = () => {
    const player_color = players.all[players.current_index].color;
    return cars.find(function(car) { return car.color === player_color});
  }

  const car = get_current_car();

  const current_weapon = car.design.components.weapons[car.phasing.weapon_index];
  const current_crew_member = car.design.components.crew.driver;
  //if (!Weapon.can_fire(current_weapon)) { return; }


  const draw_arc = () => {
    if (!( Weapon.can_fire(current_weapon) &&
           CrewMember.can_fire(current_crew_member) ) ) { return; }
    const arc_facing = current_weapon.location;

    const rect = car.phasing.rect;
    const arc_ray_len = 50 * INCH;

    const arc_sides = (inches) => {
      var left = null;
      var right = null;
      switch (arc_facing) {
        // Could do all of these with rect FL_angle, FR_angle, BR_angle, and BL_angle
        case 'F':
        case 'B':
          left  = rect.center().move(rect.facing + FACE[arc_facing] + 30, inches * INCH);
          right = rect.center().move(rect.facing + FACE[arc_facing] - 30, inches * INCH);
          break;
        case 'L':
        case 'R':
          left  = rect.center().move(rect.facing + FACE[arc_facing] + 60, inches * INCH);
          right = rect.center().move(rect.facing + FACE[arc_facing] - 60, inches * INCH);
          break;
        case 'none':
          return null;
        default:
          throw Error(`ERROR: UNKNOWN ${arc_facing}`);
      }
      return ({
        facing: rect.facing + FACE[arc_facing],
        left: left,
        right: right,
      });
    }

    if (arc_sides() === null) { return; }

    const text_loc = (inches) => {
      return rect.center().move(arc_sides().facing, inches * INCH);
    }

    const arc_fill = () => {
      const sides = arc_sides(arc_ray_len);
      if (sides === null) { return; }
      return (
        <path
          d={`M${arc_sides(arc_ray_len).left.x},${arc_sides(arc_ray_len).left.y}
              A${arc_ray_len},${arc_ray_len} 0 0,0 ${arc_sides(arc_ray_len).right.x},${arc_sides(arc_ray_len).right.y}
              L${rect.center().x},${rect.center().y}
              L${arc_sides(arc_ray_len).left.x},${arc_sides(arc_ray_len).left.y}`}
          style={ filled_arc_style }
        />
      );
    }

    // Change this to show the +4 inside the 1" arc?
    const arc_at_inches = ({ label, inches }) => {
      return (
        <g key={`arc-${inches}-in`}>
        <path
          d={`M${arc_sides(inches).left.x},${arc_sides(inches).left.y}
              A${inches*INCH},${inches*INCH} 0 0,0 ${arc_sides(inches).right.x},${arc_sides(inches).right.y}`}
          style={ arc_style }
        />
        <text
          x={text_loc(inches).x}
          y={text_loc(inches).y}
          style= { arc_text_style }
        >
          { label }
        </text>
        </g>
      )
    }

    const arc_facing_distance_mod = () => {
      switch (arc_facing) {
        case 'F':
        case 'B':
          return .5;
        case 'L':
        case 'R':
          return .25;
        default:
          return 0;
      }
    }

    const arc_increments = () => {
      var result = {};
      result[arc_facing_distance_mod() + 1] = '+4';
      var modifier = 0;
      for (var i = arc_facing_distance_mod() + 4; i < 50; i += 4) {
        result[i] = --modifier;
      }
      return result;
    }

    return (
      <g key={`${get_current_car().id}-arc`}>
        { arc_fill() }
        { Object.keys(arc_increments()).map(function(key) {
            return arc_at_inches({ label: arc_increments()[key], inches: key })
          })
        }
      </g>
    );
  }

  const filled_arc_style = {
    fill: 'yellow',
  //  stroke: 'orange',
  //  strokeWidth: 5,
    opacity: .20,
  };

  const arc_style = {
    fill: 'none',
    stroke: 'red',
    //strokeWidth: 5,
    opacity: .8,
  };

  const arc_text_style = {
    fill: 'red',
    fontSize: '16px',
    fontFamily: 'fantasy',
    fontVariant: 'small-caps',
    opacity: 1,
  };

  return (
    <g>
      { draw_arc() }
    </g>
  );
};

export default FiringArc;
