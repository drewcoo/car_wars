import { matchCars } from '../DATA'
import Movement from './Movement'

class Turn {
  static next ({ match }) {
    // BUGBUG: check for game over

    // bump hc up, mark cars to be able to change speed, etc.
    match.time.turn.number += 1

    matchCars({match}).forEach(car => {
      car.design.components.weapons.forEach(weapon => {
        weapon.firedThisTurn = false
      })
      car.design.components.crew.forEach(crewMember => {
        crewMember.firedThisTurn = false
      })
      //car.status.speedChangedThisTurn = false
      let handlingRecovery = car.design.attributes.handlingClass
      if (handlingRecovery < 1) { handlingRecovery = 1 }
      car.status.handling += handlingRecovery
      if (car.status.handling > car.design.attributes.handlingClass) {
        car.status.handling = car.design.attributes.handlingClass
      }
    })

    Movement.slowTheDead({ match })
  }
}

export default Turn
