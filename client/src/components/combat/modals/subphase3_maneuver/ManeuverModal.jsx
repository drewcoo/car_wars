import * as React from 'react'
import Modal from 'react-modal'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import ManeuverKeystrokes from './ManeuverKeystrokes'
import ManeuverSelector from './ManeuverSelector'
import LocalMatchState from '../../lib/LocalMatchState'
import ViewElement from '../../lib/ViewElement'
import '../../../../App.css'

import doMove from '../../../graphql/mutations/doMove'

const DO_MOVE = graphql(doMove, { name: 'doMove' })

class ManeuverModal extends React.Component {
  constructor (props) {
    super(props) // matchData and carId
    this.handleClose = this.handleClose.bind(this)
  }

  async doMove ({ id }) {
    this.props.doMove({
      variables: {
        id: id,
        maneuver: 'forward?',
        howFar: 77 // currently bogus
      }
    })
  }

  handleClose () {
    this.doMove({ id: this.props.carId })
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

    const showCar = (this.props.matchData.match.time.phase.moving === this.props.carId)
    if (showCar && !this.props.client) { return (<></>) }

    // BUGBUG: I think this is faliing because the active car and its shadowy self
    // have the same id.
    ViewElement(this.props.carId)

    const color = lms.car({ id: this.props.matchData.match.time.phase.moving }).color
    return (
      <>
        <Modal isOpen={ !showCar } style={ this.customStyles() }>
          <br/><span style={ { color: color } }>{color}</span> moving<br/>&nbsp;
        </Modal>
        <Modal isOpen={ showCar } style={ this.customStyles() }>
          <span>
            <span style={ { color: car.color } }>{car.color}</span> maneuver
          </span>
          <ManeuverKeystrokes client={this.props.client} matchData={ this.props.matchData } />
          <br/>
          <div className='ActionControls'>
            <ManeuverSelector carId={this.props.carId} matchData={ this.props.matchData } />
            <br/>
            <button onClick={ this.handleClose } style={ this.buttonStyle() } >
              Ok
            </button>
          </div>
        </Modal>
      </>
    )
  }
}

Modal.setAppElement('#root')

export default compose(
  DO_MOVE
)(ManeuverModal)
