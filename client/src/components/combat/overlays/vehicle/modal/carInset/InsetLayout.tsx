import React from 'react'
import Driver from './carComponents/Driver'
import AllWeapons from './carComponents/AllWeapon'
import Plant from './carComponents/Plant'
import '.././../../../../../App.css'
import AllArmor from './carComponents/AllArmor'
import AllTires from './carComponents/AllTires'
import LocalMatchState from '../../../../lib/LocalMatchState'
import Dimensions from '../../../../../../utils/Dimensions'

interface Props {
  carId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  matchData: any
  carDimensions: Dimensions
}

class InsetLayout extends React.Component<Props> {
  render(): React.ReactNode {
    const carData = new LocalMatchState(this.props.matchData).car({ id: this.props.carId })
    return (
      <g>
        <AllArmor carData={carData} carDimensions={this.props.carDimensions} />
        <AllTires carData={carData} carDimensions={this.props.carDimensions} />
        <Plant carData={carData} carDimensions={this.props.carDimensions} />
        <AllWeapons carData={carData} carDimensions={this.props.carDimensions} />
        <Driver carId={this.props.carId} matchData={this.props.matchData} carDimensions={this.props.carDimensions} />
      </g>
    )
  }
}

export default InsetLayout
