import * as React from 'react'
import Component from './GenericComponent'
import LocalMatchState from '../lib/LocalMatchState'

class Driver extends React.Component {
  render() {
    const lms = new LocalMatchState(this.props.matchData)
    const car = lms.car({ id: this.props.carId })

    const DP = lms.driver({ car }).damagePoints
    const x = (this.props.width * 23) / 64
    const y = (this.props.length * 34) / 64
    const component = new Component({ length: this.props.length, width: this.props.width })

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={component.width}
          height={component.length}
          style={DP < 1 ? component.style.red : component.style.default}
        />
        <text x={x} y={y + component.row1} dx={3 * component.indent()} style={component.style.name}>
          driver
        </text>
        <text x={x} y={y + component.row2} dx={component.centerX}>
          {DP}
        </text>
      </g>
    )
  }
}

export default Driver
