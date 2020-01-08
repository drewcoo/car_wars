class CrewMember {
  damagePoints: number
  firedThisTurn: boolean

  constructor() {
    this.damagePoints = 3
    this.firedThisTurn = false
  }

  static canFire (crewMember: CrewMember) {
    return !(
      crewMember.firedThisTurn ||
      crewMember.damagePoints < 1
    )
  }
}
export default CrewMember
