import * as React from 'react'
import Dimensions from '../../../../../../../utils/Dimensions'
import Point from '../../../../../../../utils/geometry/Point'
import DamageBoxes from './DamageBoxes'

interface Props {
  tire?: boolean
  name?: string
  ammo?: number
  dp: number
  maxDp: number
  point: Point
  carDimensions: Dimensions
}

class GenericComponent extends React.Component<Props> {
  static fontPx(): number {
    return 14
  }

  static dimensions(): Dimensions {
    const side = GenericComponent.fontPx() * 3
    return new Dimensions({ length: side, width: side })
  }

  render(): React.ReactNode {
    const row1 = GenericComponent.fontPx() + 1
    const row2 = 2 * GenericComponent.fontPx()

    const style = {
      ammo: {
        font: 'bold 18px Monaco',
        fill: 'limegreen',
        stroke: 'chartreuse',
      },
      default: {
        fill: 'white',
        stroke: 'black',
        strokeWidth: 2,
      },
      name: {
        fontSize: `${GenericComponent.fontPx()}px`, // default is 24
        fontFamily: 'fantasy',
        fontVariant: 'small-caps',
      },
      red: {
        fill: 'red',
        stroke: 'black',
        strokeWidth: 2,
      },
      yellow: {
        fill: 'yellow',
        stroke: 'black',
        strokeWidth: 2,
      },
    }

    const centerX = this.props.carDimensions.width / 2
    const centerY = this.props.carDimensions.height / 2

    const x = centerX + this.props.point.x - GenericComponent.dimensions().width / 2
    const y = centerY + this.props.point.y - GenericComponent.dimensions().height / 2

    const destroyed = this.props.dp < 1

    return (
      <svg>
        <rect
          x={x}
          y={y}
          width={GenericComponent.dimensions().width}
          height={GenericComponent.dimensions().height}
          style={destroyed ? style.red : style.default}
        />
        <text textAnchor="middle" x={x + GenericComponent.dimensions().width / 2} y={y + row1} style={style.name}>
          {this.props.name}
        </text>
        <text textAnchor="middle" x={x + GenericComponent.dimensions().height / 2} y={y + row2} style={style.ammo}>
          {destroyed ? '' : this.props.ammo}
        </text>
        <DamageBoxes
          centerPoint={
            new Point({
              x: x + GenericComponent.dimensions().width / 2,
              y: y + GenericComponent.dimensions().height / 2,
            })
          }
          edgeLength={GenericComponent.dimensions().width} /* because they're square */
          dp={this.props.dp}
          maxDp={this.props.maxDp}
        />
      </svg>
    )
  }
}

export default GenericComponent
