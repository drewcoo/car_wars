import React from 'react'
import Modal from 'react-modal'
import { compose } from 'recompose'
import CarInset from './CarInset'
import CarStats from './CarStats'
import Log from './Log'
import LocalMatchState from '../../../lib/LocalMatchState'
import '../../../../../App.css'
import CarKeystrokes from './CarKeystrokes'

/*
interface CarModalProps {
  carId: string
  matchData: any
  modalClose?: (event: React.MouseEvent<HTMLElement>) => any
  showModal: boolean
}

interface CarModalState {
  count: number
  viewIndex: number
  views: string[]
}
*/

class CarModal extends React.Component /*<CarModalProps, CarModalState>*/ {
  constructor(props /*: any*/) {
    super(props)
    this.state = {
      count: 0,
      viewIndex: 0,
      views: ['inset', 'stats', 'log'],
    }
    this.handleClose = this.handleClose.bind(this)
    this.handleSwitch = this.handleSwitch.bind(this)
  }

  handleClose(event /*: React.MouseEvent<HTMLElement>*/) {
    this.props.modalClose(event)
    event.stopPropagation()
  }

  customStyles() {
    return {
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
        opacity: 0.8,
      },
      // no overlay - squished into nonexistence
      overlay: {
        backgroundColor: 'rgba(0,0,0, .5)',
        top: '50%',
        bottom: '50%',
      },
    }
  }

  view() {
    switch (this.state.views[this.state.viewIndex]) {
      case 'inset':
        return <CarInset matchData={this.props.matchData} carId={this.props.carId} />
      case 'stats':
        return <CarStats matchData={this.props.matchData} carId={this.props.carId} />
      case 'log':
        return <Log matchData={this.props.matchData} carId={this.props.carId} />
      default:
        throw new Error(`unknown view index" ${this.state.viewIndex}`)
    }
  }

  handleSwitch(event /*: React.MouseEvent<HTMLElement>*/) {
    const newIndex = (this.state.viewIndex + 1) % this.state.views.length
    this.setState({ viewIndex: newIndex })
    event.stopPropagation()
  }

  render() {
    const lms = new LocalMatchState(this.props.matchData)
    const car = lms.car({ id: this.props.carId })
    const player = lms.player({ id: car.playerId })

    const handlers = {
      close: this.props.modalClose,
      switchUp: this.handleSwitch,
      switchDown: this.handleSwitch,
    }

    let keystrokes = <></>
    if (this.props.showModal) {
      keystrokes = <CarKeystrokes handlers={handlers} carId={this.props.carId} matchData={this.props.matchData} />
    }

    return (
      <div onClick={this.handleSwitch}>
        {keystrokes}
        <Modal id={`${this.props.carId}-modal`} isOpen={this.props.showModal} style={this.customStyles()}>
          <span>
            <span style={{ color: car.color, fontSize: '40px' }}>
              {player.name}&nbsp;&nbsp;{car.name}
            </span>
            <div style={{ float: 'center' }}>{this.view()}</div>
            <div style={{ float: 'right' }}>
              <button className={'ReactModal__Buttons'} onClick={this.handleClose}>
                Ok
              </button>
            </div>
          </span>
        </Modal>
      </div>
    )
  }
}

Modal.setAppElement(document.getElementById('ArenaMap')) // '#root')

export default compose()(CarModal)
