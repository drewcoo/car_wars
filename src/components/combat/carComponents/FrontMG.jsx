import * as React from 'react'
import {connect} from "react-redux"
import Component from './GenericComponent'
import MatchWrapper from '../../../utils/wrappers/MatchWrapper'
import '../../../App.css'

const mapStateToProps = (state) => {
  return({ matches: state.matches })
}

class FrontMG extends React.Component {
  // props.matchId
  // props.width
  // props.length

  render() {
    const car = new MatchWrapper({ match: this.props.matches[this.props.matchId] }).currentCar()

    // BUGBUG: This is a kludge to just get Killer Karts going.
    const weaponIndex = 1
    const DP = car.design.components.weapons[weaponIndex].damagePoints
    const ammo = car.design.components.weapons[weaponIndex].ammo
    const name = car.design.components.weapons[weaponIndex].abbreviation

    const x = this.props.width * 23 / 64
    const y = this.props.length * 10 / 64

    const component = new Component({ length: this.props.length, width: this.props.width })

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

export default connect(mapStateToProps)(FrontMG)
