import * as React from 'react'

class HeavyRocket extends React.Component {
  fire ({ source, target, duration = 5 }) {
    const rotation = (Math.atan2((target.y - source.y), (target.x - source.x)) * 180 / Math.PI) - 90
    return (
      <g>
        <g id='heavyRocket' transform={`rotate(${rotation})`}>
          <g id='rocket-flame'>
            <polygon points='-3,-15,2,-15,0,-38,1,-38'/>
            <polygon points='-2,-15,1,-15,0,-28,1,-28'/>
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
          <g id='HRcylinder'>
            <rect height='30' x='-3' y='-12' width='5' fill='green'/>
          </g>
          <g id='HRfins'>
            <polygon points='-7,-12,-3,-12,-3,-3' fill='blue'/>
            <polygon points='6,-12,2,-12,2,-3' fill='blue'/>
          </g>
          <g id='HRnose'>
            <polygon points='-3,18,2,18,0,25,-1,25' fill='blue'/>
          </g>
        </g>
        <animateMotion begin='0.00s' dur={duration} repeatCount='indefinite'
          path={`M${source.x},${source.y} L${target.x},${target.y} `}/>
      </g>
    )
  }

  render () {
    const duration = this.props.duration || 1
    const source = this.props.sourcePoint
    const target = this.props.targetPoint

    return (
      <g key={`heavyRocket-${source.x}-${source.y}-${target.x}-${target.y}`}>
        { this.fire({ duration, source, target }) }
      </g>
    )
  }
}

export default HeavyRocket
