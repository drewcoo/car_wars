import * as React from 'react'
import {connect} from "react-redux"
import MatchWrapper from '../../utils/wrappers/MatchWrapper'
import Car from './Car'
import Maneuver from './controls/lib/Maneuver'
import FiringArc from './FiringArc'
import Point from '../../utils/geometry/Point'
import Intersection from '../../utils/geometry/Intersection'
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

    this.startHandler = this.startHandler.bind(this)
    this.moveHandler = this.moveHandler.bind(this)
    this.stopHandler = this.stopHandler.bind(this)
  }

  eventPoint(event) {
    // First, get the page coordinates of the click or touch.
    let result
    if(event.clientX) { // Mouse - correct coords
      //result = new Point({ x: event.screenX, y: event.screenY })
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
    console.log(event)
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
    console.log(this.props.matchId)
    const car = new MatchWrapper({ match: this.props.matches[this.props.matchId] }).currentCar()
    console.log(car.phasing.rect)
    console.log(`${car.phasing.rect.blPoint().toFixed(0)}  -  ${car.phasing.rect.flPoint().toFixed(0)}`)
    console.log(point)
    console.log(`${car.phasing.rect.brPoint().toFixed(0)}  -  ${car.phasing.rect.frPoint().toFixed(0)}`)
    console.log('----')

    const swipeMagnitude = this.state.firstPoint.distanceTo(point) //this.state.lastPoint)
    console.log(swipeMagnitude)
    if(swipeMagnitude < 1) {
      console.log(event)
      this.stopHandler(event)
      return
    }
    const swipeDirection = this.state.firstPoint.degreesTo(this.state.lastPoint)
    const deltaDirection = degreesDifference({ initial: car.phasing.rect.facing,
                                               second: swipeDirection })
    Maneuver.turnRight({ matchId: this.props.matchId,
                         car: car,
                         fRight: (deltaDirection > 0) })
    this.setState({ drag: true, lastPoint: point })
  }

  stopHandler(event) {
    console.log(this.state)
    if (this.state.drag) {
      // stop dragging
    } else {
      console.log('here')
      // not a drag but a click
      const car = new MatchWrapper({ match: this.props.matches[this.props.matchId] }).currentCar()
      Maneuver.next({ matchId: this.props.matchId, car: car })
    }
    this.setState({ drag: false, firstPoint: null, lastPoint: null })
  }

  render() {
    const match = new MatchWrapper({ match: this.props.matches[this.props.matchId] })
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
