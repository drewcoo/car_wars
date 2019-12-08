import React from 'react'
import { HotKeys } from 'react-hotkeys'

import { useDispatch, useSelector } from 'react-redux'

import {
  maneuver_set, maneuver_next, maneuver_previous,
  weapon_next, weapon_previous,
  player_next,
  ghost_forward, ghost_reset, ghost_turn_bend, ghost_move_drift, ghost_turn_swerve,
  ghost_show_collisions,
  ghost_target_next, ghost_target_previous,
  ghost_fire,
  accept_move
} from '../redux'

const KeystrokeInput = () => {
  const dispatch = useDispatch()

  const cars = useSelector((state) => state.cars)
  const players = useSelector((state) => state.players)

  const get_current_car = () => {
    var player = players.all[players.current_index]
    var id = player.car_ids[player.current_car_index]
    return cars.find(function (elem) { return elem.id === id })
  }

  const keyMap = {
    fire_weapon: 'f',
    next_maneuver: 'm',
    previous_maneuver: 'shift+m',
    next_weapon: 'w',
    previous_weapon: 'shift+w',
    next_target: 't',
    previous_target: 'shift+t',
    accept_move: 'enter',
    turn_left: ['z', 'shift+x'],
    turn_right: ['x', 'shift+z'],
    home: '.'
  }

  var view_current_car = () => {
    var car = get_current_car()
    var element = document.getElementById(car.id)
    element.scrollIntoViewIfNeeded() // scrollIntoView();//{ block: 'center', inline: 'center' });
    element.scrollIntoView({ block: 'center', inline: 'center' })
  }

  const current_maneuver = (car) => {
    return car.status.maneuvers[car.phasing.maneuver_index]
  }

  const show_hide_car = (car, man_idx_delta) => {
    var index = (car.phasing.maneuver_index + man_idx_delta) %
                 car.status.maneuvers.length
    if (car.status.maneuvers[index] === 'none') {
      dispatch(ghost_reset(car))
    } else {
      dispatch(ghost_forward(car))
    }
    dispatch(ghost_show_collisions(car))
  }

  const turn_right = (f_right) => {
    var car = get_current_car()
    // view_current_car();
    switch (current_maneuver(car)) {
      case 'forward':
        dispatch(maneuver_set({
          id: car.id,
          maneuver_index: car.status.maneuvers.indexOf('bend')
        }))
        // fall through
      case 'bend':
        dispatch(ghost_turn_bend({ car: car, degrees: (f_right ? 15 : -15) }))
        break
      case 'drift':
        dispatch(ghost_move_drift({ car: car, direction: (f_right ? 'right' : 'left') }))
        break
      case 'swerve':
        dispatch(ghost_turn_swerve({ car: car, degrees: (f_right ? 15 : -15) }))
        break
      default:
        console.log(`maneuver: ${current_maneuver(car)}`)
        return
    }
    dispatch(ghost_show_collisions(car))
  }

  const handlers = {
    next_maneuver: (event) => {
      view_current_car()
      var car = get_current_car()
      dispatch(maneuver_next(car))
      dispatch(ghost_show_collisions(car))
      show_hide_car(car, 1)
    },
    previous_maneuver: (event) => {
      var car = get_current_car()
      dispatch(maneuver_previous(car))
      dispatch(ghost_show_collisions(car))
      show_hide_car(car, -1)
    },
    next_weapon: (event) => {
      dispatch(weapon_next(get_current_car()))
    },
    previous_weapon: (event) => {
      dispatch(weapon_previous(get_current_car()))
    },
    next_target: (event) => {
      dispatch(ghost_target_next(get_current_car()))
    },
    previous_target: (event) => {
      dispatch(ghost_target_previous(get_current_car()))
    },
    fire_weapon: (event) => {
      dispatch(ghost_fire(get_current_car()))
    },
    accept_move: (event) => {
      var car = get_current_car()
      var moved = (car.rect.BR_point().x !== car.phasing.rect.BR_point().x) ||
                  (car.rect.BR_point().y !== car.phasing.rect.BR_point().y)
      if (moved) {
        dispatch(accept_move(car))
        dispatch(player_next())
      }
    },
    turn_right: (event) => {
      turn_right(true)
    },
    turn_left: (event) => {
      turn_right(false)
    },
    home: (event) => {
      view_current_car()
      // console.log(`car id: ${car.id}`);
      // var element = document.getElementById(car.id);
      // element.scrollIntoView({block: 'center', inline: 'center'});
      dispatch(ghost_reset(get_current_car()))
    }
  }

  return (
    <HotKeys
      attach={document}
      focused={true}
      handlers={handlers}
      keyMap={keyMap} />
  )
}

export default KeystrokeInput
