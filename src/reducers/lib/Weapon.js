class Weapon {
  static canFire (weapon) {
    /*
    console.log(`WEAPON:`);
    console.log(`  location : ${weapon.location}`);
    console.log(`  ammo : ${weapon.ammo}`);
    console.log(`  DP : ${weapon.damagePoints}`);
    console.log(`  fired_this_turn : ${weapon.fired_this_turn}`);
    */
    return !(
      weapon.location === 'none' ||
      weapon.ammo === 0 ||
      weapon.damagePoints === 0 ||
      weapon.fired_this_turn
    )
  }
}
export default Weapon
