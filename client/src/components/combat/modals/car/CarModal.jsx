import * as React from 'react'
import Modal from 'react-modal'
import { compose } from 'recompose'
import CarInset from '../../CarInset'
import CarStats from '../../CarStats'
import LocalMatchState from '../../lib/LocalMatchState'
import '../../../../App.css'

class CarModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      count: 0,
      viewIndex: 0,
      views: ['inset', 'stats']
    }
    this.handleClose = this.handleClose.bind(this)
    this.handleSwitch = this.handleSwitch.bind(this)
  }

  async speedAccepter ({ id, bugMeNot = false }) {
    this.props.acceptSpeed({ variables: { id, bugMeNot } })
  }

  handleClose (e) {
    this.props.modalClose(e)
  }

  customStyles () {
    return ({
      content: {
        position: 'fixed',
        // top: position.y - 200 ,
        //  top: 'auto',
        // left: position.x + 100,
        // right: this.props.position.x + 200,
        // left: 100,
        // left: '20%',
        left: 'auto',
        right: 'auto',
        bottom: 'auto',
        // marginRight: '-50%',
        transform: 'translate(50%, 0%)',
        /// ///maxWidth: '200',
        backgroundColor: 'black',
        color: 'white',
        border: '3px solid white',
        // borderRadius: '20px',
        fontFamily: 'fantasy',
        fontSize: '16px',
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
      border: '3px solid white',
      borderRadius: '20px',
      color: 'white',
      float: 'right',
      fontFamily: 'fantasy',
      fontSize: '40px',
      fontVariant: 'smallCaps'
    })
  }

  view () {
    switch (this.state.views[this.state.viewIndex]) {
      case 'inset':
        return (<CarInset
          matchData={ this.props.matchData }
          carId={ this.props.carId }
        />)
      case 'stats':
        return (<CarStats matchData={ this.props.matchData } carId={ this.props.carId } />)
      default:
        throw new Error(`unknown view index" ${this.state.viewIndex}`)
    }
  }

  handleSwitch () {
    const newIndex = ((this.state.viewIndex + 1) % this.state.views.length)
    this.setState({ viewIndex: newIndex })
  }

  render () {
    const lms = new LocalMatchState(this.props.matchData)
    const car = lms.car({ id: this.props.carId })
    const player = lms.player(car.playerId)

    return (
        <>
          <Modal
            id={`${this.props.carId}-modal`}
            isOpen={ this.props.showModal }
            style={ this.customStyles() }
          >
            <span onClick={ this.handleSwitch }>
              <span style={ { color: car.color, fontSize: '40px' } }>{player.name}&nbsp;&nbsp;{ car.name }</span>
              <div style={ { float: 'center' } }>
                { this.view() }
              </div>
              <div style={ { float: 'right' } }>
                <button onClick={ this.handleClose } style={ this.buttonStyle() } >
                  Ok
                </button>
              </div>
            </span>
          </Modal>
        </>
    )
  }
}

Modal.setAppElement(document.getElementById('ArenaMap')) // '#root')

export default compose(
)(CarModal)
