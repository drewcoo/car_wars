import * as React from 'react'
import { graphql } from 'react-apollo'
import ReactModal from 'react-modal'
import { compose } from 'recompose'
import '../../../../../App.css'
import { INCH } from '../../../../../utils/constants'
import { degreesDifference } from '../../../../../utils/conversions'
import acceptMove from '../../../../graphql/mutations/acceptMove'
import HandlingStats from '../../vehicle/modal/HandlingStats'
import LocalMatchState from '../../../lib/LocalMatchState'
import ViewElement from '../../../lib/ViewElement'
import ManeuverKeystrokes from './ManeuverKeystrokes'
import ManeuverSelector from './ManeuverSelector'

const DO_MOVE = graphql(acceptMove, { name: 'acceptMove' })

class ManeuverModal extends React.Component {
  constructor(props) {
    super(props) // matchData and carId
    this.handleAccept = this.handleAccept.bind(this)
    this.handleEatIt = this.handleEatIt.bind(this)
  }

  async acceptMove({ id }) {
    this.props.acceptMove({
      variables: {
        id: id,
        maneuver: 'straight?',
        howFar: 77, // currently bogus
      },
    })
  }

  handleAccept() {
    this.acceptMove({ id: this.props.carId })
  }

  handleEatIt(e) {
    e.stopPropagation()
  }

  reading() {
    const lms = new LocalMatchState(this.props.matchData)
    const car = lms.car({ id: this.props.carId })
    const maneuver = car.status.maneuvers[car.phasing.maneuverIndex]
    let dirStr = ''
    let distStr = ''
    if (maneuver === 'bend' || maneuver === 'swerve') {
      let deg = degreesDifference({
        initial: car.rect.facing,
        second: car.phasing.rect.facing,
      })
      if (deg > 0) dirStr = 'right'
      if (deg < 0) dirStr = 'left'
      if (deg > 180) {
        deg = 360 - deg
      }
      distStr = `${Math.abs(deg)}°`
    } else if (maneuver === 'drift') {
      const wouldBeCarRect = car.rect.move({
        degrees: car.rect.facing,
        distance: INCH,
      })
      const dist = wouldBeCarRect.brPoint().distanceTo(car.phasing.rect.brPoint())
      distStr = 'steep'
      if (dist < 29) {
        distStr = ''
      }
      if (dist < 1) {
        distStr = 'none'
      }
      if (distStr !== 'none') {
        const dir = wouldBeCarRect.brPoint().degreesTo(car.phasing.rect.brPoint()) - car.rect.facing
        dirStr = dir > 0 ? 'right' : 'left'
      }
    }

    return (
      <>
        <span className="flexCentered" style={{ height: '50px' }}>
          <ManeuverSelector carId={this.props.carId} matchData={this.props.matchData} />
        </span>
        <span className="flexCentered">
          &nbsp;{distStr} {dirStr}
        </span>
      </>
    )
  }

  customStyle() {
    return {
      content: {
        backgroundColor: 'black',
      },
    }
  }

  render() {
    const lms = new LocalMatchState(this.props.matchData)
    const car = lms.car({ id: this.props.carId })
    const theCar = car.playerId === localStorage.getItem('playerId')
    if (!theCar) {
      return <></>
    }

    const showCar = this.props.matchData.match.time.phase.moving === this.props.carId
    if (showCar && !this.props.client) {
      return <></>
    }

    // BUGBUG: I think this is faliing because the active car and its shadowy self
    // have the same id.
    ViewElement(this.props.carId)

    const handlers = {
      accept: this.handleAccept,
    }
    
    let color = car.color,
      name = car.name
    if (this.props.matchData.match.time.phase.moving) {
      color = lms.car({ id: this.props.matchData.match.time.phase.moving }).color
      name = lms.car({ id: this.props.matchData.match.time.phase.moving }).name
    }

    return (
      <div onClick={this.handleEatIt}>
        <ReactModal isOpen={!showCar} className={'Modal.Content'} overlayClassName={'Modal.Overlay'}>
          <fieldset className="ModalFieldset">
            <legend style={{ color: color }}>{name}</legend>
            moving . . .
            <br />
            <br />
          </fieldset>
        </ReactModal>

        <ReactModal isOpen={showCar} className={'Modal.Content'} overlayClassName={'Modal.Overlay'}>
          <fieldset className="ModalFieldset">
            <legend style={{ color: color }}>{name}</legend>
            <ManeuverKeystrokes handlers={handlers} client={this.props.client} matchData={this.props.matchData} />
            {this.reading()}
            <br />
            <span className="flexCentered">
              ↔↕&nbsp;&nbsp;&nbsp;
              <button className={'ReactModal__Buttons'} onClick={this.handleAccept}>
                &nbsp;Ok&nbsp;
              </button>
            </span>
            <hr />
            <span className="flexCentered">
              <HandlingStats matchData={this.props.matchData} carId={this.props.carId} />
            </span>
          </fieldset>
        </ReactModal>
      </div>
    )
  }
}

ReactModal.setAppElement('#root')

export default compose(DO_MOVE)(ManeuverModal)
