class Weapon {
  static can_fire(weapon) {
    /*
    console.log(`WEAPON:`);
    console.log(`  location : ${weapon.location}`);
    console.log(`  ammo : ${weapon.ammo}`);
    console.log(`  DP : ${weapon.damage_points}`);
    console.log(`  fired_this_turn : ${weapon.fired_this_turn}`);
    */
    return !(
      weapon.location === 'none' ||
      weapon.ammo === 0 ||
      weapon.damage_points === 0 ||
      weapon.fired_this_turn
    );
  }
}
export default Weapon;
