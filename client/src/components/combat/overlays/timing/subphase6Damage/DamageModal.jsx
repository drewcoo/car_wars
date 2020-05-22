import * as React from 'react'
import { graphql } from 'react-apollo'
import ReactModal from 'react-modal'
import { compose } from 'recompose'
import uuid from 'uuid/v4'
import '../../../../../App.css'
import ackDamage from '../../../../graphql/mutations/ackDamage'
import Damage from '../../vehicle/Damage'
import LocalMatchState from '../../../lib/LocalMatchState'
import DamageKeystrokes from './DamageKeystrokes'
import PropTypes from 'prop-types'

const ACK_DAMAGE = graphql(ackDamage, { name: 'ackDamage' })

class DamageModal extends React.Component {
  constructor(props) {
    super(props) // matchData and carId
    this.handleClose = this.handleClose.bind(this)
    this.handleEatIt = this.handleEatIt.bind(this)
  }

  async ackDamage({ matchId, playerId }) {
    this.props.ackDamage({ variables: { matchId, playerId } })
  }

  handleClose() {
    const lms = new LocalMatchState(this.props.matchData)
    const playerId = lms.car({ id: this.props.carId }).playerId
    this.ackDamage({
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
    const theCar = car.playerId === localStorage.getItem('playerId')

    if (!theCar) {
      return <></>
    }
    
    if (!theCar) {
      return (
        <div onClick={this.handleEatIt}>
          <Damage
            key={`damCar-${car.id}`}
            client={this.props.client}
            matchData={new LocalMatchState(this.props.matchData).data}
            carId={car.id}
          />
        </div>
      )
    }

    const showModal = this.props.matchData.match.time.phase.playersToAckDamage.includes(car.playerId)

    /*
    const allDamage = lms.cars().map(car => {
      return (<Damage
        key={`damCar-${car.id}`}
        client={this.props.client}
        matchData={new LocalMatchState(this.props.matchData).data}
        carId={car.id}
      />)
    })
    */

    let color = car.color,
      name = car.name
    if (this.props.matchData.match.time.phase.moving) {
      color = lms.car({ id: this.props.matchData.match.time.phase.moving }).color
      name = lms.car({ id: this.props.matchData.match.time.phase.moving }).name
    }

    return (
      <>
        <div onClick={this.handleEatIt}>
          <ReactModal className={'Modal.Content'} overlayClassName={'Modal.Overlay'} key={uuid()} isOpen={showModal}>
            <fieldset className="ModalFieldset">
              <legend style={{ color: color }}>{name}</legend>

              <DamageKeystrokes matchData={this.props.matchData} carId={this.props.carId} />
              <span className="flexCentered">review</span>
              <span className="flexCentered">damage</span>
              <br />
              <span className="flexCentered">
                <button onClick={this.handleClose} className={'ReactModal__Buttons'}>
                  Done
                </button>
              </span>
            </fieldset>
          </ReactModal>
          <ReactModal className={'Modal.Content'} overlayClassName={'Modal.Overlay'} key={uuid()} isOpen={!showModal}>
            <fieldset className="ModalFieldset">
              <legend style={{ color: color }}>{name}</legend>
              <br />
              waiting
              <br />
              <br />
            </fieldset>
          </ReactModal>
        </div>
      </>
    )
  }
}

DamageModal.propTypes = {
  ackDamage: PropTypes.func,
  carId: PropTypes.string,
  client: PropTypes.object,
  matchData: PropTypes.object,
}

ReactModal.setAppElement('#root')

export default compose(ACK_DAMAGE)(DamageModal)
