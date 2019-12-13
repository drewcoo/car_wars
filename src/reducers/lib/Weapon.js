class Weapon {
  static canFire ({ weapon, plantDisabled }) {
    return !(
      weapon.location === 'none' ||
      weapon.ammo === 0 ||
      weapon.damagePoints === 0 ||
      weapon.fired_this_turn ||
      (weapon.requiresPlant && plantDisabled)
    )
  }
}
export default Weapon
