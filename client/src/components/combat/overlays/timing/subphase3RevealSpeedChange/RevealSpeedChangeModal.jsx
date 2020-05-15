import * as React from 'react'
import { graphql } from 'react-apollo'
import Modal from 'react-modal'
import { compose } from 'recompose'
import uuid from 'uuid/v4'
import '../../../../../App.css'
import ackSpeedChange from '../../../../graphql/mutations/ackSpeedChange'
import LocalMatchState from '../../../lib/LocalMatchState'
import RevealSpeedChangeKeystrokes from './RevealSpeedChangeKeystrokes'

const ACK_SPEED_CHANGE = graphql(ackSpeedChange, { name: 'ackSpeedChange' })

class RevealSpeedChangeModal extends React.Component {
  constructor(props) {
    super(props) // matchData and carId
    this.handleClose = this.handleClose.bind(this)
    this.handleEatIt = this.handleEatIt.bind(this)
  }

  async ackSpeedChange({ matchId, playerId }) {
    this.props.ackSpeedChange({ variables: { matchId, playerId } })
  }

  handleClose() {
    const lms = new LocalMatchState(this.props.matchData)

    const car = lms.car({ id: this.props.carId })
    console.log(`${car.color} here!!!!!!!!!!!!!!!!`)

    const playerId = lms.car({ id: this.props.carId }).playerId
    this.ackSpeedChange({
      matchId: this.props.matchData.match.id,
      playerId: playerId,
    })
  }

  handleEatIt(e) {
    e.stopPropagation()
  }

  render() {
    const lms = new LocalMatchState(this.props.matchData)
    const car = lms.car({ id: this.props.carId })
    const theCar = (car.playerId === localStorage.getItem('playerId'))

    if (!theCar) { return (<></>) }

    const showModal = this.props.matchData.match.time.phase.playersToAckSpeedChange.includes(
      car.playerId
    )

    return (
      <>
        <RevealSpeedChangeKeystrokes
          matchData={this.props.matchData}
          carId={this.props.carId}
        />
        <div onClick={ this.handleEatIt }>
          <Modal

            className={'Modal.Content'}
            overlayClassName={'Modal.Overlay'}
            key={uuid()}
            isOpen={showModal}
          >
            <span className='flexCentered' style={ { color: car.color }} >review</span>
            <span className='flexCentered'>speed changes</span>
            <br />
            <span className='flexCentered'>
              <button onClick={this.handleClose} className={'ReactModal__Buttons'}>
                Done
              </button>
            </span>
          </Modal>
          <Modal
            className={'Modal.Content'}
            overlayClassName={'Modal.Overlay'}
            key={uuid()}
            isOpen={!showModal}
          >
            <br />
              waiting
            <br />
            <br/>
          </Modal>
        </div>
     </>
    )
  }
}

Modal.setAppElement('#root')

export default compose(ACK_SPEED_CHANGE)(RevealSpeedChangeModal)
