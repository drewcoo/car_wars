import * as React from 'react'
import GenericComponent from './GenericComponent'
import Point from '../../../../../../../utils/geometry/Point'
import Dimensions from '../../../../../../../utils/Dimensions'

interface Props {
  carDimensions: Dimensions
  point: Point
  poweredDown: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  weaponData: any
}

class Weapon extends React.Component<Props> {
  render(): React.ReactNode {
    const x = this.props.point.x
    const y = this.props.point.y

    return (
      <GenericComponent
        carDimensions={this.props.carDimensions}
        dp={this.props.weaponData.damagePoints}
        lcdText={this.props.weaponData.requiresPlant ? '--' : this.props.weaponData.ammo}
        maxDp={this.props.weaponData.maxDamagePoints}
        name={this.props.weaponData.abbreviation}
        point={new Point({ x, y })}
        poweredDown={this.props.poweredDown}
      />
    )
  }
}

export default Weapon
