import * as React from 'react'
import '../../../../../../../App.css'
import Dimensions from '../../../../../../../utils/Dimensions'
import DamageBoxes from './DamageBoxes'
import Point from '../../../../../../../utils/geometry/Point'
import GenericComponent from './GenericComponent'

interface TireData {
  damagePoints: number
  maxDamagePoints: number
  location: string
  type: string
  wheelExists: boolean
}
interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tireData: TireData
  carDimensions: Dimensions
}

class Tire extends React.Component<Props> {
  left(): boolean {
    return this.props.tireData.location.match(/L/) !== null
  }

  front(): boolean {
    return this.props.tireData.location.match(/F/) !== null
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tireStyle(): any {
    if (this.props.tireData.damagePoints >= 1) {
      return {
        fill: 'black',
        stroke: 'black',
        strokeWidth: 1,
      }
    }
    if (this.props.tireData.wheelExists) {
      return {
        fill: 'yellow',
        stroke: 'black',
        strokeWidth: 2,
      }
    }
    return {
      fill: 'red',
      stroke: 'black',
      strokeWidth: 2,
    }
  }

  treadStyle(): any {
    return {
      fill: 'url(#pattern-chevron)',
        stroke: '#000000',
        strokeWidth: 1, 
    }
  }

  render(): React.ReactNode {
    const x = this.left()
      ? 0.5 * GenericComponent.dimensions().width
      : this.props.carDimensions.width - 1.25 * GenericComponent.dimensions().width
    const y = this.front()
      ? 2.5 * GenericComponent.dimensions().height
      : this.props.carDimensions.height - 3 * GenericComponent.dimensions().height
    //(this.props.carDimensions.height * 18) / 64 : (this.props.carDimensions.height * 42) / 64
    const width = GenericComponent.dimensions().width * 0.75
    const height = GenericComponent.dimensions().height * 1.6

    const boxSide = GenericComponent.dimensions().width / 5
    const centerY = y + height / 2 + boxSide * ((this.props.tireData.maxDamagePoints / 7) % 2) + boxSide / 2

    return (
      <svg>
        <defs>
          <pattern
            id="pattern-chevron"
            x="0"
            y="0"
            patternUnits="userSpaceOnUse"
            width="5"
            height="7.5"
            viewBox="0 0 10 10"
          >
            <g id="chevron">
              <path className="left" d="M0 0l5 3v5l-5 -3z" fill='#222222' />
              <path className="right" d="M10 0l-5 3v5l5 -3" fill='#222222' />
            </g>
            <use x="0" y="9" href="#chevron" />
          </pattern>
        </defs>

        <rect
          rx={this.props.carDimensions.width / 32}
          x={x}
          y={y}
          width={width * 1}
          height={height}
          style={this.tireStyle()}
        />

        <rect
          rx={this.props.carDimensions.width / 32}
          x={x}
          y={y}
          width={width * 1}
          height={height}
          style={this.treadStyle()}
        />
        <DamageBoxes
          tire={true}
          centerPoint={new Point({ x: x + width / 2, y: centerY })}
          boxSide={width / 5}
          edgeLength={width}
          dp={this.props.tireData.damagePoints}
          maxDp={this.props.tireData.maxDamagePoints}
        />
      </svg>
    )
  }
}

export default Tire
