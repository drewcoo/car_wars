class CrewMember {
  static canFire (crewMember) {
    /*
    console.log(`CREW:`);
    console.log(`  fired_this_turn : ${crewMember.fired_this_turn}`);
    console.log(`  damagePoints : ${crewMember.damagePoints}`);
    */
    return !(
      crewMember.fired_this_turn ||
      crewMember.damagePoints < 1
    )
  }
}
export default CrewMember
