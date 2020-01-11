import * as React from 'react'
import Modal from 'react-modal'
import {connect} from "react-redux"
import MatchWrapper from '../../../utils/wrappers/MatchWrapper'
import { store, shiftModal } from '../../../redux'
import '../../../App.css'

const mapStateToProps = (state) => {
  return({ matches: state.matches })
}

class PlayerModal extends React.Component {
  // props.matchId
  constructor(props) {
    super(props)
    this.state = { showModal: this.initialModalState() }
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  initialModalState() {
    const match = new MatchWrapper({ match: this.props.matches[this.props.matchId] })
    const result = (match.currentPlayer().modals.length > 0)
    console.log(match.currentPlayer().modals.length)
    console.log(`show modal? ${result}`)
    return(result)
  }

  handleOpenModal () {
    this.setState({ showModal: true });
  }

  handleCloseModal () {
    const match = new MatchWrapper({ match: this.props.matches[this.props.matchId] })
    store.dispatch(shiftModal({ matchId: this.props.matchId, playerId: match.currentPlayerId() }))
    this.setState({ showModal: false });
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
    const currentPlayer = new MatchWrapper({ match: this.props.matches[this.props.matchId] }).currentPlayer()
    return(
      <div>
        { this.renderModal(currentPlayer.modals) }
      </div>
    )
  }
}

Modal.setAppElement('body')

export default connect(mapStateToProps) (PlayerModal)
