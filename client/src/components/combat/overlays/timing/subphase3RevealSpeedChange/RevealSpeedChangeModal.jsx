import * as React from 'react'
import { graphql } from 'react-apollo'
import ReactModal from 'react-modal'
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
    const playerId = lms.car({ id: this.props.carId }).playerId
    this.ackSpeedChange({
      matchId: this.props.matchData.match.id,
      playerId: playerId,
    })
  }

  handleEatIt(e) {
    e.stopPropagation()
  }

  changeList(lms) {
    const speedDeltaStr = (car) => {
      const delta = car.status.speed - car.status.speedInitThisTurn
      const sign = delta > 0 ? '+' : '' // because negative numbers have a -
      return delta === 0 ? '' : `(${sign}${delta}mph)`
    }

    const data = lms.cars().map((car) => {
      return (
        <>
          <span style={{ fontSize: '28px', whiteSpace: 'nowrap' }}>
            <span style={{ align: 'left', color: car.color }}>{car.name}</span>
            <span style={{ margin: '2em' }}>
              {car.status.speed} mph {speedDeltaStr(car)}
            </span>
          </span>
          <br />
        </>
      )
    })
    return (
      <fieldset>
        <legend>Speed Changes</legend>
        {data}
      </fieldset>
    )
  }

  render() {
    const lms = new LocalMatchState(this.props.matchData)
    const car = lms.car({ id: this.props.carId })
    const theCar = car.playerId === localStorage.getItem('playerId')

    if (!theCar) {
      return <></>
    }

    const showModal = this.props.matchData.match.time.phase.playersToAckSpeedChange.includes(car.playerId)

    let color = car.color,
      name = car.name
    if (this.props.matchData.match.time.phase.moving) {
      color = lms.car({ id: this.props.matchData.match.time.phase.moving }).color
      name = lms.car({ id: this.props.matchData.match.time.phase.moving }).name
    }

    return (
      <>
        <RevealSpeedChangeKeystrokes matchData={this.props.matchData} carId={this.props.carId} />
        <div onClick={this.handleEatIt}>
          <ReactModal className={'Modal.Content'} overlayClassName={'Modal.Overlay'} key={uuid()} isOpen={showModal}>
            <fieldset className="ModalFieldset">
              <legend style={{ color: color }}>{name}</legend>
              {this.changeList(lms)}
              <span className="flexCentered">
                <button onClick={this.handleClose} className={'ReactModal__Buttons'}>
                  Ok
                </button>
                <br />
              </span>
            </fieldset>
          </ReactModal>
          <ReactModal className={'Modal.Content'} overlayClassName={'Modal.Overlay'} key={uuid()} isOpen={!showModal}>
            <fieldset className="ModalFieldset">
              <legend style={{ color: color }}>{name}</legend>
              {this.changeList(lms)}
              <span className="flexCentered">waiting . . .</span>
            </fieldset>
          </ReactModal>
        </div>
      </>
    )
  }
}

ReactModal.setAppElement('#root')

export default compose(ACK_SPEED_CHANGE)(RevealSpeedChangeModal)
