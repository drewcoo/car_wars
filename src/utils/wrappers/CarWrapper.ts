import WeaponWrapper from './WeaponWrapper'
import MatchWrapper from './MatchWrapper'
import Rectangle from '../geometry/Rectangle'
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
  modals: any
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
    this.modals = this.data.modals
    this.phasing = this.data.phasing
    //this.phasing.rect = this.data.phasing.rect
    //new Rectangle(this.data.phasing.rect)
    /*this.phasing = {
      rect: new Rectangle(this.data.phasing.rect),
      damageMarkerLocation: this.data.phasing.damageMarkerLocation,
      damageMessage: this.data.phasing.damageMessage,
      difficulty: this.data.phasing.difficulty,
      maneuverIndex: this.data.phasing.maneuverIndex,
      speedChanges:this.data.phasing.speedChanges,
      speedChangeIndex: this.data.phasing.speedChangeIndex,
      weaponIndex: this.data.phasing.weaponIndex,
      targets: this.data.phasing.targets,
      targetIndex: this.data.phasing.targetIndex,
      collisionDetected: this.data.phasing.collisionDetected,
      collisions: this.data.phasing.collisions
    }*/
  //  this.phasing['rect'] = new Rectangle(this.data.phasing.rect)
    this.playerId = this.data.playerId
    this.status = this.data.status
    this.rect = new Rectangle(this.data.rect)
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
