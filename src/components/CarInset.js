import React from 'react'
// import Car from './Car';
import { useSelector } from 'react-redux'
import { INCH } from '../utils/constants'

import Point from '../utils/Point'

import { Driver } from './car_components/Driver'
import { Plant } from './car_components/Plant'
import { Tire } from './car_components/Tire'
import { FrontMG } from './car_components/FrontMG'

//
//
//
/// NEED TO fold this back together with Car.js and factor out common code.
//
//
//

/*
const CarInset = () => {
  const players = useSelector((state) => state.players);

  const current_player = players.all[players.current_index];

 // BUGBUG: Should select current car.
  const cars = useSelector((state) => state.cars);
  var car = cars.find(function(element) {
    return element.color === current_player.color;
  });

  // BUGBUG: I would rather pass height via CSS to the enclosing div.
  return (
    <svg id='CarInset' height={5*INCH} >
      <Car state={ car } inset={ true } />
    </svg>
  );
};
*/

const InsetLayout = ({ width, length, car }) => {
  const component_rect_style = {
    fill: 'white',
    stroke: 'black',
    strokeWidth: 2
  }

  const tire = (front, left) => {
    return (<Tire car={car} width={width} length={length} front={front} left={left} />)
  }

  const plant = () => {
    return (<Plant car={car} width={width} length={length} />)
  }

  const front_mg = () => {
    return (<FrontMG car={car} width={width} length={length} />)
  }

  const driver = () => {
    return (<Driver car={car} width={width} length={length} />)
  }

  return (
    <g>
      <text x = { width * 16 / 64 } y = { length * 9 / 64 } >
        F:{ car.design.components.armor.F }
      </text>
      <text x = { width * 38 / 64 } y = { length * 9 / 64 } >
        T:{ car.design.components.armor.T }
      </text>
      <text x = { width * 1 / 64 } y = { length * 36 / 64 } >
        L:{ car.design.components.armor.L }
      </text>
      <text x = { width * 63 / 64 } y = { length * 36 / 64 } textAnchor={'end'} >
        R:{ car.design.components.armor.R }
      </text>
      <text x = { width * 16 / 64 } y = { length * 63 / 64 } >
        B:{ car.design.components.armor.B }
      </text>
      <text x = { width * 38 / 64 } y = { length * 63 / 64 } >
        U:{ car.design.components.armor.U }
      </text>
      { tire(true, true) }
      { tire(true, false) }
      { tire(false, true) }
      { tire(false, false) }
      { plant() }
      { front_mg() }
      { driver() }
    </g>
  )
}

const CarInset = () => {
  const inset = true
  const id = 'inset'
  const scaling = 1 // inset ? 1 : 1;    ///5; //40/INCH : 1/10;

  const players = useSelector((state) => state.players)
  const current_player = players.all[players.current_index]
  // BUGBUG: Should select current car.
  const cars = useSelector((state) => state.cars)
  var car = cars.find(function (element) {
    return element.color === current_player.color
  })

  const state = car

  const ghost = false

  const temp_rect = ghost ? car.rect : car.phasing.rect

  var length = 400 // temp_rect.length * 5/80 * INCH;
  var width = 200 // temp_rect.width * 5/80 * INCH;
  const temp_BR_point = (inset) ? { x: width, y: length } : temp_rect.BR_point()
  const temp_facing = (inset) ? 0 : temp_rect.facing

  const opacity = ghost ? 1 / 2 : 1

  const body_style = {
    fill: car.color,
    stroke: 'black',
    strokeWidth: 5,
    opacity: opacity
  }
  const roof_style = {
    fill: car.color,
    opacity: opacity
  }
  const main_body_style = {
    fill: car.color,
    stroke: 'black',
    strokeWidth: 2,
    opacity: opacity
  }
  const glass_style = {
    fill: 'white',
    stroke: 'gray',
    strokeWidth: 3,
    opacity: opacity
  }
  const many_colored_fill = () => {
    if (car.phasing.collision_detected) { return 'red' }
    if (ghost) { return 'yellow' }
    return 'white'
  }
  const outline_style = {
    fill: many_colored_fill(),
    stroke: 'black',
    strokeWidth: 5,
    opacity: car.phasing.collision_detected ? 1 : opacity
  }

  const margin = width / 6
  const smidge = width / 15 // bug?
  const hood_length = 6 * margin
  const windshield_margin = 2 * margin - smidge / 2
  const roof_length = 3 * margin
  const roof_width = width - (1.75 * windshield_margin)

  var rotate_point = {
    x: temp_BR_point.x,
    y: temp_BR_point.y
  }
  var transform = `rotate(${temp_facing},
                          ${rotate_point.x},
                          ${rotate_point.y}),
                   scale(${scaling}, ${scaling})`

  const show_inset = () => {
    if (inset) {
      return (<InsetLayout car={car} length={length} width={width} />)
    }
  }

  return (

    <svg id='CarInset' height={400} >
      <g id={id } >
        { /* outline */ }
        <rect
          x = { temp_BR_point.x - width }
          y = { temp_BR_point.y - length }
          width = { width }
          height = { length }
          style = { outline_style }
          transform = { transform }
        />
        { /* body */ }
        <rect
          rx = { width / 4 }
          x = { temp_BR_point.x - width + margin }
          y = { temp_BR_point.y - length + 2 * margin }
          width = { width - 2 * margin }
          height = { length - 3 * margin }
          style = { main_body_style }
          transform = { transform }
        />
        { /* windshield/back window */ }
        <rect
          rx = { width / 8 }
          x = { temp_BR_point.x - width + windshield_margin }
          y = { temp_BR_point.y - length + 5.5 * margin }
          width = { width - 2 * windshield_margin }
          height = { 1.5 * roof_length }
          style = { glass_style }
          transform = { transform }
        />
        { /* side windows */ }
        <rect
          rx = { width / 8 }
          x = { temp_BR_point.x - width / 2 - (roof_width + smidge) / 2 }
          y = { temp_BR_point.y - length + hood_length + 2 * smidge }
          width = { roof_width + smidge }
          height = { roof_length - smidge }
          style = { glass_style }
          transform = { transform }
        />
        { /* roof */ }
        <rect
          rx = { width / 8 }
          x = { temp_BR_point.x - width / 2 - roof_width / 2 }
          y = { temp_BR_point.y - length + hood_length + smidge * 3 / 2 }
          width = { roof_width }
          height = { roof_length }
          style = { roof_style }
          transform = { transform }
        />
        { /* front pip */ }
        <circle
          visibility = {(!inset) ? 'visible' : 'hidden' }
          cx = { temp_BR_point.x - width / 2 }
          cy = { temp_BR_point.y - length + 2 + smidge }
          r = { width / 16 }
          style = { body_style }
          transform = { transform }
        />
        { show_inset() }
        { /* sample text label on map */ }
        <text
          x = { temp_BR_point.x - width }
          y = { temp_BR_point.y - length + length / 2 + (-3 / 4 * length) }
          transform = { transform }
          fontSize = { 5 * INCH }
          fontWeight = 'bold'
          stroke = 'black'
        >
          { `real: (${car.rect.BR_point().x / INCH}, ${car.rect.BR_point().y / INCH})\n` }
          { `ghost: (${car.phasing.rect.BR_point().x / INCH}, ${car.phasing.rect.BR_point().y / INCH})` }
        </text>
      </g>
    </svg>
  )
}

export default CarInset
