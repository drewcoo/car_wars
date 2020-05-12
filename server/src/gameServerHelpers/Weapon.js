class Weapon {
  static canFire({ weapon, plant }) {
    const plantDisabled = plant.damagePoints < 1
    return !(
      weapon.location === 'none' ||
      weapon.ammo === 0 ||
      weapon.damagePoints === 0 ||
      weapon.firedThisTurn ||
      (weapon.requiresPlant && plantDisabled)
    )
  }

  static itself({ car }) {
    return car.design.components.weapons[car.phasing.weaponIndex]
  }

  static passFiringChecks({ car }) {
    const weapon = car.design.components.weapons[car.phasing.weaponIndex]
    const crewMember = car.design.components.crew.find(
      (member) => member.role === 'driver',
    )
    let result = Weapon.canFire({
      weapon,
      plant: car.design.components.powerPlant,
    })

    result =
      result && !(crewMember.firedThisTurn || crewMember.damagePoints < 1)

    // also check the target?

    return result
  }
}
export default Weapon
