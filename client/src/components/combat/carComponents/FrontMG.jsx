import * as React from 'react'
import Component from './GenericComponent'
import '../../../App.css'
import LocalMatchState from '../lib/LocalMatchState'

class FrontMG extends React.Component {
  render() {
    const car = new LocalMatchState(this.props.matchData).currentCar()

    // BUGBUG: This is a kludge to just get Killer Karts going.
    const weaponIndex = 1
    const DP = car.design.components.weapons[weaponIndex].damagePoints
    const ammo = car.design.components.weapons[weaponIndex].ammo
    const name = car.design.components.weapons[weaponIndex].abbreviation

    const x = this.props.width * 23 / 64
    const y = this.props.length * 10 / 64

    const component = new Component({ length: this.props.length, width: this.props.width })

/*
<rect
  x = { x + 10 }
  y = { y + (component.row1 + component.row2)/2 }
  width = { 10 }
  height = { 10 }
  style = { component.style.default }
/>
<rect
  x = { x + 20 }
  y = { y + (component.row1 + component.row2)/2 }
  width = { 10 }
  height = { 10 }
  style = { component.style.default }
/>
<rect
  x = { x + 30 }
  y = { y + (component.row1 + component.row2)/2 }
  width = { 10 }
  height = { 10 }
  style = { component.style.default }
/>
*/

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
}

export default FrontMG
