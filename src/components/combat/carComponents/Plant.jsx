import * as React from 'react'
import {connect} from "react-redux"
import Component from './GenericComponent'
import MatchWrapper from '../../../utils/wrappers/MatchWrapper'
import '../../../App.css'

const mapStateToProps = (state) => {
  return({ matches: state.matches })
}

class Plant extends React.Component {
  // props.matchId
  // props.width
  // props.length

  render() {
    const car = new MatchWrapper({ match: this.props.matches[this.props.matchId] }).currentCar()
    const DP = car.design.components.power_plant.damagePoints
    const x = this.props.width * 24 / 64
    const y = this.props.length * 21 / 64
    const component = new Component({ width: this.props.width, length: this.props.length })

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
}

export default connect(mapStateToProps)(Plant)
