import * as React from 'react'
import Modal from 'react-modal'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import ManeuverKeystrokes from './ManeuverKeystrokes'
import ManeuverSelector from './ManeuverSelector'
import LocalMatchState from '../../lib/LocalMatchState'
import ViewElement from '../../lib/ViewElement'
import '../../../../App.css'

import { INCH } from '../../../../utils/constants'

import doMove from '../../../graphql/mutations/doMove'

const DO_MOVE = graphql(doMove, { name: 'doMove' })

class ManeuverModal extends React.Component {
  constructor (props) {
    super(props) // matchData and carId
    this.handleAccept = this.handleAccept.bind(this)
    this.handleEatIt = this.handleEatIt.bind(this)
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

  handleAccept () {
    console.log('modal accept')
    this.doMove({ id: this.props.carId })
  }

  handleEatIt (e) {
    e.stopPropagation()
  }

  reading () {
    const lms = new LocalMatchState(this.props.matchData)
    const car = lms.car({ id: this.props.carId })
    const maneuver = car.status.maneuvers[car.phasing.maneuverIndex]
    if (maneuver === 'bend' || maneuver === 'swerve') {
      let deg = car.phasing.rect.facing - car.rect.facing
      let dirStr = ''
      if (deg > 0) dirStr = 'right'
      if (deg < 0) dirStr = 'left'
      if (deg > 180) { deg = (360 - deg) }
      // &#x2190; &#x2192;
      return (
        <>
          <span className='flexCentered'>
            <ManeuverSelector carId={this.props.carId} matchData={ this.props.matchData } />
          </span>
      <span className='flexCentered'>{ dirStr }</span>
          <span className='flexCentered'>&#xa0;{deg}&#176;&#xa0;</span>
        </>
      )
    } else if (maneuver === 'drift') {
      const wouldBeCarRect = car.rect.move({ degrees: car.rect.facing, distance: INCH })
      const dist = wouldBeCarRect.brPoint().distanceTo(car.phasing.rect.brPoint())
      console.log(dist)
      let distStr = 'steep'
      if (dist < 29) { distStr = '' }
      if (dist < 1) { distStr = 'no' }
      const dir = wouldBeCarRect.brPoint().degreesTo(car.phasing.rect.brPoint()) - car.rect.facing
      console.log(dir)
      let dirStr = ''
      if (dir > 0) { dirStr = 'right' }
      if (dir < 0) { dirStr = 'left' }
      return (
        <>
          <span className='flexCentered'>{ distStr }</span>
          <span className='flexCentered'>
            <ManeuverSelector carId={this.props.carId} matchData={ this.props.matchData } />
          </span>
          <span className='flexCentered'>{ dirStr }</span>
        </>
      )
    } else {
      return (
        <span className='flexCentered'>
          <ManeuverSelector carId={this.props.carId} matchData={ this.props.matchData } />
        </span>
      )
    }
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

    console.log(car)

    const handlers = {
      accept: this.handleAccept
    }

    const color = lms.car({ id: this.props.matchData.match.time.phase.moving }).color
    return (
      <div onClick={ this.handleEatIt }>
        <Modal
          isOpen={ !showCar }
          className={'Modal.Content'}
          overlayClassName={'Modal.Overlay'}
        >
          <br/><span style={ { color: color } }>{lms.car({ id: this.props.matchData.match.time.phase.moving }).name}</span>
          <br/>
          moving<br/>&nbsp;
        </Modal>
        <Modal
          isOpen={ showCar }
          className={'Modal.Content'}
          overlayClassName={'Modal.Overlay'}
        >
          <ManeuverKeystrokes handlers={handlers} client={this.props.client} matchData={ this.props.matchData } />
          <span className='flexCentered' style={ { color: car.color } }>{car.name}</span>
          <span className='flexCentered'>maneuver</span>
          {this.reading()}
          <br/>
          <br/>
          <span className='flexCentered'>
            <button className={'ReactModal__Buttons'} onClick={ this.handleAccept }>
              Ok
            </button>
          </span>
        </Modal>
      </div>
    )
  }
}

Modal.setAppElement('#root')

export default compose(
  DO_MOVE
)(ManeuverModal)
