import * as React from 'react'

class MachineGun extends React.Component {
  volley({ source, target, duration=5 }) {
  console.log('fire MG')

    let result = [0, 0.07, 0.14, 0.21, 0.28].map(beginTime => {
      return (
        <circle key={`volley-${source.x}-${source.y}-${target.x}-${target.y}-${beginTime}`} r="2" fill="gray" stroke="black">
          <animateMotion
            begin={`${beginTime}s; volley-${source.x}-${source.y}-${target.x}-${target.y}-anim2.end`}
            dur={`${duration}s`}
            path={`M${source.x},${source.y} L${target.x},${target.y}`}
            repeatCount='indefinite'
          />
        </circle>
      )
    })
    return (result)
  }

  render() {
    let duration = this.props.duration || 1
    let source = this.props.sourcePoint
    let target = this.props.targetPoint

    return (
      <g key={`machineGun-${source.x}-${source.y}-${target.x}-${target.y}`}>
        { this.volley({ duration, source, target}) }
      </g>
    )
  }
}

export default MachineGun
