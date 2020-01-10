import WeaponWrapper from './WeaponWrapper'
import MatchWrapper from './MatchWrapper'
//
// Hand it a store and a match id and it will give you helper functions
// for your match.
//
class CarWrapper {
  data: any
  match: MatchWrapper

  color: string
  design: any
  id: string
  name: string
  phasing: any
  playerId: string
  status: any
  rect: any
  constructor({ car, match }: { car: any, match: MatchWrapper }) {
    this.data = car
    this.match = match

    this.color = this.data.color
    this.design = this.data.design
    this.id = this.data.id
    this.name = this.data.name
    this.phasing = this.data.phasing
    this.playerId = this.data.playerId
    this.status = this.data.status
    this.rect = this.data.rect
  }

  weapons(): any {
    return this.design.components.weapons
  }

  currentWeaponId(): string {
    return this.phasing.weaponIndex
  }

  weapon({ id }: { id: string }): WeaponWrapper {
    return new WeaponWrapper({ match: this.match, weapon: this.weapons()[id] })
  }

  currentWeapon(): WeaponWrapper {
    return this.weapon({ id: this.currentWeaponId() })
  }
}

export default CarWrapper
