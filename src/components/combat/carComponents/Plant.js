import React from 'react'
import Component from './GenericComponent'

export const Plant = ({ car, width, length }) => {
  const DP = car.design.components.power_plant.damagePoints
  const x = width * 24 / 64
  const y = length * 21 / 64
  const component = new Component({ width, length })
  return (
    <g>
      <rect
        x = {x }
        y = { y }
        width = { component.width }
        height = { component.length }
        style = { DP < 1 ? component.style.red : component.style.default }
      />
      <text
        x={ x }
        y={ y + component.row1 }
        dx={ 4 * component.indent() }
        style={ component.style.name }
      >
        plant
      </text>
      <text
        x={ x }
        y={ y + component.row2 }
        dx={ component.centerX }
      >
        { DP }
      </text>
    </g>
  )
}
