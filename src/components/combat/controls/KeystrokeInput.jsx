import * as React from 'react'
import {connect} from "react-redux"
import MatchWrapper from '../../../utils/wrappers/MatchWrapper'
import ViewElement from '../../../utils/ViewElement'
import { HotKeys } from 'react-hotkeys'

import { store,
  maneuverSet, maneuverNext, maneuverPrevious,
  speedNext, speedPrevious,
  weaponNext, weaponPrevious,
  ghostForward, ghostReset, ghostTurnBend, ghostMoveDrift, ghostTurnSwerve,
  ghostShowCollisions,
  ghostTargetNext, ghostTargetPrevious,
  fireWeapon,
  acceptMove
} from '../../../redux'

const mapStateToProps = (state) => {
  return({ matches: state.matches })
}

class KeystrokeInput extends React.Component {
  // props.matchId
  constructor(props) {
    super(props)
    this.keyMap = {
      fireWeapon: 'f',
      nextManeuver: 'm',
      previousManeuver: 'shift+m',
      nextWeapon: 'w',
      previousWeapon: 'shift+w',
      nextSpeed: 's',
      previousSpeed: 'shift+s',
      nextTarget: 't',
      previousTarget: 'shift+t',
      acceptMove: 'enter',
      turnLeft: ['z', 'shift+x'],
      turnRight: ['x', 'shift+z'],
      home: '.'
    }
  }

  currentManeuver(car) {
    return car.status.maneuvers[car.phasing.maneuverIndex]
  }

  showHideCar(car, manIdxDelta) {
    var index = (car.phasing.maneuverIndex + manIdxDelta) %
                 car.status.maneuvers.length
    if (car.status.maneuvers[index] === 'none') {
      store.dispatch(ghostReset({ matchId: this.props.matchId, id: car.id }))
    } else {
      store.dispatch(ghostForward({ matchId: this.props.matchId, id: car.id }))
    }
    store.dispatch(ghostShowCollisions({ matchId: this.props.matchId, id: car.id }))
  }

  turnRight(fRight) {
    var car = new MatchWrapper({ match: this.props.matches[this.props.matchId] }).currentCar()

    switch (this.currentManeuver(car)) {
      case 'forward':
        store.dispatch(maneuverSet({
          matchId: this.props.matchId,
          id: car.id,
          maneuverIndex: car.status.maneuvers.indexOf('bend')
        }))
        // Make it easy to maneuver (bend from forward position) as long as that's possible.
        if (!car.status.maneuvers.includes('bend')) { break }
        // fall through
      case 'bend':
        store.dispatch(ghostTurnBend({ matchId: this.props.matchId, id: car.id, degrees: (fRight ? 15 : -15) }))
        break
      case 'drift':
        store.dispatch(ghostMoveDrift({ matchId: this.props.matchId, id: car.id, direction: (fRight ? 'right' : 'left') }))
        break
      case 'swerve':
        store.dispatch(ghostTurnSwerve({ matchId: this.props.matchId, id: car.id, degrees: (fRight ? 15 : -15) }))
        break
      default:
        console.log(`maneuver: ${this.currentManeuver(car)}`)
        return
    }
    store.dispatch(ghostShowCollisions({ matchId: this.props.matchId, id: car.id }))
  }

  render() {
    const car = new MatchWrapper({ match: this.props.matches[this.props.matchId] }).currentCar()

    ViewElement(car.id)

    const handlers = {
      nextManeuver: (event) => {
        store.dispatch(maneuverNext({ matchId: this.props.matchId, id: car.id }))
        store.dispatch(ghostShowCollisions({ matchId: this.props.matchId, id: car.id }))
        this.showHideCar(car, 1)
      },
      previousManeuver: (event) => {
        store.dispatch(maneuverPrevious({ matchId: this.props.matchId, id: car.id }))
        store.dispatch(ghostShowCollisions({ matchId: this.props.matchId, id: car.id }))
        this.showHideCar(car, -1)
      },
      nextSpeed: (event) => {
        store.dispatch(speedNext({ matchId: this.props.matchId, id: car.id }))
      },
      previousSpeed: (event) => {
        store.dispatch(speedPrevious({ matchId: this.props.matchId, id: car.id }))
      },
      nextWeapon: (event) => {
        store.dispatch(weaponNext({ matchId: this.props.matchId, id: car.id }))
        ViewElement('reticle')
      },
      previousWeapon: (event) => {
        store.dispatch(weaponPrevious({ matchId: this.props.matchId, id: car.id }))
        ViewElement('reticle')
      },
      nextTarget: (event) => {
        store.dispatch(ghostTargetNext({ matchId: this.props.matchId, id: car.id }))
        ViewElement('reticle')
      },
      previousTarget: (event) => {
        store.dispatch(ghostTargetPrevious({ matchId: this.props.matchId, id: car.id }))
        ViewElement('reticle')
      },
      fireWeapon: (event) => {
        ViewElement('reticle')
        store.dispatch(fireWeapon({ matchId: this.props.matchId, id: car.id }))
        ViewElement('shotResult')
      },
      acceptMove: (event) => {
        var moved = (car.rect.brPoint().x !== car.phasing.rect.brPoint().x) ||
                    (car.rect.brPoint().y !== car.phasing.rect.brPoint().y)
        if (moved) {
          store.dispatch(acceptMove({ matchId: this.props.matchId, id: car.id }))
          ViewElement('ghost')
        }
      },
      turnRight: (event) => {
        this.turnRight(true)
      },
      turnLeft: (event) => {
        this.turnRight(false)
      },
      home: (event) => {
        store.dispatch(ghostReset({ matchId: this.props.matchId, id: car.id }))
      }
    }

    return (
      <HotKeys
        attach={ document }
        focused={ true }
        handlers={ handlers }
        keyMap={ this.keyMap } />
    )
  }
}

export default connect(mapStateToProps)(KeystrokeInput)
