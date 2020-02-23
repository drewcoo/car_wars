import * as React from 'react'
import Component from './GenericComponent'
import '../../../App.css'
import LocalMatchState from '../lib/LocalMatchState'

class Tire extends React.Component {
  locationName() {
    var result = this.props.front ? 'F' : 'B'
    result += this.props.left ? 'L' : 'R'
    return result
  }

  textX(left) {
    // left : right
    return left ? this.props.width * 11 / 64 : this.props.width * 48 / 64
  }

  textY(front) {
    // front : back
    return front ? this.props.length * 25 / 64 : this.props.length * 49 / 64
  }

  render() {
    const component = new Component({ width: this.props.width, length: this.props.length })
    const car = new LocalMatchState(this.props.matchData).currentCar()
    const DP = car.design.components.tires.find(tire => tire.location === this.locationName()).damagePoints

    return (
      <g>
        <rect
          rx = { this.props.width / 32 }
          x = { this.props.left ? this.props.width * 10 / 64 : this.props.width * 46 / 64}
          y = { this.props.front ? this.props.length * 18 / 64 : this.props.length * 42 / 64 }
          width = { this.props.width * 8 / 64 }
          height = { this.props.length * 11 / 64 }
          style = { DP < 1 ? component.style.red : component.style.default }
        />
        <text x={ this.textX(this.props.left) } y={ this.textY(this.props.front) }> { DP } </text>
      </g>
    )
  }
}

export default Tire
