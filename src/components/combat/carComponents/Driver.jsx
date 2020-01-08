import * as React from 'react'
import {connect} from "react-redux"
import MatchWrapper from '../../../utils/wrappers/MatchWrapper'
import Component from './GenericComponent'

const mapStateToProps = (state) => {
  return({ matches: state.matches })
}

class Driver extends React.Component {
  // props.matchId
  // props.width
  // props.length

  render() {
    const car = new MatchWrapper(this.props.matches[this.props.matchId]).currentCar()
    const DP = car.design.components.crew.driver.damagePoints
    const x = this.props.width * 23 / 64
    const y = this.props.length * 34 / 64
    const component = new Component({ length: this.props.length, width: this.props.width })

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
}

export default connect(mapStateToProps)(Driver)
