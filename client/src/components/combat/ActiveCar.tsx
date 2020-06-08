import * as React from 'react'
import Car from './Car'
import Point from '../../utils/geometry/Point'
import LocalMatchState from './lib/LocalMatchState'
import ViewElement from './lib/ViewElement'

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  matchData: any
}

interface State {
  drag: boolean
  firstPoint: Point | null
  lastPoint: Point | null
}

class ActiveCar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      drag: false,
      firstPoint: null,
      lastPoint: null,
    }
    this.startHandler = this.startHandler.bind(this)
    this.moveHandler = this.moveHandler.bind(this)
    this.stopHandler = this.stopHandler.bind(this)
  }

  componentDidUpdate(): void {
    const activeCar = new LocalMatchState(this.props.matchData).activeCarId()
    ViewElement('shotResult') || ViewElement('reticle') || ViewElement(activeCar)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  eventPoint(event: any): Point {
    // First, get the page coordinates of the click or touch.
    let result
    if (event.clientX) {
      // Mouse - correct coords
      result = new Point({ x: event.pageX, y: event.pageY })
    } else {
      // Otherwise assume touch - incorrect
      result = new Point({
        x: event.changedTouches[0].pageX,
        y: event.changedTouches[0].pageY,
      })
    }

    // Now convert to the relative coords of the active car on the ArenaMap.
    const bodyBounding = document.body.getBoundingClientRect()
    const elem: HTMLElement | null = document.getElementById('ArenaMap')
    if (!elem) {
      throw new Error(`Can't find ArenaMap element!`)
    }
    const elemBounding = elem.getBoundingClientRect()
    result.x -= elemBounding.left + bodyBounding.left
    result.y -= elemBounding.top + bodyBounding.top
    return result.toFixed(0)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleOnDrag(event: any): void {
    this.moveHandler(event)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleOnDragStop(): void {
    this.stopHandler()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  startHandler(event: any): void {
    const point = this.eventPoint(event)
    this.setState({ drag: false, firstPoint: point, lastPoint: point })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  moveHandler(event: any): void {
    if (this.state.firstPoint === null) {
      if (this.state.drag === false) {
        this.stopHandler()
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
    // left of the current position of the active car? Not sure.
    // Should talk it out.
    //
    const swipeMagnitude = this.state.firstPoint.distanceTo(point) // this.state.lastPoint)
    if (swipeMagnitude < 1) {
      this.stopHandler()
      return
    }
    if (!this.state.lastPoint || !this.state.firstPoint) {
      throw new Error(`first and last points must be set!`)
    }
    this.setState({ drag: true, lastPoint: point })
  }

  stopHandler(): void {
    this.setState({ drag: false, firstPoint: null, lastPoint: null })
  }

  render(): React.ReactNode {
    const lms = new LocalMatchState(this.props.matchData)
    if (lms.awaitAllSpeedsSet()) {
      return <></>
    }
    const acid = lms.activeCarId()
    if (!acid) {
      return <></>
    }
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
        <Car client={this.props.client} shadow={false} matchData={lms.data} id={acid} key="active" active={true} />
      </g>
    )
  }
}

export default ActiveCar
