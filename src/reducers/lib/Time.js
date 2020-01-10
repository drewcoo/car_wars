import Movement from './Movement'
import Targets from './Targets'

class Time {
  static nextPhase ({ match }) {
    let newPhase = match.time.phase.number + 1
    if (newPhase > 5) {
      // bump hc up, mark cars to be able to change speed, etc.
      match.time.turn.number += 1
      newPhase = 1
    }
    match.time.phase.number = newPhase
    match.time.phase.unmoved = Movement.canMoveThisPhase({ match })
  }

  static nextPlayer ({ match }) {
    let bailoutTimer = 5
    do {
      if (bailoutTimer-- < 0) {
        // BUGBUG: This may happen if everyone is stopped.
        // How do I detect infinite loop vs nobody moving?
        // Set a time limit?
        throw new Error('Tried nextPhase() for a whole turn and nobody can move yet!')
      }

      match.time.phase.moving = Movement.nextToMoveThisPhase({ match })
      if (match.time.phase.moving === null) {
        // TODO: Handle Weapons fire here. Any
        this.nextPhase({ match })
      }
    } while (match.time.phase.moving === null)

    // BUGBUG: Targeting here until I do it right - see above.
    const targets = new Targets({
      car: match.cars[match.time.phase.moving],
      cars: match.cars,
      map: match.map
    })
    targets.refresh()
  }
}

export default Time
