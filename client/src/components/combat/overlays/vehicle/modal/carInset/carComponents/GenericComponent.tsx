import * as React from 'react'
import Dimensions from '../../../../../../../utils/Dimensions'
import Point from '../../../../../../../utils/geometry/Point'
import DamageBoxes from './DamageBoxes'
import '../../../../../../../App.css'

interface Props {
  tire?: boolean
  name?: string
  lcdText?: number
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
    const row2 = 2 * GenericComponent.fontPx() + 3

    const style = {
      lcdDisplay: {
        stroke: 'black',
        fill: '#669900',
      },
      lcdPoweredOff: {
        fill: '#666666',
      },
      lcdText: {
        fill: 'black',
        fontFamily: 'Segment7Standard',
      },
      lcdTextPoweredOff: {
        fill: '#818181',
        fontFamily: 'Segment7Standard',
      },
      default: {
        stroke: 'black',
        strokeWidth: 2,
        fill: 'floralwhite',
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

    let lcd = <></>
    if (this.props.lcdText) {
      lcd = (
        <>
          <rect
            x={x + 8}
            y={y + row1 + 3}
            width={GenericComponent.dimensions().width - 16}
            height={GenericComponent.fontPx()}
            style={destroyed ? style.lcdPoweredOff : style.lcdDisplay}
          />
          <text
            textAnchor="middle"
            x={x + GenericComponent.dimensions().height / 2}
            y={y + row2}
            style={destroyed ? style.lcdTextPoweredOff : style.lcdText}
          >
            {destroyed ? '88' : this.props.lcdText}
          </text>
        </>
      )
    }

    return (
      <svg>
        <rect
          x={x}
          y={y}
          width={GenericComponent.dimensions().width}
          height={GenericComponent.dimensions().height}
          style={destroyed ? style.red : style.default}
        />
        {lcd}
        <text textAnchor="middle" x={x + GenericComponent.dimensions().width / 2} y={y + row1} style={style.name}>
          {this.props.name}
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
          tire={this.props.tire}
          maxDp={this.props.maxDp}
        />
      </svg>
    )
  }
}

export default GenericComponent
