import { connect } from 'react-redux'
import {
  store,
  ghostTurnBend, ghostTurnSwerve, ghostMoveDrift,
  ghostForward, ghostHalf, ghostReset, ghostShowCollisions,
  maneuverPrevious, maneuverNext, maneuverSet
} from '../../../../redux'

const mapStateToProps = (state) => {
  return ({ matches: state.matches })
}

class Maneuver {
  static currentManeuver (car) {
    return (car.status.maneuvers[car.phasing.maneuverIndex])
  }

  static turnRight ({ matchId, car, fRight }) {
    switch (this.currentManeuver(car)) {
      case 'forward':
        store.dispatch(maneuverSet({
          matchId: matchId,
          id: car.id,
          maneuverIndex: car.status.maneuvers.indexOf('bend')
        }))
        // Make it easy to maneuver (bend from forward position) as long as that's possible.
        if (!car.status.maneuvers.includes('bend')) { break }
        // fall through
      case 'bend':
        store.dispatch(ghostTurnBend({ matchId: matchId, id: car.id, degrees: (fRight ? 15 : -15) }))
        break
      case 'drift':
        store.dispatch(ghostMoveDrift({ matchId: matchId, id: car.id, direction: (fRight ? 'right' : 'left') }))
        break
      case 'swerve':
        store.dispatch(ghostTurnSwerve({ matchId: matchId, id: car.id, degrees: (fRight ? 15 : -15) }))
        break
      default:
        console.log(`maneuver: ${this.currentManeuver(car)}`)
        return
    }
    store.dispatch(ghostShowCollisions({ matchId: matchId, id: car.id }))
  }

  static showHideCar ({ matchId, car, indexDelta }) {
    var index = (car.phasing.maneuverIndex + indexDelta) %
                 car.status.maneuvers.length
    if (car.status.maneuvers[index] === 'none') {
      store.dispatch(ghostReset({ matchId: matchId, id: car.id }))
    } else if (car.status.maneuvers[index] === 'half') {
      store.dispatch(ghostHalf({ matchId: matchId, id: car.id }))
    } else {
      store.dispatch(ghostForward({ matchId: matchId, id: car.id }))
    }
    store.dispatch(ghostShowCollisions({ matchId: matchId, id: car.id }))
  }

  static next ({ matchId, car }) {
    store.dispatch(maneuverNext({ matchId: matchId, id: car.id }))
    this.showHideCar({ matchId: matchId, car: car, indexDelta: 1 })
  }

  static previousManeuver ({ matchId, car }) {
    store.dispatch(maneuverPrevious({ matchId: matchId, id: car.id }))
    this.showHideCar({ matchId: matchId, car: car, indexDelta: -1 })
  }
}

export default connect(mapStateToProps)(Maneuver)
