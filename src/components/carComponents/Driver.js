import React from 'react'
import Component from './GenericComponent'

export const Driver = ({ car, width, length }) => {
  const DP = car.design.components.crew.driver.damagePoints

  const x = width * 23 / 64
  const y = length * 34 / 64

  const component = new Component({ length, width })

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
        dx={ 3 * component.indent() }
        style={ component.style.name }
      >
        driver
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
