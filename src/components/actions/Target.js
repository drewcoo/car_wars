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


import React from 'react';

const Target = (props) => {
  const option_style = {
    background: 'black',
    color: 'white',
    fontSize: '24px',
    fontFamily: 'fantasy',
    fontVariant: 'small-caps',
  };

  //const non_select_color_override = {
  //  color: 'darkgray',
  //};

  return (
      <select id='target' style={option_style}>
        <option>what</option>
        <option>goes</option>
        <option>here?</option>
      </select>
  );
};

export default Target;
