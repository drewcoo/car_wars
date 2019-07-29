import React from 'react';
import { INCH, FACE } from '../utils/constants';
import Point from '../utils/Point';

import FiringArc from './FiringArc';

const InsetLayout = ({width, length, car}) => {
  return (
    <g>
      <text x = { width * 16/64 } y = { length * 9/64 } >
        F: { car.design.components.armor.F }
      </text>
      <text x = { width * 36/64 } y = { length * 9/64 } >
        T: { car.design.components.armor.T }
      </text>
      <text x = { width * 2/64 } y = { length * 32/64 } >
        L: { car.design.components.armor.L }
      </text>
      <text x = { width * 48/64 } y = { length * 32/64 } >
        R: { car.design.components.armor.R }
      </text>
      <text x = { width * 16/64 } y = { length * 63/64 } >
        B: { car.design.components.armor.B }
      </text>
      <text x = { width * 36/64 } y = { length * 63/64 } >
        U: { car.design.components.armor.U }
      </text>
    </g>
  );
}


const Car = ({id, state, inset=false, ghost=false}) => {
  const temp_rect = ghost ? state.phasing.rect : state.rect;
  const collision_detected = ghost ? state.phasing.collision_detected : state.collision_detected;
  const opacity = ghost ? 1/2 : 1;

  const my_style = {
    fill: 'black',
    stroke: 'pink',
    strokeWidth: 5,
  };

  const body_style = {
    fill: state.color,
    stroke: 'black',
    strokeWidth: 3,
    opacity: opacity,
  };
  const roof_style = {
    fill: state.color,
    opacity: opacity,
  };
  const main_body_style = {
    fill: state.color,
    stroke: 'black',
    strokeWidth: 2,
    opacity: opacity,
  };
  const glass_style = {
    fill: 'white',
    stroke: 'gray',
    strokeWidth: 3,
    opacity: opacity,
  };
  const many_colored_fill = () => {
    if (collision_detected) { return 'red'; }
    if (ghost) { return 'yellow'; }
    return 'white';
  }
  const outline_style = {
    fill: many_colored_fill(),
    stroke: 'black',
    strokeWidth: 3,
    opacity: collision_detected ? 1 : opacity,
  };


  const margin = temp_rect.width /6;
  const smidge = temp_rect.width /15; // bug?
  const hood_length = 6 * margin;
  const windshield_margin = 2 * margin - smidge/2;
  const roof_length = 3 * margin;
  const roof_width = temp_rect.width - ( 1.75 * windshield_margin);

  var rotate_point = { x: temp_rect.BR_point().x,
                       y: temp_rect.BR_point().y };
  // BUGBUG: Why + 90 degree rotation
  var transform = `rotate(${ temp_rect.facing + 90 },
                          ${ rotate_point.x },
                          ${ rotate_point.y })`;

  const show_inset = () => {
    if (inset) {
      return (<InsetLayout car={state} length={temp_rect.length} width={temp_rect.width} />);
    }
  }

const changeDimensions = () => {
  console.log("I AM HERE!!");
}

  return (
    <g id={id } >
      { /* outline */ }
      <rect
        x = { temp_rect.BR_point().x - temp_rect.width }
        y = { temp_rect.BR_point().y - temp_rect.length }
        width = { temp_rect.width }
        height = { temp_rect.length }
        style = { outline_style }
        transform = { transform }
      />
      { /* body */ }
      <rect
        rx = { temp_rect.width/4 }
        x = { temp_rect.BR_point().x - temp_rect.width + margin }
        y = { temp_rect.BR_point().y - temp_rect.length + 2 * margin }
        width = { temp_rect.width - 2 * margin }
        height = { temp_rect.length - 3 * margin }
        style = { main_body_style }
        transform = { transform }
      />
      { /* windshield/back window */ }
      <rect
        rx = { temp_rect.width/8 }
        x = { temp_rect.BR_point().x - temp_rect.width + windshield_margin }
        y = { temp_rect.BR_point().y - temp_rect.length + 5.5 * margin }
        width = { temp_rect.width - 2 * windshield_margin }
        height = { 1.5 * roof_length }
        style = { glass_style }
        transform = { transform }
      />
      { /* side windows */ }
      <rect
        rx = { temp_rect.width /8 }
        x = { temp_rect.BR_point().x - temp_rect.width/2 - (roof_width +  smidge)/2 }
        y = { temp_rect.BR_point().y - temp_rect.length + hood_length + 2 * smidge }
        width = { roof_width +  smidge }
        height = { roof_length - smidge }
        style = { glass_style }
        transform = { transform }
      />
      { /* roof */ }
      <rect
        rx = { temp_rect.width /8 }
        x = { temp_rect.BR_point().x - temp_rect.width/2 - roof_width/2 }
        y = { temp_rect.BR_point().y - temp_rect.length + hood_length + smidge*3/2 }
        width = { roof_width  }
        height = { roof_length }
        style = { roof_style }
        transform = { transform }
      />
      { /* front pip */ }
      <circle
        visibility = {(!inset) ? 'visible' : 'hidden' }
        cx = { temp_rect.BR_point().x - temp_rect.width / 2 }
        cy = { temp_rect.BR_point().y - temp_rect.length + 2 + smidge }
        r = { temp_rect.width/16 }
        style = { body_style }
        transform = { transform }
      />
     { show_inset() }
    </g>
  );
};

export default Car;
