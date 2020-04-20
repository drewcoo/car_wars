import * as React from 'react'

class RocketLauncher extends React.Component {
  fire({ source, target, duration=5 }) {
    let rotation = (Math.atan2((target.y - source.y), (target.x - source.x)) * 180 / Math.PI) - 90
    return (
      <g>
        <g id='rocketLauncher' transform={`rotate(${rotation})`}>
          <g id='rocket-flame'>
            <polygon points='-3,-15,2,-15,0,-28,1,-28'/>
            <polygon points='-2,-15,1,-15,0,-18,1,-18'/>
            <animate
              attributeType='XML'
              attributeName='fill'
              values='orange;red;orange;red;orangered;orange;orange;yellow'
              dur='0.3s'
              repeatCount='indefinite'/>
            <animate
              attributeType='XML'
              attributeName='stroke'
              values='yellow;orange;orange;yellow;lightyellow'
              dur='.03s'
              repeatCount='indefinite'/>
          </g>
          <g id='RLcylinder'>
            <rect height='12' x='-3' y='-9' width='5' fill='darkolivegreen' stroke='lightgreen'/>
          </g>
          <g id='RLnose'>
            <polygon points='-3,3,2,3,0,6,-1,6' fill='darkolivegreen' stroke='coral'/>
          </g>
        </g>
        <animateMotion begin='0.00s' dur={duration} repeatCount='indefinite'
          path={`M${source.x},${source.y} L${target.x},${target.y} `}/>
      </g>
    )
  }

  render() {
    let duration = this.props.duration || 1
    let source = this.props.sourcePoint
    let target = this.props.targetPoint

    return (
      <g key={`rocketLauncher-${source.x}-${source.y}-${target.x}-${target.y}`}>
        { this.fire({ duration, source, target}) }
      </g>
    )
  }
}

export default RocketLauncher
