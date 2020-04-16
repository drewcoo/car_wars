import * as React from 'react'
import { compose } from 'recompose'

import { HotKeys } from 'react-hotkeys'
import LocalMatchState from '../lib/LocalMatchState'

import { graphql } from 'react-apollo'
import doMove from '../../graphql/mutations/doMove'
import fireWeapon from '../../graphql/mutations/fireWeapon'
import ghostManeuverNext from '../../graphql/mutations/ghostManeuverNext'
import ghostManeuverPrevious from '../../graphql/mutations/ghostManeuverPrevious'
import ghostManeuverSet from '../../graphql/mutations/ghostManeuverSet'
import ghostMoveBend from '../../graphql/mutations/ghostMoveBend'
import ghostMoveDrift from '../../graphql/mutations/ghostMoveDrift'
import ghostMoveForward from '../../graphql/mutations/ghostMoveForward'
import ghostMoveHalfForward from '../../graphql/mutations/ghostMoveHalfForward'
import ghostMoveReset from '../../graphql/mutations/ghostMoveReset'
import ghostMoveSwerve from '../../graphql/mutations/ghostMoveSwerve'
import ghostShowCollisions from '../../graphql/mutations/ghostShowCollisions'
import setSpeed from '../../graphql/mutations/setSpeed'
import setTarget from '../../graphql/mutations/setTarget'
import setWeapon from '../../graphql/mutations/setWeapon'

//
// TODO:
//
// ghostMoves w/ speeds > 50 mph, send *chain* of moves
//   + for speeds >50 make the ghost UI work better
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

const GHOST_MANEUVER_NEXT = graphql(ghostManeuverNext, { name: 'ghostManeuverNext' })
const GHOST_MANEUVER_PREVIOUS = graphql(ghostManeuverPrevious, { name: 'ghostManeuverPrevious' })
const GHOST_MANEUVER_SET = graphql(ghostManeuverSet, { name: 'ghostManeuverSet' })

const GHOST_MOVE_BEND = graphql(ghostMoveBend, { name: 'ghostMoveBend' })
const GHOST_MOVE_DRIFT = graphql(ghostMoveDrift, { name: 'ghostMoveDrift' })
const GHOST_MOVE_FORWARD = graphql(ghostMoveForward, { name: 'ghostMoveForward' })
const GHOST_MOVE_HALF_FORWARD = graphql(ghostMoveHalfForward, { name: 'ghostMoveHalfForward' })
const GHOST_MOVE_RESET = graphql(ghostMoveReset, { name: 'ghostMoveReset' })
const GHOST_MOVE_SWERVE = graphql(ghostMoveSwerve, { name: 'ghostMoveSwerve' })

const GHOST_SHOW_COLLISIONS = graphql(ghostShowCollisions, { name: 'ghostShowCollisions' })

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

  async ghostMoveForward({ id }) {
    return await this.props.ghostMoveForward({
      variables: { id: id }
    })
  }

  async ghostMoveHalfForward({ id }) {
    return await this.props.ghostMoveHalfForward({
      variables: { id: id }
    })
  }

  async ghostMoveDrift({ id, direction }) {
    return await this.props.ghostMoveDrift({
      variables: { id: id, direction: direction }
    })
  }

  async ghostManeuverNext({ id }) {
    await this.props.ghostManeuverNext({
      variables: { id: id }
    })
  }

  async ghostManeuverPrevious({ id }) {
    return await this.props.ghostManeuverPrevious({
      variables: { id: id }
    })
  }

  async ghostManeuverSet({ id, maneuverIndex }) {
    return await this.props.ghostManeuverSet({
      variables: { id: id, maneuverIndex: maneuverIndex }
    })
  }

  async ghostMoveReset({ id }) {
    return await this.props.ghostMoveReset({
      variables: { id: id }
    })
  }

  async ghostShowCollisions({ id }) {
    return await this.props.ghostShowCollisions({
      variables: { id: id }
    })
  }

  async ghostMoveBend({ id, degrees }) {
    return await this.props.ghostMoveBend({
      variables: { id: id, degrees: degrees }
    })
  }

  async ghostMoveSwerve({ id, degrees }) {
    return await this.props.ghostMoveSwerve({
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
        this.ghostManeuverSet({
          id: car.id,
          maneuverIndex: car.status.maneuvers.indexOf('bend')
        })
        this.ghostMoveBend({
          id: car.id,
          degrees: (fRight ? 15 : -15)
        })
        break
      case 'bend':
        this.ghostMoveBend({
          id: car.id,
          degrees: (fRight ? 15 : -15)
        })
        break
      case 'drift':
        this.ghostMoveDrift({
          id: car.id,
          direction: (fRight ? 'right' : 'left')
        })
        break
      case 'swerve':
        this.ghostMoveSwerve({ id: car.id, degrees: (fRight ? 15 : -15) })
        break
      default:
        console.log(`maneuver: ${lms.currentManeuver()}`)
        return
    }
    this.ghostShowCollisions({ id: car.id })
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
        this.ghostManeuverNext({ id: car.id })
      },
      previousManeuver: (event) => {
        this.ghostManeuverPrevious({ id: car.id })
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
        this.ghostMoveReset({ id: car.id })
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
  GHOST_MOVE_FORWARD,
  GHOST_MOVE_HALF_FORWARD,
  GHOST_MOVE_DRIFT,
  GHOST_MANEUVER_NEXT,
  GHOST_MANEUVER_PREVIOUS,
  GHOST_MOVE_RESET,
  GHOST_SHOW_COLLISIONS,
  GHOST_MOVE_BEND,
  GHOST_MOVE_SWERVE,
  GHOST_MANEUVER_SET,
  SET_SPEED,
  SET_TARGET,
  SET_WEAPON,
)(KeystrokeInput)
