import React from 'react'
import Tire from './Tire'
import Dimensions from '../../../../../../../utils/Dimensions'

interface TireData {
  damagePoints: number
  maxDamagePoints: number
  location: string
  type: string
  wheelExists: boolean
}

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  carData: any
  carDimensions: Dimensions
}

class AllTires extends React.Component<Props> {
  tires(): React.ReactNode {
    const result: any = []
    this.props.carData.design.components.tires.forEach((tire: TireData) => {
      result.push(<Tire tireData={tire} carDimensions={this.props.carDimensions} />)
    })
    return <>{result}</>
  }
  render(): React.ReactNode {
    return <>{this.tires()}</>
  }
}

export default AllTires
