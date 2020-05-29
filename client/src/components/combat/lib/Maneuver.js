// only used by ActiveCar???

class Maneuver {
  static currentManeuver(car) {
    return car.status.maneuvers[car.phasing.maneuverIndex]
  }

  static turnRight({ matchId, car, fRight }) {
    /*
    switch (this.currentManeuver(car)) {
      case 'straight':
        store.dispatch(maneuverSet({
          matchId: matchId,
          id: car.id,
          maneuverIndex: car.status.maneuvers.indexOf('bend')
        }))
        // Make it easy to maneuver (bend from straight position) as long as that's possible.
        if (!car.status.maneuvers.includes('bend')) { break }
        // fall through
      case 'bend':
        store.dispatch(activeTurnBend({ matchId: matchId, id: car.id, degrees: (fRight ? 15 : -15) }))
        break
      case 'drift':
        store.dispatch(activeMoveDrift({ matchId: matchId, id: car.id, direction: (fRight ? 'right' : 'left') }))
        break
      case 'pivot':
        store.dispatch(activeMovePivot({ matchId: matchId, id: car.id, degrees: (fRight ? 15 : -15) }))
        break
      case 'swerve':
        store.dispatch(activeTurnSwerve({ matchId: matchId, id: car.id, degrees: (fRight ? 15 : -15) }))
        break
      default:
        //console.log(`maneuver: ${this.currentManeuver(car)}`)
        return
    }
    store.dispatch(activeShowCollisions({ matchId: matchId, id: car.id }))
    */
  }

  static showHideCar({ matchId, car, indexDelta }) {
    /*
    var index = (car.phasing.maneuverIndex + indexDelta) %
                 car.status.maneuvers.length
    if (car.status.maneuvers[index] === 'none') {
      store.dispatch(activeReset({ matchId: matchId, id: car.id }))
    } else if (car.status.maneuvers[index] === 'half') {
      store.dispatch(activeHalf({ matchId: matchId, id: car.id }))
    } else {
      store.dispatch(activeStraight({ matchId: matchId, id: car.id }))
    }
    store.dispatch(activeShowCollisions({ matchId: matchId, id: car.id }))
    */
  }

  static next({ matchId, car }) {
    /*
    store.dispatch(maneuverNext({ matchId: matchId, id: car.id }))
    this.showHideCar({ matchId: matchId, car: car, indexDelta: 1 })
    */
  }

  static previousManeuver({ matchId, car }) {
    /*
    store.dispatch(maneuverPrevious({ matchId: matchId, id: car.id }))
    this.showHideCar({ matchId: matchId, car: car, indexDelta: -1 })
    */
  }
}

export default Maneuver
