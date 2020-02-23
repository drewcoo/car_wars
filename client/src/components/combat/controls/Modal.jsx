import * as React from 'react'
import Modal from 'react-modal'
import LocalMatchState from '../lib/LocalMatchState'

import '../../../App.css'

class ModalHandler extends React.Component {
  constructor(props) {
    super(props)
    this.state = { showModal: this.modalToShow() }
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  modalToShow() {
    return (new LocalMatchState(this.props.matchData).currentCar().modals.length > 0)
  }

  handleOpen () {
    this.setState({ showModal: true })
  }

  handleClose () {
    this.setState({ showModal: this.modalToShow() })
  }

  customStyles() {
    return ({
      content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
        backgroundColor: 'black',
        color: 'white',
        border: '3px solid red',
        borderRadius: '40px',
        fontFamily: 'fantasy',
        fontSize: '80px',
        fontVariant: 'smallCaps'
      }
    })
  }

  buttonStyle() {
    return ({
      backgroundColor: 'black',
      border: '3px solid red',
      color: 'white',
      float: 'right',
      fontFamily: 'fantasy',
      fontSize: '80px',
      fontVariant: 'smallCaps'
    })
  }

  renderModal(modals) {
    if (modals.length === 0) { return null }

    return(
      /* onRequestClose={this.handleClose}  */
      <Modal
        isOpen={ this.state.showModal }
        style={ this.customStyles() }
        contentLabel="Example Modal"
      >
        <span>
          { modals[0].text }
        </span>
        <br/><br/>
        <button
          onClick={ this.handleClose }
          style={ this.buttonStyle() }
        >
          Close
        </button>
      </Modal>
    )
  }

  render() {
    return(
      <div>
        { this.renderModal(new LocalMatchState(this.props.matchData).currentCar().modals) }
      </div>
    )
  }
}

Modal.setAppElement('#root')

export default ModalHandler
