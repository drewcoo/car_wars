class CrewMember {
  static can_fire(crew_member) {
    /*
    console.log(`CREW:`);
    console.log(`  fired_this_turn : ${crew_member.fired_this_turn}`);
    console.log(`  damage_points : ${crew_member.damage_points}`);
    */
    return !(
      crew_member.fired_this_turn ||
      crew_member.damage_points < 1
    );
  }
}
export default CrewMember;
