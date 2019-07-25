import React from 'react';
import {HotKeys} from 'react-hotkeys';
import { useSelector, useActions } from 'react-redux';


//bugbug
import { maneuver_set, maneuver_next, maneuver_previous,
         weapon_next, weapon_previous,
         player_next,
         ghost_forward, ghost_reset, ghost_turn_bend, ghost_move_drift, ghost_turn_swerve,
         ghost_show_collisions,
         ghost_target_next, ghost_target_previous,
         ghost_fire,
         accept_move } from '../redux';


const KeystrokeInput = () => {

  const players = useSelector((state) => state.players);
  const cars = useSelector((state) => state.cars);

  const get_current_car = () => {
    var player = players.all[players.current_index];
    var id = player.car_ids[player.current_car_index];
    return cars.find(function(elem) { return elem.id === id});
  }

  const set_maneuver_index = useActions(maneuver_set);
  const next_maneuver = useActions(maneuver_next);
  const previous_maneuver = useActions(maneuver_previous);
  const next_player = useActions(player_next);
  //const ghost_init = useActions(ghost_initialize);


  const ghost_reset_move = useActions(ghost_reset);
  const ghost_move_forward = useActions(ghost_forward);
  const ghost_bend = useActions(ghost_turn_bend);
  const ghost_drift = useActions(ghost_move_drift);
  const ghost_swerve = useActions(ghost_turn_swerve);

  const ghost_collisions = useActions(ghost_show_collisions);

  const complete_move = useActions(accept_move);

  const next_weapon = useActions(weapon_next);
  const previous_weapon = useActions(weapon_previous);

  const next_target = useActions(ghost_target_next);
  const previous_target = useActions(ghost_target_previous);

  const fire_weapon = useActions(ghost_fire);

  const keyMap = {
    'fire_weapon': 'f',
    'next_maneuver': 'm',
    'previous_maneuver': 'shift+m',
    'next_weapon': 'w',
    'previous_weapon': 'shift+w',
    'next_target': 't',
    'previous_target': 'shift+t',
    'accept_move': 'enter',
    'turn_left': ['z', 'shift+x'],
    'turn_right': ['x', 'shift+z'],
    'home': '.'
  };

var view_current_car = () => {
  var car = get_current_car();
  var element = document.getElementById(car.id);
  element.scrollIntoViewIfNeeded(); //scrollIntoView();//{ block: 'center', inline: 'center' });
  element.scrollIntoView({ block: 'center', inline: 'center' });
}

  const current_maneuver = (car) => {
    return car.status.maneuvers[car.phasing.maneuver_index];
  }

  const show_hide_car = (car, man_idx_delta) => {
    var index = (car.phasing.maneuver_index + man_idx_delta) %
                 car.status.maneuvers.length;
    if (car.status.maneuvers[index] === 'none') {
      ghost_reset_move(car);
    } else {
      ghost_move_forward(car);
    }
    ghost_collisions(car);
  }

  const set_maneuver = (car, man_name) => {
    set_maneuver_index({ id: car.id,
                         maneuver_index: car.status.maneuvers.indexOf(man_name) });
  }

  const turn_right = (f_right) => {
    var car = get_current_car();
    //view_current_car();
    switch (current_maneuver(car)) {
      case 'forward':
        set_maneuver(car, 'bend');
        // fall through
      case 'bend':
        ghost_bend({ car: car, degrees: (f_right ? 15 : -15) });
        break;
      case 'drift':
        ghost_drift({ car: car, direction: (f_right ? 'right' : 'left') });
        break;
      case 'swerve':
        ghost_swerve({ car: car, degrees: (f_right ? 15 : -15) });
        break;
      default:
        console.log(`maneuver: ${ current_maneuver(car) }`);
        return;
    }
    ghost_collisions(car);
  }

  const handlers = {
    'next_maneuver': (event) => {
      view_current_car();
      //view_current_car();
      var car = get_current_car();
      next_maneuver(car);
      ghost_collisions(car);
      show_hide_car(car, 1);
    },
    'previous_maneuver': (event) => {
      var car = get_current_car();
      previous_maneuver(car);
      show_hide_car(car, -1);
    },
    'next_weapon': (event) => {
      next_weapon(get_current_car());
    },
    'previous_weapon': (event) => {
      previous_weapon(get_current_car());
    },
    'next_target': (event) => {
      next_target(get_current_car());
    },
    'previous_target': (event) => {
      previous_target(get_current_car());
    },
    'fire_weapon': (event) => {
      fire_weapon(get_current_car());
    },
    'accept_move': (event) => {
      var car = get_current_car();
      var moved = (car.rect.BR_point().x !== car.phasing.rect.BR_point().x) ||
                  (car.rect.BR_point().y !== car.phasing.rect.BR_point().y);
      if (moved) {
        complete_move(car);
        next_player();
      }
    },
    'turn_right': (event) => {
      turn_right(true);
    },
    'turn_left': (event) => {
      turn_right(false);
    },
    'home': (event) => {
      view_current_car();
      //console.log(`car id: ${car.id}`);
      //var element = document.getElementById(car.id);
      //element.scrollIntoView({block: 'center', inline: 'center'});
      ghost_reset_move(get_current_car());
    }
  };

  return (
    <HotKeys
      attach={document}
      focused={true}
      handlers={handlers}
      keyMap={keyMap} />
  );
};

export default KeystrokeInput;
