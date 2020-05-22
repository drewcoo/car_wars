import * as React from 'react'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import { HotKeys } from 'react-hotkeys'
import LocalMatchState from '../../../lib/LocalMatchState'
import finishFiring from '../../../../graphql/mutations/finishFiring'
import fireWeapon from '../../../../graphql/mutations/fireWeapon'
import setTarget from '../../../../graphql/mutations/setTarget'
import setWeapon from '../../../../graphql/mutations/setWeapon'
import ViewElement from '../../../lib/ViewElement'
import PropTypes from 'prop-types'

const FINISH_FIRING = graphql(finishFiring, { name: 'finishFiring' })
const FIRE_WEAPON = graphql(fireWeapon, { name: 'fireWeapon' })
const SET_TARGET = graphql(setTarget, { name: 'setTarget' })
const SET_WEAPON = graphql(setWeapon, { name: 'setWeapon' })

class FireKeystrokes extends React.Component {
  constructor(props) {
    super(props)
    this.state = { value: '' }
    this.keyMap = {
      nextWeapon: 'w',
      previousWeapon: 'shift+w',
      nextTarget: 't',
      previousTarget: 'shift+t',
      fireWeapon: ['f'],
      finishFiring: 'esc',
      enter: 'enter',
      home: '.',
    }
  }

  async weaponSetter({ id, weaponIndex }) {
    this.props.setWeapon({
      variables: { id: id, weaponIndex: weaponIndex },
    })
  }

  async targetSetter({ id, targetIndex }) {
    this.props.setTarget({
      variables: { id: id, targetIndex: targetIndex },
    })
  }

  async fire({ id }) {
    const car = new LocalMatchState(this.props.matchData).car({ id })
    const target = car.phasing.targets[car.phasing.targetIndex]
    if (!target) { return }
    await this.props.fireWeapon({
      variables: {
        id: id, // car id, so we can tell weapon fired from that (aimed fire)
        targetId: target.carId,
        targetName: target.name,
        targetX: target.displayPoint.x,
        targetY: target.displayPoint.y,
      },
    })
  }

  async finishFiring({ id }) {
    await this.props.finishFiring({ variables: { id } })
  }

  render() {
    const lms = new LocalMatchState(this.props.matchData)
    const car = lms.car({ id: this.props.carId })
    const handlers = {
      enter: (event) => {
        // Fire if target, otherwise finish
        // BUGBUG: Should check on server side.
        // This allows server to hit error.
        if (lms.currentTarget({ id: car.id })) {
          this.fire({ id: car.id })
        } else {
          this.finishFiring({ id: car.id })
        }
        
        
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
      nextTarget: (event) => {
        if (car.phasing.targets && car.phasing.targets.length > 0) {
          lms.nextTarget({ id: car.id })
          this.targetSetter({
            id: car.id,
            targetIndex: lms.currentTargetIndex({ id: car.id }),
          })
        }
      },
      previousTarget: (event) => {
        if (car.phasing.targets && car.phasing.targets.length > 0) {
          lms.previousTarget({ id: car.id })
          this.targetSetter({
            id: car.id,
            targetIndex: lms.currentTargetIndex({ id: car.id }),
          })
        }
      },
      fireWeapon: (event) => {
        this.fire({ id: car.id })
      },
      finishFiring: (event) => {
        this.finishFiring({ id: car.id })
      },
      home: (event) => {
        this.weaponSetter({
          id: car.id,
          weaponIndex: 0,
        })
        ViewElement(car.id)
      },
    }
    return (
      <HotKeys
        attach={document}
        focused={true}
        handlers={handlers}
        keyMap={this.keyMap}
      />
    )
  }
}

FireKeystrokes.propTypes = {
  carId: PropTypes.string,
  finishFiring: PropTypes.func,
  fireWeapon: PropTypes.func,
  matchData: PropTypes.object,
  setTarget: PropTypes.func,
  setWeapon: PropTypes.func,
}

export default compose(
  FINISH_FIRING,
  FIRE_WEAPON,
  SET_TARGET,
  SET_WEAPON
)(FireKeystrokes)
