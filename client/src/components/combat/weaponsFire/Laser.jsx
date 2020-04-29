import * as React from 'react'

class Laser extends React.Component {
  fire ({ source, target, duration = 5 }) {
    const color = 'orange'
    return (
      <g id='laser'>
        <g id='laser-beam'>
          <line x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke={color} opacity='.2' strokeWidth='5'/>
          <line x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke={color} strokeWidth='1'/>
        </g>
        <animate
          attributeType='XML'
          attributeName='stroke-opacity'
          values='-1;0;0.3;0.4;0.5;0.6;0.7;0.8;0.9;1;-1'
          dur={`${duration / 2}s`}
          repeatCount='indefinite'/>
        <animate
          attributeType='XML'
          attributeName='opacity'
          values='-1;-1;-1;-1;-1;1;1;1'
          dur={`${duration}s`}
          repeatCount='indefinite'/>
      </g>
    )
  }

  render () {
    const duration = this.props.duration || 1
    const source = this.props.sourcePoint
    const target = this.props.targetPoint

    return (
      <g key={`laser-${source.x}-${source.y}-${target.x}-${target.y}`}>
        { this.fire({ duration, source, target }) }
      </g>
    )
  }
}

export default Laser
