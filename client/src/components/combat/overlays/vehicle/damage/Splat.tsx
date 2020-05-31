import * as React from 'react'
import Damage from '../../../../../types/Damage'
// import Sound from 'react-sound'

interface Props {
  damage: Damage
  followWeapon?: string
}

class Splat extends React.Component<Props> {
  polylineStar({
    x,
    y,
    pointCount,
    offset = 0,
    radiusMultiplier = 1,
  }: {
    x: number
    y: number
    pointCount: number
    offset?: number
    radiusMultiplier?: number
  }): string {
    function inner(radians: number): string {
      const radius = 10 + Math.random() * 5
      return `${x + radius * Math.cos(radians)},${y + radius * Math.sin(radians)} `
    }

    function outer(radians: number): string {
      const radius = radiusMultiplier * (10 + Math.random() * 5)
      return `${x + radius * Math.cos(radians)},${y + radius * Math.sin(radians)} `
    }

    let result = ''
    for (let i = 0; i < pointCount; i++) {
      const innerRads = 2 * Math.PI * (i / pointCount + offset)
      result += inner(innerRads)
      const outerRads = 2 * Math.PI * ((i + 0.5) / pointCount + offset)
      result += outer(outerRads)
    }
    result += inner(0)
    return result
  }

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
    const damage = this.props.damage.target.damage
    const offset = (2 * Math.PI) / 10
    return (
      <svg key={`damage-${point.x}-${point.y}`} className={'Damage'} id="shotResult">
        <polyline
          points={`${this.polylineStar({
            x: point.x,
            y: point.y,
            pointCount: 8,
            offset: 0.3 * offset,
            radiusMultiplier: 1.4,
          })}`}
          fill={'yellow'}
        />
        <polyline
          points={`${this.polylineStar({ x: point.x, y: point.y, pointCount: 8, offset: offset })}`}
          fill={'red'}
        />
        <polyline
          points={`${this.polylineStar({ x: point.x, y: point.y, pointCount: 8, radiusMultiplier: 0.8 })}`}
          fill={'orange'}
        />
        <circle cx={point.x} cy={point.y} r={15} fill={'white'}></circle>
        <text x={point.x} y={point.y + 7} textAnchor={'middle'} className={'DamageText'}>
          {damage}
        </text>
        {this.durationMarkup()}
      </svg>
    )
  }
}

export default Splat
