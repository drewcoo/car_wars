import * as React from 'react'
import { compose } from 'recompose'
import PropTypes from 'prop-types'
import { HotKeys } from 'react-hotkeys'
import LocalMatchState from '../../../lib/LocalMatchState'
import Session from '../../../lib/Session'
import { graphql } from 'react-apollo'
import acceptMove from '../../../../graphql/mutations/acceptMove'
import activeManeuverNext from '../../../../graphql/mutations/activeManeuverNext'
import activeManeuverPrevious from '../../../../graphql/mutations/activeManeuverPrevious'
import activeManeuverSet from '../../../../graphql/mutations/activeManeuverSet'
import activeMoveBend from '../../../../graphql/mutations/activeMoveBend'
import activeMoveDrift from '../../../../graphql/mutations/activeMoveDrift'
import activeMovePivot from '../../../../graphql/mutations/activeMovePivot'
import activeMoveStraight from '../../../../graphql/mutations/activeMoveStraight'
import activeMoveHalfStraight from '../../../../graphql/mutations/activeMoveHalfStraight'
import activeMoveReset from '../../../../graphql/mutations/activeMoveReset'
import activeMoveSwerve from '../../../../graphql/mutations/activeMoveSwerve'
import activeShowCollisions from '../../../../graphql/mutations/activeShowCollisions'
import setWeapon from '../../../../graphql/mutations/setWeapon'

//
// TODO:
//
// activeMoves w/ speeds > 50 mph, send *chain* of moves
//   + for speeds >50 make the active UI work better
//
// add something to do collision resolution, too
//
// auto-move:
//   - half moves
//   - uncontrolled vehicles
//   - send chain of moves for > 50 mph
//

const DO_MOVE = graphql(acceptMove, { name: 'acceptMove' })
const ACTIVE_MANEUVER_NEXT = graphql(activeManeuverNext, {
  name: 'activeManeuverNext',
})
const ACTIVE_MANEUVER_PREVIOUS = graphql(activeManeuverPrevious, {
  name: 'activeManeuverPrevious',
})
const ACTIVE_MANEUVER_SET = graphql(activeManeuverSet, {
  name: 'activeManeuverSet',
})
const ACTIVE_MOVE_BEND = graphql(activeMoveBend, { name: 'activeMoveBend' })
const ACTIVE_MOVE_DRIFT = graphql(activeMoveDrift, { name: 'activeMoveDrift' })
const ACTIVE_MOVE_FORWARD = graphql(activeMoveStraight, {
  name: 'activeMoveStraight',
})
const ACTIVE_MOVE_HALF_FORWARD = graphql(activeMoveHalfStraight, {
  name: 'activeMoveHalfStraight',
})
const ACTIVE_MOVE_PIVOT = graphql(activeMovePivot, { name: 'activeMovePivot' })
const ACTIVE_MOVE_RESET = graphql(activeMoveReset, { name: 'activeMoveReset' })
const ACTIVE_MOVE_SWERVE = graphql(activeMoveSwerve, {
  name: 'activeMoveSwerve',
})
const ACTIVE_SHOW_COLLISIONS = graphql(activeShowCollisions, {
  name: 'activeShowCollisions',
})
const SET_WEAPON = graphql(setWeapon, { name: 'setWeapon' })

class ManeuverKeystrokes extends React.Component {
  constructor(props) {
    super(props)
    this.state = { value: '' }
    this.keyMap = {
      nextManeuver: ['m', 'up'],
      previousManeuver: ['shift+m', 'down'],
      acceptMove: ['enter'],
      turnLeft: ['z', 'shift+x', 'left'],
      turnRight: ['x', 'shift+z', 'right'],
      nextWeapon: 'w',
      previousWeapon: 'shift+w',
      home: '.',
    }
  }

  async activeMoveStraight({ id }) {
    return this.props.activeMoveStraight({
      variables: { id: id },
    })
  }

  async activeMoveHalfStraight({ id }) {
    return this.props.activeMoveHalfStraight({
      variables: { id: id },
    })
  }

  async activeMoveDrift({ id, direction }) {
    return this.props.activeMoveDrift({
      variables: { id: id, direction: direction },
    })
  }

  async activeManeuverNext({ id }) {
    await this.props.activeManeuverNext({
      variables: { id: id },
    })
  }

  async activeManeuverPrevious({ id }) {
    await this.props.activeManeuverPrevious({
      variables: { id: id },
    })
  }

  async activeManeuverSet({ id, maneuverIndex }) {
    await this.props.activeManeuverSet({
      variables: { id: id, maneuverIndex: maneuverIndex },
    })
  }

  async activeMoveReset({ id }) {
    return this.props.activeMoveReset({
      variables: { id: id },
    })
  }

  async activeShowCollisions({ id }) {
    return this.props.activeShowCollisions({
      variables: { id: id },
    })
  }

  async activeMoveBend({ id, degrees }) {
    return this.props.activeMoveBend({
      variables: { id: id, degrees: degrees },
    })
  }

  async activeMovePivot({ id, degrees }) {
    return this.props.activeMovePivot({
      variables: { id: id, degrees: degrees },
    })
  }

  async activeMoveSwerve({ id, degrees }) {
    return this.props.activeMoveSwerve({
      variables: { id: id, degrees: degrees },
    })
  }

  async weaponSetter({ id, weaponIndex }) {
    await this.props.setWeapon({
      variables: { id: id, weaponIndex: weaponIndex },
    })
  }

  async acceptMove({ id }) {
    await this.props.acceptMove({
      variables: {
        id: id,
        maneuver: 'straight?',
        howFar: 77, // currently bogus
      },
    })
  }

  turnRight(fRight) {
    const lms = new LocalMatchState(this.props.matchData)
    const car = lms.activeCar()
    switch (lms.currentManeuver()) {
      case 'half':
        if (!car.status.maneuvers.includes('pivot')) {
          break
        }
        this.activeManeuverSet({
          id: car.id,
          maneuverIndex: car.status.maneuvers.indexOf('pivot'),
        })
        this.activeMovePivot({
          id: car.id,
          degrees: fRight ? 15 : -15,
        })
        break
      case 'straight':
        // Make it easy to maneuver (bend from straight position) as long as that's possible.
        if (!car.status.maneuvers.includes('bend')) {
          break
        }
        this.activeManeuverSet({
          id: car.id,
          maneuverIndex: car.status.maneuvers.indexOf('bend'),
        })
        this.activeMoveBend({
          id: car.id,
          degrees: fRight ? 15 : -15,
        })
        break
      case 'bend':
        this.activeMoveBend({
          id: car.id,
          degrees: fRight ? 15 : -15,
        })
        break
      case 'drift':
        this.activeMoveDrift({
          id: car.id,
          direction: fRight ? 'right' : 'left',
        })
        break
      case 'pivot':
        this.activeMovePivot({
          id: car.id,
          degrees: fRight ? 15 : -15,
        })
        break
      case 'swerve':
        this.activeMoveSwerve({ id: car.id, degrees: fRight ? 15 : -15 })
        break
      default:
        console.log(`maneuver: ${lms.currentManeuver()}`)
        return
    }
    this.activeShowCollisions({ id: car.id })
  }

  respondUnlessModalShowing(handlers) {
    return <HotKeys attach={document} focused={true} handlers={handlers} keyMap={this.keyMap} />
  }

  render() {
    const lms = new LocalMatchState(this.props.matchData)
    // this.props.carId passed in from speed change Modal
    // will I also do that for targeting/firing?
    if (!Session.loggedInAsActivePlayer(this.props.matchData) && !this.props.carId) {
      return <></>
    }

    const car = this.props.carId ? lms.car({ id: this.props.carId }) : lms.activeCar()

    const handlers = {
      nextManeuver: (event) => {
        this.activeManeuverNext({ id: car.id })
      },
      previousManeuver: (event) => {
        this.activeManeuverPrevious({ id: car.id })
      },
      nextWeapon: (event) => {
        lms.nextWeapon({ id: car.id })
        this.weaponSetter({
          id: car.id,
          weaponIndex: lms.weaponIndex({ id: car.id }),
        })
      },
      previousWeapon: (event) => {
        lms.previousWeapon({ id: car.id })
        this.weaponSetter({
          id: car.id,
          weaponIndex: lms.weaponIndex({ id: car.id }),
        })
      },
      acceptMove: (event) => {
        this.props.handlers.accept(event)
      },
      turnRight: (event) => {
        this.turnRight(true)
      },
      turnLeft: (event) => {
        this.turnRight(false)
      },
      home: (event) => {
        this.activeMoveReset({ id: car.id })
        this.weaponSetter({
          id: car.id,
          weaponIndex: 0,
        })
      },
    }

    return this.respondUnlessModalShowing(handlers)
  }
}

ManeuverKeystrokes.propTypes = {
  activeManeuverNext: PropTypes.func,
  activeManeuverPrevious: PropTypes.func,
  activeManeuverSet: PropTypes.func,
  activeMoveBend: PropTypes.func,
  activeMoveDrift: PropTypes.func,
  activeMoveHalfStraight: PropTypes.func,
  activeMoveReset: PropTypes.func,
  activeMoveStraight: PropTypes.func,
  activeMoveSwerve: PropTypes.func,
  activeShowCollisions: PropTypes.func,
  setWeapon: PropTypes.func,
  acceptMove: PropTypes.func,
  matchData: PropTypes.object,
  carId: PropTypes.string,
  handlers: PropTypes.object,
}

export default compose(
  DO_MOVE,
  ACTIVE_MOVE_FORWARD,
  ACTIVE_MOVE_HALF_FORWARD,
  ACTIVE_MOVE_DRIFT,
  ACTIVE_MANEUVER_NEXT,
  ACTIVE_MANEUVER_PREVIOUS,
  ACTIVE_MOVE_RESET,
  ACTIVE_SHOW_COLLISIONS,
  ACTIVE_MOVE_BEND,
  ACTIVE_MOVE_PIVOT,
  ACTIVE_MOVE_SWERVE,
  ACTIVE_MANEUVER_SET,
  SET_WEAPON,
)(ManeuverKeystrokes)
