import * as React from 'react'
import Modal from 'react-modal'
import {connect} from "react-redux"
import MatchWrapper from '../../../utils/wrappers/MatchWrapper'
import { store, shiftModal } from '../../../redux'
import '../../../App.css'

const mapStateToProps = (state) => {
  return({ matches: state.matches })
}

class ModalHandler extends React.Component {
  // props.matchId
  constructor(props) {
    super(props)
    this.state = { showModal: this.modalToShow() }
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  modalToShow() {
    const match = new MatchWrapper({ match: this.props.matches[this.props.matchId] })
    const result = (match.currentCar().modals.length > 0)
    return(result)
  }

  handleOpenModal () {
    this.setState({ showModal: true });
  }

  handleCloseModal () {
    const match = new MatchWrapper({ match: this.props.matches[this.props.matchId] })
    store.dispatch(shiftModal({ matchId: this.props.matchId, carId: match.currentCarId() }))
    this.setState({ showModal: this.modalToShow() });
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
        fontFamily: 'fantasy',
        fontSize: '80px',
        fontVariant: 'smallCaps'
      }
    })
  }

  buttonStyle() {
    return ({
      backgroundColor: 'black',
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
      <Modal
        isOpen={this.state.showModal}
        onRequestClose={this.handleCloseModal}
        style={this.customStyles()}
        contentLabel="Example Modal"
      >
        <span>
          { modals[0].text }
        </span>
        <br/><br/>
        <button onClick={this.handleCloseModal} style={this.buttonStyle()}>Close</button>
      </Modal>
    )
  }

  render() {
    const match = new MatchWrapper({ match: this.props.matches[this.props.matchId] })
    return(
      <div>
        { this.renderModal(match.currentCar().modals) }
      </div>
    )
  }
}



//document.querySelector("#root")
Modal.setAppElement('#root')
//Modal.setAppElement('body')

export default connect(mapStateToProps) (ModalHandler)
