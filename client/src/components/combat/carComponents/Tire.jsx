import * as React from 'react'
import Component from './GenericComponent'
import '../../../App.css'
import LocalMatchState from '../lib/LocalMatchState'

class Tire extends React.Component {
  locationName () {
    var result = this.props.front ? 'F' : 'B'
    result += this.props.left ? 'L' : 'R'
    return result
  }

  textX (left) {
    // left : right
    return left ? this.props.width * 9 / 64 : this.props.width * 50 / 64
  }

  textY (front) {
    // front : back
    return front ? this.props.length * 25 / 64 : this.props.length * 49 / 64
  }

  tireStyle (tire) {
    const component = new Component({ width: this.props.width, length: this.props.length })
    if (tire.damagePoints >= 1) { return component.style.default }
    if (tire.wheelExists) { return component.style.yellow }
    return component.style.red
  }

  render () {
    const car = new LocalMatchState(this.props.matchData).activeCar()
    const tire = car.design.components.tires.find(thisTire => thisTire.location === this.locationName())

    return (
      <g>
        <rect
          rx = { this.props.width / 32 }
          x = { this.props.left ? this.props.width * 8 / 64 : this.props.width * 49 / 64}
          y = { this.props.front ? this.props.length * 18 / 64 : this.props.length * 42 / 64 }
          width = { this.props.width * 7 / 64 }
          height = { this.props.length * 11 / 64 }
          style = { this.tireStyle(tire) }
        />
        <text x={ this.textX(this.props.left) } y={ this.textY(this.props.front) }> { tire.damagePoints } </text>
      </g>
    )
  }
}

export default Tire
