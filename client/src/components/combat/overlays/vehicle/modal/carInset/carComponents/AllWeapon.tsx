import * as React from 'react'
import '../../../../../../../App.css'
import Weapon from './Weapon'
import Dimensions from '../../../../../../../utils/Dimensions'
import Point from '../../../../../../../utils/geometry/Point'

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  carData: any
  carDimensions: Dimensions
}

interface WeaponData {
  abbreviation: string
  ammo: number
  damage: string
  damagePoints: number
  effect: string
  firedThisTurn: boolean
  location: string
  requiresPlant: boolean
  toHit: number
  type: string
}

class AllWeapons extends React.Component<Props> {
  fontSize: number
  componentEdge: number
  centerX: number
  centerY: number
  constructor(props: Props) {
    super(props)
    this.fontSize = 14
    this.componentEdge = 3 * this.fontSize
    this.centerX = this.props.carDimensions.width / 2
    this.centerY = this.props.carDimensions.length / 2
    /// - (1.5 * this.fontSize)
  }
  frontWeapons(): React.ReactNode {
    const weapons = this.props.carData.design.components.weapons.filter((weapon: WeaponData) => weapon.location === 'F')
    if (weapons.length === 0) return <></>
    const point = new Point({ x: 0, y: -0.36 * this.props.carDimensions.height })
    const weaponData = weapons[0]
    return (
      <Weapon
        carDimensions={this.props.carDimensions}
        poweredDown={this.props.carData.design.components.powerPlant.damagePoints <= 0}
        weaponData={weaponData}
        point={point}
      />
    )
  }

  leftWeapons(): React.ReactNode {
    const weapons = this.props.carData.design.components.weapons.filter((weapon: WeaponData) => weapon.location === 'L')
    if (weapons.length === 0) return <></>
    const point = new Point({ x: -0.25 * this.props.carDimensions.width, y: 0 * this.props.carDimensions.height })
    const weaponData = weapons[0]
    return (
      <Weapon
        carDimensions={this.props.carDimensions}
        poweredDown={this.props.carData.design.components.powerPlant.damagePoints <= 0}
        weaponData={weaponData}
        point={point}
      />
    )
  }

  rightWeapons(): React.ReactNode {
    const weapons = this.props.carData.design.components.weapons.filter((weapon: WeaponData) => weapon.location === 'R')
    if (weapons.length === 0) return <></>
    const point = new Point({ x: 0.25 * this.props.carDimensions.width, y: 0 * this.props.carDimensions.height })
    const weaponData = weapons[0]
    return (
      <Weapon
        carDimensions={this.props.carDimensions}
        poweredDown={this.props.carData.design.components.powerPlant.damagePoints <= 0}
        weaponData={weaponData}
        point={point}
      />
    )
  }

  backWeapons(): React.ReactNode {
    const weapons = this.props.carData.design.components.weapons.filter((weapon: WeaponData) => weapon.location === 'B')
    if (weapons.length === 0) return <></>
    const point = new Point({ x: 0, y: 0.36 * this.props.carDimensions.height })
    const weaponData = weapons[0]
    return (
      <Weapon
        carDimensions={this.props.carDimensions}
        poweredDown={this.props.carData.design.components.powerPlant.damagePoints <= 0}
        weaponData={weaponData}
        point={point}
      />
    )
  }

  render(): React.ReactNode {
    // BUGBUG: This is a kludge to just get Killer Karts going.

    return (
      <g>
        {this.frontWeapons()}
        {this.leftWeapons()}
        {this.rightWeapons()}
        {this.backWeapons()}
      </g>
    )
  }
}

export default AllWeapons
