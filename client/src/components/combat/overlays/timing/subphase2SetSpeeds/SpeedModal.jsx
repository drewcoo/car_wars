import * as React from 'react'
import ReactModal from 'react-modal'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import SpeedKeystrokes from './SpeedKeystrokes'
import SpeedSelector from './SpeedSelector'
import LocalMatchState from '../../../lib/LocalMatchState'
import acceptSpeed from '../../../../graphql/mutations/acceptSpeed'
import setSpeed from '../../../../graphql/mutations/setSpeed'
import '../../../../../App.css'

const ACCEPT_SPEED = graphql(acceptSpeed, { name: 'acceptSpeed' })
const SET_SPEED = graphql(setSpeed, { name: 'setSpeed' })

class SpeedModal extends React.Component {
  constructor(props) {
    super(props)
    this.handleBugMeNot = this.handleBugMeNot.bind(this)
    this.handleAccept = this.handleAccept.bind(this)
    this.handleEatIt = this.handleEatIt.bind(this)
    this.handleReset = this.handleReset.bind(this)
  }

  async speedAccepter({ id, bugMeNot = false }) {
    this.props.acceptSpeed({ variables: { id, bugMeNot } })
  }

  handleBugMeNot(e) {
    this.speedAccepter({ id: this.props.carId, bugMeNot: true })
  }

  handleAccept(e) {
    this.speedAccepter({ id: this.props.carId })
  }

  handleEatIt(e) {
    e.stopPropagation()
  }

  handleReset(e) {
    const lms = new LocalMatchState(this.props.matchData)
    const car = lms.car({ id: this.props.carId })
    this.props.setSpeed({ variables: { id: this.props.carId, speed: car.status.speed } })
    e.stopPropagation()
  }

  customStyles() {
    return ({
      content: {
        backgroundColor: 'floralwhite',
        borderRadius: '20px',
        color: 'black',
        border: '10px solid black',
        fontSize: '80px',
      },
    })
  }

  leftButton() {
    const lms = new LocalMatchState(this.props.matchData)
    const car = lms.car({ id: this.props.carId })
    const speedChanged = car.status.speed !== parseInt(car.phasing.speedChanges[car.phasing.speedChangeIndex].speed)

    if (speedChanged) {
      return (
        <button
          className={'ReactModal__Buttons'}
          onClick={ this.handleReset }
          style={ { backgroundColor: 'red', float: 'left', leftMargin: '45px' } }>
          <u>W</u>hoa!
        </button>
      )
    } else {
      return (
        <button
          className={'ReactModal__Buttons'}
          onClick={ this.handleBugMeNot }
          style={ { backgroundColor: 'red', float: 'left', leftMargin: '45px' } }
        >
          <u>T</u>urn { lms.time().turn.number + 1 }
        </button>
      )
    }
  }

  render() {
    const lms = new LocalMatchState(this.props.matchData)
    const car = lms.car({ id: this.props.carId })
    const theCar = (car.playerId === localStorage.getItem('playerId'))
    if (!theCar) { return (<></>) }

    const handlers = {
      accept: this.handleAccept,
      bugMeNot: this.handleBugMeNot,
    }

    return (
      <div onClick={ this.handleEatIt }>
        <ReactModal
          className={'Modal.Content'}
          overlayClassName={'Modal.Overlay'}
          isOpen={ !car.phasing.showSpeedChangeModal }
          style={ this.customStyles() }
        >
          <br/>
          <span className='flexCentered'>TODO: random</span>
          <span className='flexCentered'>foo x-ing</span>
          <br/>
        </ReactModal>
        <ReactModal
          className={'Modal.Content'}
          overlayClassName={'Modal.Overlay'}
          isOpen={ car.phasing.showSpeedChangeModal }
          style={ this.customStyles() }
        >
          <SpeedKeystrokes carId={this.props.carId} matchData={ this.props.matchData } handlers={handlers} />
          <span className='flexCentered'>
            change
          </span>
          <span className='flexCentered'>
            <SpeedSelector matchData={ this.props.matchData } carId={this.props.carId} noLabel={ true } style={{ size: '100' }} />
          </span>
          <span className='flexCentered'>
            <u>s</u>peed
          </span>
          <div style={ { backgroundColor: 'red', height: '45px' } }>
            { this.leftButton() }
            <button className={'ReactModal__Buttons'} style={{ backgroundColor: 'red' }} onClick={ this.handleAccept } >&nbsp;&nbsp;Ok&nbsp;&nbsp;</button>
          </div>
        </ReactModal>
      </div>
    )
  }
}

ReactModal.setAppElement('#root')

export default compose(
  ACCEPT_SPEED,
  SET_SPEED
)(SpeedModal)
