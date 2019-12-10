class CrewMember {
  static canFire (crewMember) {
    return !(
      crewMember.fired_this_turn ||
      crewMember.damagePoints < 1
    )
  }
}
export default CrewMember
