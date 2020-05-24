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
        fill: 'darkslategray',
        stroke: 'black',
        strokeWidth: 2,
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

  render(): React.ReactNode {
    const x = this.left()
      ? 0.65 * GenericComponent.dimensions().width
      : this.props.carDimensions.width - 1.15 * GenericComponent.dimensions().width
    const y = this.front()
      ? 2.5 * GenericComponent.dimensions().height
      : this.props.carDimensions.height - 3 * GenericComponent.dimensions().height
    //(this.props.carDimensions.height * 18) / 64 : (this.props.carDimensions.height * 42) / 64
    const width = GenericComponent.dimensions().width / 2
    const height = GenericComponent.dimensions().height * 1.5

    return (
      <g>
        <rect
          rx={this.props.carDimensions.width / 32}
          x={x}
          y={y}
          width={width}
          height={height}
          style={this.tireStyle()}
        />
        <DamageBoxes
          tire={true}
          centerPoint={new Point({ x: x + width / 2, y: y + height / 2 })}
          edgeLength={width}
          dp={this.props.tireData.damagePoints}
          maxDp={this.props.tireData.maxDamagePoints}
        />
      </g>
    )
  }
}

export default Tire
