import * as React from 'react'
import Modal from 'react-modal'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import uuid from 'uuid/v4'
import DamageKeystrokes from './DamageKeystrokes'
import Damage from '../../Damage'
import LocalMatchState from '../../lib/LocalMatchState'
import ackDamage from '../../../graphql/mutations/ackDamage'
import '../../../../App.css'

const ACK_DAMAGE = graphql(ackDamage, { name: 'ackDamage' })

class DamageModal extends React.Component {
  constructor (props) {
    super(props) // matchData and carId
    this.handleClose = this.handleClose.bind(this)
  }

  async ackDamage ({ matchId, playerId }) {
    this.props.ackDamage({ variables: { matchId, playerId } })
  }

  handleClose () {
    const lms = new LocalMatchState(this.props.matchData)
    const playerId = lms.car({ id: this.props.carId }).playerId
    this.ackDamage({
      matchId: this.props.matchData.match.id,
      playerId: playerId
    })
  }

  borderColor () {
    const lms = new LocalMatchState(this.props.matchData)
    const color = lms.player(localStorage.getItem('playerId')).color
    return `3px solid ${color}`
  }

  customStyles () {
    return {
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
      // no overlay - squished into nonexistence
      overlay: {
        backgroundColor: 'rgba(0,0,0, .5)',
        top: '50%',
        bottom: '50%'
      }
    }
  }

  buttonStyle () {
    return {
      backgroundColor: 'black',
      border: this.borderColor(),
      borderRadius: '20px',
      color: 'white',
      float: 'right',
      fontFamily: 'fantasy',
      fontSize: '40px',
      fontVariant: 'smallCaps'
    }
  }

  render () {
    const lms = new LocalMatchState(this.props.matchData)
    const car = lms.car({ id: this.props.carId })
    const theCar = car.playerId === localStorage.getItem('playerId')
    if (!theCar) {
      return (
        <>
          <Damage
            key={`damCar-${car.id}`}
            client={this.props.client}
            matchData={new LocalMatchState(this.props.matchData).data}
            carId={car.id}
          />
        </>
      )
    }

    const showModal = this.props.matchData.match.time.phase.playersToAckDamage.includes(
      car.playerId
    )

    return (
      <>
        <Damage
          key={`damCar-${car.id}`}
          client={this.props.client}
          matchData={new LocalMatchState(this.props.matchData).data}
          carId={car.id}
        />
        <Modal key={uuid()} isOpen={showModal} style={this.customStyles()}>
          <DamageKeystrokes
            matchData={this.props.matchData}
            carId={this.props.carId}
          />
          review
          <br />
          damage
          <br />
          &nbsp;
          <button onClick={this.handleClose} style={this.buttonStyle()}>
            Done
          </button>
        </Modal>
        <Modal key={uuid()} isOpen={!showModal} style={this.customStyles()}>
          <br />
          waiting . . .<br />
          &nbsp;
        </Modal>
      </>
    )
  }
}

Modal.setAppElement('#root')

export default compose(ACK_DAMAGE)(DamageModal)
