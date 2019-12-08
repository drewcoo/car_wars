import React from 'react'
import { useSelector } from 'react-redux'
import { generic_component_style, generic_red_style } from './style'

export const Tire = ({ car, length, width, front, left }) => {
  const location_name = () => {
    var result = front ? 'F' : 'B'
    result += left ? 'L' : 'R'
    return result
  }

  const text_x = (left) => {
    // left / right
    return left ? width * 11 / 64 : width * 48 / 64
  }

  const text_y = (front) => {
    // front / back
    return front ? length * 25 / 64 : length * 49 / 64
  }

  const DP = car.design.components.tires.find(function (tire) { return tire.location === location_name(front, left) }).damage_points

  return (
    <g>
      <rect
        rx = { width / 32 }
        x = { left ? width * 10 / 64 : width * 46 / 64}
        y = { front ? length * 18 / 64 : length * 42 / 64 }
        width = { width * 8 / 64 }
        height = { length * 11 / 64 }
        style = { DP < 1 ? generic_red_style : generic_component_style }
      />
      <text x={ text_x(left) } y={ text_y(front) }> { DP } </text>
    </g>
  )
}
