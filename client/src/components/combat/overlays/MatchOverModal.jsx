import * as React from 'react'
import ReactModal from 'react-modal'
import uuid from 'uuid/v4'

class MatchOverModal extends React.Component {
  render() {
    return (
      <>
        <div>
          <ReactModal className={'Modal.Content'} overlayClassName={'Modal.Overlay'} key={uuid()} isOpen={true}>
            <fieldset className="ModalFieldset">
              <span className="flexCentered">Match</span>
              <span className="flexCentered">Over</span>
            </fieldset>
          </ReactModal>
        </div>
      </>
    )
  }
}

ReactModal.setAppElement('#root')

export default (MatchOverModal)
