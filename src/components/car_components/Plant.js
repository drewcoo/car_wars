import React from 'react'
// import Car from './Car';
import { useSelector } from 'react-redux'
import { generic_component_style, generic_red_style } from './style'

export const Plant = ({ car, width, length }) => {
  const DP = car.design.components.power_plant.damage_points
  return (
    <g>
      <rect
        x = { width * 24 / 64}
        y = { length * 21 / 64 }
        width = { width * 16 / 64 }
        height = { length * 8 / 64 }
        style = { DP < 1 ? generic_red_style : generic_component_style }
      />
      <text x={ width * 25 / 64 } y={ length * 24 / 64 }>plant</text>
      <text x={ width * 30 / 64 } y={ length * 28 / 64 }> { DP } </text>
    </g>
  )
}
