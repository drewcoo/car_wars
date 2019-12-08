import React from 'react'
import { useSelector } from 'react-redux'
import { generic_component_style, generic_red_style } from './style'

// BUGBUG: This is a kludge to just get Killer Karts going.
export const FrontMG = ({ car, width, length }) => {
  const DP = car.design.components.weapons[0].damage_points
  return (
    <g>
      <rect
        x = { width * 23 / 64}
        y = { length * 10 / 64 }
        width = { width * 18 / 64 }
        height = { length * 9 / 64 }
        style = { DP < 1 ? generic_red_style : generic_component_style }
      />
      <text x={ width * 24 / 64 } y={ length * 14 / 64 }>mg { car.design.components.weapons[0].ammo }</text>
      <text x={ width * 30 / 64 } y={ length * 18 / 64 }> { DP } </text>
    </g>
  )
}
