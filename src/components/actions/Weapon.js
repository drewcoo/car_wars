//
// Suggested hotkeys in <>. Clickable things should "look selectable," maybe glow.
//
// At beginnning of phase, can change speed if haven't yet this turn. Can <A>ccelerate (possibly in reverse) and <B>rake.
// Or click on "change speed" and select option.
//
// <M>aneuver cycles thorough the possibilities: Forward, Half-forward, Bend, Drift, Swerve, and more complicated. Turns in increments of 15% or drift 1/4" to sides with <Z> and <X> (or arrows?).
// Or click on "maneuver" to select option. (Possible option of choosing another non-mod-15 number?)
//
// Select <W>eapon. Begins with the first viable weapon selected if there's a viable weapon and haven't fired yet this turn.
// Or click the active weapon to select others.
// Should show firing arc and firing range increments.
//
// Select <T>arget - cycles through targets for the weapon's firing arc.
// Or click on tareted vehicle to cycle though targets there?
// Should show location (front left tire? right side?), list to-hit modifiers, and show number needed to hit target.
//
// <F>ire weapon at target. Show shooting and damage.
//
// <Enter> to accept move and turn over. (Should I have an "are you sure that's ok?")
//
// Cycling things should accept <Shift>+<key> to cycle in reverse direction.
//

import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { weapon_set } from '../../redux'

const Weapon = (props) => {
  const dispatch = useDispatch()

  const option_style = {
    background: 'black',
    color: 'white',
    fontSize: '24px',
    fontFamily: 'fantasy',
    fontVariant: 'small-caps'
  }

  const players = useSelector((state) => state.players)
  const cars = useSelector((state) => state.cars)
  const get_current_car = () => {
    const player_color = players.all[players.current_index].color
    const car_color = player_color
    return cars.find(function (elem) { return elem.color === car_color })
  }

  const weapons = get_current_car().design.components.weapons

  const list_weapons = () => {
    var result = []
    for (var i = 0; i < weapons.length; i++) {
      result.push(<option key={i} value={i}>{weapons[i].abbreviation} - {weapons[i].location}</option>)
    }
    return result
  }

  const onChange = (event) => {
    dispatch(weapon_set({
      id: get_current_car().id,
      weapon: event.target.value
    }))
  }

  return (
    <select id='weapon' style={option_style} value={get_current_car().phasing.weapon_index} onChange={onChange}>
      { list_weapons() }
    </select>
  )
}

export default Weapon
