import * as React from 'react'
import GenericComponent from './GenericComponent'
import Point from '../../../../../../../utils/geometry/Point'
import Dimensions from '../../../../../../../utils/Dimensions'

interface Props {
  carDimensions: Dimensions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  weaponData: any
  point: Point
}

class Weapon extends React.Component<Props> {
  render(): React.ReactNode {
    const x = this.props.point.x
    const y = this.props.point.y

    console.log(this.props.weaponData)
    return (
      <GenericComponent
        name={this.props.weaponData.abbreviation}
        lcdText={this.props.weaponData.ammo}
        dp={this.props.weaponData.damagePoints}
        maxDp={this.props.weaponData.maxDamagePoints}
        carDimensions={this.props.carDimensions}
        point={new Point({ x, y })}
      />
    )
  }
}

export default Weapon
