import * as React from 'react'
import Modal from 'react-modal'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import FireKeystrokes from './FireKeystrokes'
import TargetSelector from './TargetSelector'
import WeaponSelector from './WeaponSelector'
import LocalMatchState from '../../lib/LocalMatchState'
import FiringArc from '../../FiringArc'
import finishFiring from '../../../graphql/mutations/finishFiring'
import fireWeapon from '../../../graphql/mutations/fireWeapon'
import '../../../../App.css'

const FINISH_FIRING = graphql(finishFiring, { name: 'finishFiring' })
const FIRE_WEAPON = graphql(fireWeapon, { name: 'fireWeapon' })

class FireModal extends React.Component {
  constructor (props) {
    super(props)
    this.handleClose = this.handleClose.bind(this)
    this.handleFire = this.handleFire.bind(this)
  }

  async finishFiring ({ id }) {
    this.props.finishFiring({ variables: { id } })
  }

  async fireWeapon ({ id }) {
    const car = new LocalMatchState(this.props.matchData).car({ id })
    const target = car.phasing.targets[car.phasing.targetIndex]
    if (!target) { return }
    await this.props.fireWeapon({
      variables: {
        id: id, // car id, so we can tell weapon fired from that (aimed fire)
        targetId: target.carId,
        targetName: target.name,
        targetX: target.displayPoint.x,
        targetY: target.displayPoint.y
      }
    })
  }

  handleClose () {
    this.finishFiring({ id: this.props.carId })
  }

  handleFire () {
    this.fireWeapon({ id: this.props.carId })
  }

  borderColor () {
    const lms = new LocalMatchState(this.props.matchData)
    const color = lms.player(localStorage.getItem('playerId')).color
    return `3px solid ${color}`
  }

  customStyles () {
    return ({
      content: {
        top: '50%',
        left: '80%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'black',
        color: 'white',
        border: this.borderColor(),
        borderRadius: '20px',
        fontFamily: 'fantasy',
        fontSize: '40px',
        fontVariant: 'smallCaps',
        opacity: 0.8
      },
      // no overlay
      overlay: {
        backgroundColor: 'rgba(0,0,0, .5)',
        top: '50%',
        bottom: '50%'
      }
    })
  }

  buttonStyle () {
    return ({
      backgroundColor: 'black',
      border: this.borderColor(),
      borderRadius: '20px',
      color: 'white',
      float: 'right',
      fontFamily: 'fantasy',
      fontSize: '40px',
      fontVariant: 'smallCaps'
    })
  }

  render () {
    const lms = new LocalMatchState(this.props.matchData)
    const car = lms.car({ id: this.props.carId })
    const theCar = (car.playerId === localStorage.getItem('playerId'))
    if (!theCar) { return (<></>) }
    if (!lms.data.match.time.phase.canTarget.includes(car.id)) {
      return (
        <Modal isOpen={ true } style={ this.customStyles() }>
          <br/>firing . . .<br/>&nbsp;
        </Modal>
      )
    }
    return (
      <>
      <Modal isOpen={ true } style={ this.customStyles() }>
        <span>
          <span style={ { color: car.color } }>{car.color}</span> fire
        </span>
        <br/>
        <div className='ActionControls'>
          <FireKeystrokes matchData={ this.props.matchData } carId={this.props.carId} />
          <br/>
          <WeaponSelector matchData={ this.props.matchData } carId={this.props.carId} />
          <br/>
          <TargetSelector matchData={ this.props.matchData } carId={this.props.carId} />
          <br/>
          <button onClick={ this.handleFire } style={ this.buttonStyle() }>
            Fire
          </button>
          <button onClick={ this.handleClose } style={ this.buttonStyle() } >
            Done
          </button>
        </div>
      </Modal>
      <FiringArc
        client={this.props.client}
        matchData={ new LocalMatchState(this.props.matchData).data }
        carId={ this.props.carId } />
      </>
    )
  }
}

Modal.setAppElement('#root')

export default compose(
  FINISH_FIRING,
  FIRE_WEAPON
)(FireModal)
