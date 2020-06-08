import * as React from 'react'
import GenericComponent from './GenericComponent'
import '../../../../../../../App.css'
import Dimensions from '../../../../../../../utils/Dimensions'
import Point from '../../../../../../../utils/geometry/Point'

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  carData: any
  carDimensions: Dimensions
}

class Plant extends React.Component<Props> {
  render(): React.ReactNode {
    return (
      <GenericComponent
        name={'plant'}
        dp={this.props.carData.design.components.powerPlant.damagePoints}
        maxDp={this.props.carData.design.components.powerPlant.maxDamagePoints}
        carDimensions={this.props.carDimensions}
        point={new Point({ x: 0, y: -0.15 * this.props.carDimensions.height })}
      />
    )
  }
}

export default Plant
