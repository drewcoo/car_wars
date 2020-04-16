import * as React from 'react'
import { compose } from 'recompose'

import { HotKeys } from 'react-hotkeys'
import LocalMatchState from '../lib/LocalMatchState'

import { graphql } from 'react-apollo'
import doMove from '../../graphql/mutations/doMove'
import fireWeapon from '../../graphql/mutations/fireWeapon'
import activeManeuverNext from '../../graphql/mutations/activeManeuverNext'
import activeManeuverPrevious from '../../graphql/mutations/activeManeuverPrevious'
import activeManeuverSet from '../../graphql/mutations/activeManeuverSet'
import activeMoveBend from '../../graphql/mutations/activeMoveBend'
import activeMoveDrift from '../../graphql/mutations/activeMoveDrift'
import activeMoveForward from '../../graphql/mutations/activeMoveForward'
import activeMoveHalfForward from '../../graphql/mutations/activeMoveHalfForward'
import activeMoveReset from '../../graphql/mutations/activeMoveReset'
import activeMoveSwerve from '../../graphql/mutations/activeMoveSwerve'
import activeShowCollisions from '../../graphql/mutations/activeShowCollisions'
import setSpeed from '../../graphql/mutations/setSpeed'
import setTarget from '../../graphql/mutations/setTarget'
import setWeapon from '../../graphql/mutations/setWeapon'

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

const DO_MOVE = graphql(doMove, { name: 'doMove' })
const FIRE_WEAPON = graphql(fireWeapon, { name: 'fireWeapon' })

const ACTIVE_MANEUVER_NEXT = graphql(activeManeuverNext, { name: 'activeManeuverNext' })
const ACTIVE_MANEUVER_PREVIOUS = graphql(activeManeuverPrevious, { name: 'activeManeuverPrevious' })
const ACTIVE_MANEUVER_SET = graphql(activeManeuverSet, { name: 'activeManeuverSet' })

const ACTIVE_MOVE_BEND = graphql(activeMoveBend, { name: 'activeMoveBend' })
const ACTIVE_MOVE_DRIFT = graphql(activeMoveDrift, { name: 'activeMoveDrift' })
const ACTIVE_MOVE_FORWARD = graphql(activeMoveForward, { name: 'activeMoveForward' })
const ACTIVE_MOVE_HALF_FORWARD = graphql(activeMoveHalfForward, { name: 'activeMoveHalfForward' })
const ACTIVE_MOVE_RESET = graphql(activeMoveReset, { name: 'activeMoveReset' })
const ACTIVE_MOVE_SWERVE = graphql(activeMoveSwerve, { name: 'activeMoveSwerve' })

const ACTIVE_SHOW_COLLISIONS = graphql(activeShowCollisions, { name: 'activeShowCollisions' })

const SET_SPEED = graphql(setSpeed, { name: 'setSpeed' })
const SET_TARGET = graphql(setTarget, { name: 'setTarget' })
const SET_WEAPON = graphql(setWeapon, { name: 'setWeapon' })

class KeystrokeInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = { value: '' }
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

  async activeMoveForward({ id }) {
    return await this.props.activeMoveForward({
      variables: { id: id }
    })
  }

  async activeMoveHalfForward({ id }) {
    return await this.props.activeMoveHalfForward({
      variables: { id: id }
    })
  }

  async activeMoveDrift({ id, direction }) {
    return await this.props.activeMoveDrift({
      variables: { id: id, direction: direction }
    })
  }

  async activeManeuverNext({ id }) {
    await this.props.activeManeuverNext({
      variables: { id: id }
    })
  }

  async activeManeuverPrevious({ id }) {
    return await this.props.activeManeuverPrevious({
      variables: { id: id }
    })
  }

  async activeManeuverSet({ id, maneuverIndex }) {
    return await this.props.activeManeuverSet({
      variables: { id: id, maneuverIndex: maneuverIndex }
    })
  }

  async activeMoveReset({ id }) {
    return await this.props.activeMoveReset({
      variables: { id: id }
    })
  }

  async activeShowCollisions({ id }) {
    return await this.props.activeShowCollisions({
      variables: { id: id }
    })
  }

  async activeMoveBend({ id, degrees }) {
    return await this.props.activeMoveBend({
      variables: { id: id, degrees: degrees }
    })
  }

  async activeMoveSwerve({ id, degrees }) {
    return await this.props.activeMoveSwerve({
      variables: { id: id, degrees: degrees }
    })
  }

  async speedSetter({ id, speed }) {
    return await this.props.setSpeed({
      variables: { id: id, speed: parseInt(speed) }
    })
  }

  async weaponSetter({ id, weaponIndex }) {
    await this.props.setWeapon({
      variables: { id: id, weaponIndex: weaponIndex }
    })
  }

  async targetSetter({ id, targetIndex }) {
    return await this.props.setTarget({
      variables: { id: id, targetIndex: targetIndex }
    })
  }

  async fire({ id }) {
    const car = new LocalMatchState(this.props.matchData).car({ id })
    const target = car.phasing.targets[car.phasing.targetIndex]
    if (!target) { return }
    await this.props.fireWeapon({
      variables: {
        id: id,
        targetId: target.carId,
        targetName: target.name,
        targetX: target.displayPoint.x,
        targetY: target.displayPoint.y
      }
    })
  }

  async doMove({ id }) {
    await this.props.doMove({
      variables: {
        id: id,
        maneuver: 'forward?',
        howFar: 77  // currently bogus
      }
    })
  }

  turnRight(fRight) {
    const lms = new LocalMatchState(this.props.matchData)
    const car = lms.currentCar()
    switch (lms.currentManeuver()) {
      case 'forward':
        // Make it easy to maneuver (bend from forward position) as long as that's possible.
        if (!car.status.maneuvers.includes('bend')) { break }
        this.activeManeuverSet({
          id: car.id,
          maneuverIndex: car.status.maneuvers.indexOf('bend')
        })
        this.activeMoveBend({
          id: car.id,
          degrees: (fRight ? 15 : -15)
        })
        break
      case 'bend':
        this.activeMoveBend({
          id: car.id,
          degrees: (fRight ? 15 : -15)
        })
        break
      case 'drift':
        this.activeMoveDrift({
          id: car.id,
          direction: (fRight ? 'right' : 'left')
        })
        break
      case 'swerve':
        this.activeMoveSwerve({ id: car.id, degrees: (fRight ? 15 : -15) })
        break
      default:
        console.log(`maneuver: ${lms.currentManeuver()}`)
        return
    }
    this.activeShowCollisions({ id: car.id })
  }

  respondUnlessModalShowing(handlers) {
    if (new LocalMatchState(this.props.matchData).currentCar().modals.length > 0) {
      return null
    }
    return(
      <HotKeys
        attach={ document }
        focused={ true }
        handlers={ handlers }
        keyMap={ this.keyMap } />
    )
  }


  render() {
    let lms = new LocalMatchState(this.props.matchData)
    let car = lms.currentCar()

    const handlers = {
      nextManeuver: (event) => {
        this.activeManeuverNext({ id: car.id })
      },
      previousManeuver: (event) => {
        this.activeManeuverPrevious({ id: car.id })
      },
      nextSpeed: (event) => {
        this.speedSetter({
          id: car.id,
          speed: lms.nextSpeed({ id: car.id })
        })
      },
      previousSpeed: (event) => {
        this.speedSetter({
          id: car.id,
          speed: lms.previousSpeed({ id: car.id })
        })
      },
      nextWeapon: (event) => {
        lms.nextWeapon({ id: car.id })
        this.weaponSetter({
          id: car.id,
          weaponIndex: lms.weaponIndex({ id: car.id })
        })
      },
      previousWeapon: (event) => {
        lms.previousWeapon({ id: car.id })
        this.weaponSetter({
          id: car.id,
          weaponIndex: lms.weaponIndex({ id: car.id })
        })
      },
      nextTarget: (event) => {
        if (lms.currentCar().phasing.targets && lms.currentCar().phasing.targets.length > 0) {
          lms.nextTarget({ id: car.id })
          this.targetSetter({
            id: car.id,
            targetIndex: lms.currentTargetIndex({ id: car.id })
          })
        }
      },
      previousTarget: (event) => {
        if (lms.currentCar().phasing.targets && lms.currentCar().phasing.targets.length > 0) {
          lms.previousTarget({ id: car.id })
          this.targetSetter({
            id: car.id,
            targetIndex: lms.currentTargetIndex({ id: car.id })
          })
        }
      },
      fireWeapon: (event) => {
        this.fire({ id: car.id })
      },
      acceptMove: (event) => {
        var moved = (car.rect.brPoint().x !== car.phasing.rect.brPoint().x) ||
                    (car.rect.brPoint().y !== car.phasing.rect.brPoint().y)
        if (moved) {
          this.doMove({
            id: car.id,
            maneuver: 'forward',
            howFar: 0
          })
        }
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
          weaponIndex: 0
        })
      }
    }

    return (
      this.respondUnlessModalShowing(handlers)
    )
  }
}

export default compose (
  DO_MOVE,
  FIRE_WEAPON,
  ACTIVE_MOVE_FORWARD,
  ACTIVE_MOVE_HALF_FORWARD,
  ACTIVE_MOVE_DRIFT,
  ACTIVE_MANEUVER_NEXT,
  ACTIVE_MANEUVER_PREVIOUS,
  ACTIVE_MOVE_RESET,
  ACTIVE_SHOW_COLLISIONS,
  ACTIVE_MOVE_BEND,
  ACTIVE_MOVE_SWERVE,
  ACTIVE_MANEUVER_SET,
  SET_SPEED,
  SET_TARGET,
  SET_WEAPON,
)(KeystrokeInput)
