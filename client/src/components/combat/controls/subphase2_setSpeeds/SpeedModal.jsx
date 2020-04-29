import * as React from 'react'
import Modal from 'react-modal'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import SpeedKeystrokes from './SpeedKeystrokes'
import SpeedSelector from './SpeedSelector'
import LocalMatchState from '../../lib/LocalMatchState'
import acceptSpeed from '../../../graphql/mutations/acceptSpeed'
import '../../../../App.css'

const ACCEPT_SPEED = graphql(acceptSpeed, { name: 'acceptSpeed' })

class SpeedModal extends React.Component {
  constructor (props) {
    super(props)
    this.handleClose = this.handleClose.bind(this)
    this.handleBugMeNot = this.handleBugMeNot.bind(this)
  }

  async speedAccepter ({ id, bugMeNot = false }) {
    this.props.acceptSpeed({ variables: { id, bugMeNot } })
  }

  handleBugMeNot () {
    this.speedAccepter({ id: this.props.carId, bugMeNot: true })
  }

  handleClose () {
    this.speedAccepter({ id: this.props.carId })
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
      // no overlay - squished into nonexistence
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
    return (
      <>
        <Modal isOpen={ !car.phasing.showSpeedChangeModal } style={ this.customStyles() }>
          <br/>setting speeds . . .<br/>&nbsp;
        </Modal>
        <Modal isOpen={ car.phasing.showSpeedChangeModal } style={ this.customStyles() }>
          <span>
            <span style={ { color: car.color } }>{car.color}</span> change speed
          </span>
          <br/>
          <div className='ActionControls'>
            <SpeedKeystrokes carId={this.props.carId} matchData={ this.props.matchData } />
            <SpeedSelector matchData={ this.props.matchData } carId={this.props.carId} />
            <br/>
            <button onClick={ this.handleClose } style={ this.buttonStyle() } >
              Ok
            </button>
            <button onClick={ this.handleBugMeNot } style={ this.buttonStyle() } >
              Next Turn
            </button>
          </div>
        </Modal>
      </>
    )
  }
}

Modal.setAppElement('#root')

export default compose(
  ACCEPT_SPEED
)(SpeedModal)
