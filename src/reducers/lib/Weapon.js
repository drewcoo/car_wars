class Weapon {
  static canFire (weapon) {
    return !(
      weapon.location === 'none' ||
      weapon.ammo === 0 ||
      weapon.damagePoints === 0 ||
      weapon.fired_this_turn
    )
  }
}
export default Weapon
