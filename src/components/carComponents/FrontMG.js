import React from 'react'
import { genericComponentStyle, genericRedStyle } from './style'

// BUGBUG: This is a kludge to just get Killer Karts going.
export const FrontMG = ({ car, width, length }) => {
  const DP = car.design.components.weapons[0].damagePoints
  return (
    <g>
      <rect
        x = { width * 23 / 64}
        y = { length * 10 / 64 }
        width = { width * 18 / 64 }
        height = { length * 9 / 64 }
        style = { DP < 1 ? genericRedStyle : genericComponentStyle }
      />
      <text x={ width * 24 / 64 } y={ length * 14 / 64 }>mg { car.design.components.weapons[0].ammo }</text>
      <text x={ width * 30 / 64 } y={ length * 18 / 64 }> { DP } </text>
    </g>
  )
}
