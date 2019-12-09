import React from 'react'
import { genericComponentStyle, genericRedStyle } from './style'

export const Driver = ({ car, width, length }) => {
  const DP = car.design.components.crew.driver.damagePoints
  return (
    <g>
      <rect
        x = { width * 23 / 64}
        y = { length * 34 / 64 }
        width = { width * 18 / 64 }
        height = { length * 8 / 64 }
        style = { DP < 1 ? genericRedStyle : genericComponentStyle }
      />
      <text x={ width * 24 / 64 } y={ length * 37 / 64 }>driver</text>
      <text x={ width * 30 / 64 } y={ length * 41 / 64 }> { DP } </text>
    </g>
  )
}
