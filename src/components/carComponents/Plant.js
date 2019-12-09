import React from 'react'
import { genericComponentStyle, genericRedStyle } from './style'

export const Plant = ({ car, width, length }) => {
  const DP = car.design.components.power_plant.damagePoints
  return (
    <g>
      <rect
        x = { width * 24 / 64}
        y = { length * 21 / 64 }
        width = { width * 16 / 64 }
        height = { length * 8 / 64 }
        style = { DP < 1 ? genericRedStyle : genericComponentStyle }
      />
      <text x={ width * 25 / 64 } y={ length * 24 / 64 }>plant</text>
      <text x={ width * 30 / 64 } y={ length * 28 / 64 }> { DP } </text>
    </g>
  )
}
