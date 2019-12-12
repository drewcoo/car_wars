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
import { ghostTargetSet } from '../../redux'

const Target = (props) => {
  const dispatch = useDispatch()

  const optionStyle = {
    background: 'black',
    color: 'white',
    fontSize: '24px',
    fontFamily: 'fantasy',
    fontVariant: 'small-caps'
  }

  const players = useSelector((state) => state.time.moveMe.players)
  const cars = useSelector((state) => state.cars)
  const getCurrentCar = () => {
    var playerColor = players.all[players.currentIndex].color
    var carColor = playerColor
    return cars.find(function (elem) { return elem.color === carColor })
  }

  const listTargets = () => {
    const car = getCurrentCar()
    var result = []
    if (car.phasing.targets.length > 0) {
      for (var i = 0; i < car.phasing.targets.length; i++) {
        const locType = (car.phasing.targets[i].name.length === 1) ? 'side' : 'tire'
        const locString = `${car.phasing.targets[i].carId} ${car.phasing.targets[i].name} ${locType}`
        result.push(<option key={i} value={i}>{locString}</option>)
      }
    } else {
      console.assert(car.phasing.targetIndex === 0)
      result.push(<option key={ 'none' } value={' none' }>none</option>)
    }
    return result
  }

  var viewElement = (id) => {
    console.log(`getting element: ${id}`)
    var element = document.getElementById(id)
    if (!element) { return }
    element.scrollIntoViewIfNeeded() // scrollIntoView();//{ block: 'center', inline: 'center' });
    element.scrollIntoView({ block: 'center', inline: 'center' })
  }

  const onChange = (event) => {
    dispatch(ghostTargetSet({
      id: getCurrentCar().id,
      targetIndex: event.target.value
    }))
    viewElement('reticle')
  }

  return (
    <select
      id='target'
      style={ optionStyle }
      value={ getCurrentCar().phasing.targetIndex }
      onChange={ onChange }>
      { listTargets() }
    </select>
  )
}

export default Target
