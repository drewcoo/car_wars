import * as React from 'react'
import { graphql } from 'react-apollo'
import ReactModal from 'react-modal'
import { compose } from 'recompose'
import '../../../../../App.css'
import finishFiring from '../../../../graphql/mutations/finishFiring'
import fireWeapon from '../../../../graphql/mutations/fireWeapon'
import LocalMatchState from '../../../lib/LocalMatchState'
import FiringArc from '../../vehicle/FiringArc'
import FireKeystrokes from './FireKeystrokes'
import TargetSelector from './TargetSelector'
import WeaponSelector from './WeaponSelector'

const FINISH_FIRING = graphql(finishFiring, { name: 'finishFiring' })
const FIRE_WEAPON = graphql(fireWeapon, { name: 'fireWeapon' })

class FireModal extends React.Component {
  constructor(props) {
    super(props)
    this.handleClose = this.handleClose.bind(this)
    this.handleEatIt = this.handleEatIt.bind(this)
    this.handleFire = this.handleFire.bind(this)
  }

  async finishFiring({ id }) {
    this.props.finishFiring({ variables: { id } })
  }

  async fireWeapon({ id }) {
    const car = new LocalMatchState(this.props.matchData).car({ id })
    const target = car.phasing.targets[car.phasing.targetIndex]
    if (!target) {
      return
    }
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

  handleClose() {
    this.finishFiring({ id: this.props.carId })
  }

  handleEatIt(e) {
    e.stopPropagation()
  }

  handleFire() {
    this.fireWeapon({ id: this.props.carId })
  }

  buttons(car) {
    const weapon = car.design.components.weapons[car.phasing.weaponIndex]
    if (weapon.type === 'none') {
      return (
        <div>
          <button onClick={this.handleClose} className={'ReactModal__Buttons'}>
            Done
          </button>
        </div>
      )
    }

    return (
      <div>
        <button onClick={this.handleFire} className={'ReactModal__Buttons'} style={{ float: 'left' }}>
          <u>F</u>ire
        </button>
        <button onClick={this.handleClose} className={'ReactModal__Buttons'}>
          Done
        </button>
      </div>
    )
  }

  render() {
    const lms = new LocalMatchState(this.props.matchData)
    const car = lms.car({ id: this.props.carId })
    const theCar = car.playerId === localStorage.getItem('playerId')

    let color = car.color,
      name = car.name
    if (this.props.matchData.match.time.phase.moving) {
      color = lms.car({ id: this.props.matchData.match.time.phase.moving }).color
      name = lms.car({ id: this.props.matchData.match.time.phase.moving }).name
    }

    if (!theCar) {
      return <></>
    }
    if (!lms.data.match.time.phase.canTarget.includes(car.id)) {
      return (
        <div onClick={this.handleEatIt}>
          <ReactModal isOpen={true} className={'Modal.Content'} overlayClassName={'Modal.Overlay'}>
            <fieldset className="ModalFieldset">
            Targeting
              <legend style={{ color: color }}>{name}</legend>
              waiting...
              <br />
              <br />
            </fieldset>
          </ReactModal>
        </div>
      )
    }
    return (
      <>
        <div onClick={this.handleEatIt}>
          <ReactModal isOpen={true} className={'Modal.Content'} overlayClassName={'Modal.Overlay'}>
            <fieldset className="ModalFieldset">
              <legend style={{ color: color }}>{name}</legend>
              Targeting
              <FireKeystrokes matchData={this.props.matchData} carId={this.props.carId} />

              <div className="ActionControls">
                <WeaponSelector matchData={this.props.matchData} carId={this.props.carId} />
                <br />
                <TargetSelector matchData={this.props.matchData} carId={this.props.carId} />
                <br />
                <br />
                {this.buttons(car)}
              </div>
        
            </fieldset>
          </ReactModal>
        </div>
        <FiringArc
          client={this.props.client}
          matchData={new LocalMatchState(this.props.matchData).data}
          carId={this.props.carId}
        />
      </>
    )
  }
}

ReactModal.setAppElement('#root')

export default compose(FINISH_FIRING, FIRE_WEAPON)(FireModal)
