import * as React from 'react'
import Damage from '../../../../../types/Damage'
// import Sound from 'react-sound'

interface Props {
  damage: Damage
}

class Whoosh extends React.Component<Props> {
  render(): React.ReactNode {
    console.log(this.props.damage)
    const point = this.props.damage.target.point
    return (
      <g key={`damage-${point.x}-${point.y}`} className={'MissedShot'} id="shotResult">
        <circle key="aaaarqqqqq" cx={point.x} cy={point.y} strokeDasharray="2" r={18} />
        <text key="aggggweeaa" x={point.x} y={point.y + 6} textAnchor={'middle'} className={'MissedShotText'}>
          miss
        </text>
      </g>
    )
  }
}

export default Whoosh
