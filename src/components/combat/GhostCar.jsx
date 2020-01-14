import * as React from 'react'
import {connect} from "react-redux"
import MatchWrapper from '../../utils/wrappers/MatchWrapper'
import Car from './Car'
import { store,
         ghostTurnBend, ghostTurnSwerve, ghostMoveDrift,
         ghostForward, ghostHalf, ghostReset, ghostShowCollisions,
         maneuverNext, maneuverSet,
         //maneuverPrevious,
       } from '../../redux'
import FiringArc from './FiringArc'
import Point from '../../utils/geometry/Point'
import { degreesDifference } from '../../utils/conversions'

const mapStateToProps = (state) => {
  return({ matches: state.matches })
}

class GhostCar extends React.Component {
  /*
  props: any
  // props.matchId
  state: any
  */

  constructor(props) {
    super(props)
    this.state = {
      drag: false,
      firstPoint: null,
      lastPoint: null
    }

    this.handleOnDragStart = this.handleOnDragStart.bind(this)
    this.handleOnDrag = this.handleOnDrag.bind(this)
    this.handleOnDragStop = this.handleOnDragStop.bind(this)
  }

////////////////////////
  showHideCar(car, manIdxDelta) {
    var index = (car.phasing.maneuverIndex + manIdxDelta) %
                 car.status.maneuvers.length
    if (car.status.maneuvers[index] === 'none') {
      store.dispatch(ghostReset({ matchId: this.props.matchId, id: car.id }))
    } else if (car.status.maneuvers[index] === 'half') {
      store.dispatch(ghostHalf({ matchId: this.props.matchId, id: car.id }))
    }else {
      store.dispatch(ghostForward({ matchId: this.props.matchId, id: car.id }))
    }
    store.dispatch(ghostShowCollisions({ matchId: this.props.matchId, id: car.id }))
  }

  currentManeuver(car) {
    return car.status.maneuvers[car.phasing.maneuverIndex]
  }

  turnRight(fRight) {
    var car = new MatchWrapper({ match: this.props.matches[this.props.matchId] }).currentCar()

    switch (this.currentManeuver(car)) {
      case 'forward':
        store.dispatch(maneuverSet({
          matchId: this.props.matchId,
          id: car.id,
          maneuverIndex: car.status.maneuvers.indexOf('bend')
        }))
        // Make it easy to maneuver (bend from forward position) as long as that's possible.
        if (!car.status.maneuvers.includes('bend')) { break }
        // fall through
      case 'bend':
        store.dispatch(ghostTurnBend({ matchId: this.props.matchId, id: car.id, degrees: (fRight ? 15 : -15) }))
        break
      case 'drift':
        store.dispatch(ghostMoveDrift({ matchId: this.props.matchId, id: car.id, direction: (fRight ? 'right' : 'left') }))
        break
      case 'swerve':
        store.dispatch(ghostTurnSwerve({ matchId: this.props.matchId, id: car.id, degrees: (fRight ? 15 : -15) }))
        break
      default:
        console.log(`maneuver: ${this.currentManeuver(car)}`)
        return
    }
    store.dispatch(ghostShowCollisions({ matchId: this.props.matchId, id: car.id }))
  }


//////////////////////////

  initiallyDragging() {
    return false
  }

  touchPointFromEvent(event) {
    let result
    if(event.clientX) {
      // Mouse
      result = new Point({ x: event.screenX, y: event.screenY })
      // Was that the right X/Y to use? Page? Client?
    } else {
      // Otherwise assume touch
      result = new Point({ x: event.changedTouches[0].clientX,
                         y: event.changedTouches[0].clientY })
    }
    return result.toFixed(0)
  }

  handleOnDragStart(event) {
    const point = this.touchPointFromEvent(event)
    this.setState({ drag: false, firstPoint: point, lastPoint: point })
    console.log('start drag')
    console.log(`(${this.state.lastPoint}) --> (${point})`)
  }

  handleOnDrag(event) {
    if (this.state.firstPoint === null) { return }
    this.resolveSwipe(event)
    const point = this.touchPointFromEvent(event)
    console.log(`(${this.state.lastPoint}) --> (${point})`)
    this.setState({ drag: true, lastPoint: point })
  }

  resolveSwipe(event) {
    const point = this.touchPointFromEvent(event)
    console.log(`total move: (${this.state.lastPoint}) --> (${point})`)

    const car = new MatchWrapper({ match: this.props.matches[this.props.matchId] }).currentCar()

    const swipeMagnitude = this.state.firstPoint.distanceTo(this.state.lastPoint)
    console.log(`stroke magnitude: ${swipeMagnitude}`)
    if(swipeMagnitude < 5) { return }

    console.log(`(${this.state.firstPoint}) --> (${this.state.lastPoint})`)
    const swipeDirection = this.state.firstPoint.degreesTo(this.state.lastPoint)
    console.log(`stroke direction: ${swipeDirection}`)
    console.log(`(ghost) car facing: ${car.phasing.rect.facing}`)
    const deltaDirection = degreesDifference({ initial: car.phasing.rect.facing,
                                               second: swipeDirection })
    console.log(`degrees difference: ${deltaDirection}`)
    console.log(`swipe ${deltaDirection > 0 ? 'right' : 'left'}`)
    console.log(`stroke magnitude: ${this.state.firstPoint.distanceTo(this.state.lastPoint)}`)

    this.turnRight(deltaDirection > 0)
    //this.setState({ drag: false, firstPoint: null, lastPoint: null })
  }



  handleOnDragStop(event) {
    if (this.state.drag) {
      //this.resolveSwipe(event)
      console.log('stop drag?')
      // starting drag sets drag to false; don't bother here


    } else {
      const point = this.touchPointFromEvent(event)
      console.log(`total move: (${this.state.lastPoint}) --> (${point})`)

      const car = new MatchWrapper({ match: this.props.matches[this.props.matchId] }).currentCar()
      console.log(`it was a click: (${point})`)
      console.log('in move mode, select next maneuver')
      const args = { matchId: this.props.matchId, id: car.id }
      store.dispatch(maneuverNext(args))
      this.showHideCar(car, 1)
    }
  }

  render() {
    const match = new MatchWrapper({ match: this.props.matches[this.props.matchId] })
    return (
      <g
        //onClick={this.handleOnClick}
        onPointerDown={this.handleOnDragStart}
        onTouchStart={this.handleOnDragStart}

        onDrag={this.handleOnDrag}
        onMouseMove={this.handleOnDrag}
        onTouchMove={this.handleOnDrag}

        onMouseUp={this.handleOnDragStop}
        onTouchEnd={this.handleOnDragStop}
      >
        <FiringArc matchId={ this.props.matchId } />
        <Car
          matchId={ this.props.matchId }
          id={ match.currentCarId() }
          key='ghost'
          ghost={ true }
        />
      </g>

    )
  }
}

export default connect(mapStateToProps)(GhostCar)
