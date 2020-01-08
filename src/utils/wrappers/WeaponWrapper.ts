import CrewMember from '../../reducers/lib/CrewMember'
import Weapon from '../../reducers/lib/Weapon'
import MatchWrapper from './MatchWrapper'
//
// Hand it a store and a match id and it will give you helper functions
// for your match.
//
class WeaponWrapper {
  data:any
  match: MatchWrapper
  location: string
  constructor({ weapon, match }: { weapon: any, match: MatchWrapper }) {
    this.data = weapon
    this.match = match
    this.location = this.data.location
  }

  canFire(): boolean {
    const car = this.match.currentCar()
    const currentCrewMember = car.design.components.crew.driver
    const plant = car.design.components.power_plant

    const checkWeapon = Weapon.canFire({
      weapon: this.data,
      plantDisabled: plant.damagePoints < 1
    })
    const checkCrew = CrewMember.canFire(currentCrewMember)
    return(checkWeapon && checkCrew)
  }
}

export default WeaponWrapper
