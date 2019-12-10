import React from 'react'
import Component from './GenericComponent'

// BUGBUG: This is a kludge to just get Killer Karts going.
export const FrontMG = ({ car, width, length }) => {
  const weaponIndex = 1
  const DP = car.design.components.weapons[weaponIndex].damagePoints
  const ammo = car.design.components.weapons[weaponIndex].ammo
  const name = car.design.components.weapons[weaponIndex].abbreviation

  const x = width * 23 / 64
  const y = length * 10 / 64

  const component = new Component({ length, width })

  return (
    <g>
      <rect
        x = { x }
        y = { y }
        width = { component.width }
        height = { component.length }
        style = { DP < 1 ? component.style.red : component.style.default }
      />
      <text
        x={ x }
        y={ y + component.row1 }
        dx={ component.indent() }
        style={ component.style.name }>
        { name } { ammo }
      </text>
      <text
        x={ x }
        y={ y + component.row2 }
        dx={ component.centerX }>
        { DP }
      </text>
    </g>
  )
}
