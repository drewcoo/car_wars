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
    const playerId = lms.car({ id: this.props.carId }).playerId
    this.ackSpeedChange({
      matchId: this.props.matchData.match.id,
      playerId: playerId,
    })
  }

  handleEatIt(e) {
    e.stopPropagation()
  }

  changeList(lms, showOk) {
    const speedDeltaStr = (car) => {
      const delta = car.status.speed - car.status.speedInitThisTurn
      const sign = delta > 0 ? '+' : '' // because negative numbers have a -
      return delta === 0 ? '' : `(${sign}${delta}mph)`
    }

    const data = lms.cars().map((car) => {
      return (
        <div key={uuid()}>
          <span style={{ fontSize: '28px', whiteSpace: 'nowrap' }}>
            <span style={{ align: 'left', color: car.color }}>{car.name}</span>
            <span style={{ margin: '2em' }}>
              {car.status.speed} mph {speedDeltaStr(car)}
            </span>
          </span>
        </div>
      )
    })

    const buttonOrNot = () => {
      if (!showOk) {
        return <span className="flexCentered">waiting . . .</span>
      }
      return (
        <span className="flexCentered">
          <button onClick={this.handleClose} className={'ReactModal__Buttons'} style={{ float: 'right' }}>
            &nbsp;&nbsp;Ok&nbsp;&nbsp;
          </button>
        </span>
      )
    }

    /*
    const legendStyle = {
      textShadow: '-2px 2px 0 #000, 2px 2px 0 #000, 2px -2px 0 #000, -2px -2px 0 #000',
    }
    */

    return (
      <fieldset className={'ModalFieldset'}>
        <legend className={'ModalLegend'}>Speed Changes</legend>
        {data}
        <br />
        {buttonOrNot()}
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

    return (
      <>
        <RevealSpeedChangeKeystrokes matchData={this.props.matchData} carId={this.props.carId} />
        <div onClick={this.handleEatIt}>
          <ReactModal className={'Modal.Content'} overlayClassName={'Modal.Overlay'} key={uuid()} isOpen={true}>
            {this.changeList(lms, showModal)}
          </ReactModal>
        </div>
      </>
    )
  }
}

ReactModal.setAppElement('#root')

export default compose(ACK_SPEED_CHANGE)(RevealSpeedChangeModal)
