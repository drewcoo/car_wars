import * as React from 'react'
import Car from './Car'
import Maneuver from './controls/lib/Maneuver'
import FiringArc from './FiringArc'

import Point from '../../utils/geometry/Point'
import { degreesDifference } from '../../utils/conversions'
import LocalMatchState from './lib/LocalMatchState'
import ViewElement from './lib/ViewElement'

class GhostCar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      drag: false,
      firstPoint: null,
      lastPoint: null
    }
    this.startHandler = this.startHandler.bind(this)
    this.moveHandler = this.moveHandler.bind(this)
    this.stopHandler = this.stopHandler.bind(this)
  }

  componentDidUpdate() {
    ViewElement('shotResult') ||
    ViewElement('reticle') ||
    ViewElement(new LocalMatchState(this.props.matchData).currentCarId())
  }

  eventPoint(event) {
    // First, get the page coordinates of the click or touch.
    let result
    if(event.clientX) { // Mouse - correct coords
      result = new Point({ x: event.pageX, y: event.pageY })
    } else { // Otherwise assume touch - incorrect
      result = new Point({ x: event.changedTouches[0].pageX,
                           y: event.changedTouches[0].pageY })
    }
    // Now convert to the relative coords of the ghost car on the ArenaMap.
    const bodyBounding = document.body.getBoundingClientRect()
    const elemBounding = document.getElementById('ArenaMap').getBoundingClientRect()
    result.x -= elemBounding.left + bodyBounding.left
    result.y -= elemBounding.top + bodyBounding.top
    return result.toFixed(0)
  }

  handleOnDrag(event) {
    this.moveHandler(event)
  }

  handleOnDragStop(event) {
    this.stopHandler(event)
  }

  startHandler(event) {
    const point = this.eventPoint(event)
    this.setState({ drag: false, firstPoint: point, lastPoint: point })
  }

  moveHandler(event) {
    if (this.state.firstPoint === null) {
      if (this.state.drag === false) {
        this.stopHandler(event)
      }
      return
    }
    const point = this.eventPoint(event)

    //
    // This doesn't work yet but it's sort of the idea.
    // I'll get back to it later.
    //
    // The point from eventPoint() is in the context of the car coorinates.
    // Move left if what? If swiped in a direction starting left and currently
    // left of the current position of the ghost car? Not sure.
    // Should talk it out.
    //
    const lms = new LocalMatchState(this.props.matchData)
    const car = lms.currentCar()

    const swipeMagnitude = this.state.firstPoint.distanceTo(point) //this.state.lastPoint)
    if(swipeMagnitude < 1) {
      this.stopHandler(event)
      return
    }
    const swipeDirection = this.state.firstPoint.degreesTo(this.state.lastPoint)
    const deltaDirection = degreesDifference({ initial: car.phasing.rect.facing,
                                               second: swipeDirection })
    Maneuver.turnRight({ matchId: lms.matchId(),
                         car: car,
                         fRight: (deltaDirection > 0) })
    this.setState({ drag: true, lastPoint: point })
  }

  stopHandler(event) {
    if (this.state.drag) {
      // stop dragging
    } else {
      // not a drag but a click
      const lms = new LocalMatchState(this.props.matchData)
      Maneuver.next({ matchId: lms.matchId(), car: lms.currentCar() })
    }
    this.setState({ drag: false, firstPoint: null, lastPoint: null })
  }

  render() {
    const lms = new LocalMatchState(this.props.matchData)
    return (
      <g
      //  onClick={this.startHandler}
        onMouseDown={this.startHandler}
        onTouchStart={this.startHandler}
        onMouseMove={this.moveHandler}
        onTouchMove={this.moveHandler}
      //  onMouseEnter={this.handleOnMouseDragStop}
      //  onMouseLeave={this.handleOnMouseDragStop}
        onMouseUp={this.stopHandler}
      //  onMouseOut={this.handleOnMouseDragStop}
        onTouchEnd={this.stopHandler}
      >
        <FiringArc client={this.props.client} matchData={ lms.data } />
        <Car
          client={this.props.client}
          matchData={ lms.data }
          id={ lms.currentCarId() }
          key='ghost'
          ghost={ true }
        />
      </g>
    )
  }
}

export default GhostCar
