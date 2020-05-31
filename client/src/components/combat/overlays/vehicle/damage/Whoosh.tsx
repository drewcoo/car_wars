import * as React from 'react'
import Damage from '../../../../../types/Damage'
// import Sound from 'react-sound'

interface Props {
  damage: Damage
  followWeapon?: string
}

class Whoosh extends React.Component<Props> {
  durationMarkup(): React.ReactNode {
    if (!this.props.followWeapon) return <></>
    return (
      <>
        <animate
          attributeType="XML"
          attributeName="opacity"
          begin={`${this.props.followWeapon}.begin`}
          end={`${this.props.followWeapon}.end`}
          values="0"
        />
        <animate
          attributeType="XML"
          attributeName="opacity"
          begin={`${this.props.followWeapon}.end`}
          end={`${this.props.followWeapon}.begin`}
          values="1"
        />
      </>
    )
  }

  render(): React.ReactNode {
    const point = this.props.damage.target.point
    return (
      <g key={`damage-${point.x}-${point.y}`} className={'MissedShot'} id="shotResult">
        <circle key="aaaarqqqqq" cx={point.x} cy={point.y} strokeDasharray="2" r={18} />
        <text key="aggggweeaa" x={point.x} y={point.y + 6} textAnchor={'middle'} className={'MissedShotText'}>
          miss
        </text>
        {this.durationMarkup()}
      </g>
    )
  }
}

export default Whoosh
