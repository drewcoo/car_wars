import PropTypes from 'prop-types'
import * as React from 'react'
import SVG from 'react-inlinesvg'
import '../../App.css'
import { INCH } from '../../utils/constants'
import Rectangle from '../../utils/geometry/Rectangle'
import LocalMatchState from './lib/LocalMatchState'
import TimingOverlays from './overlays/TimingOverlays'
import KillMessage from './overlays/vehicle/KillMessage'
import CarModal from './overlays/vehicle/modal/CarModal'

class Car extends React.Component {
  constructor(props) {
    super(props)
    this.collisionDetected = false
    this.state = {
      showModal: false,
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  handleClose() {
    this.setState({ showModal: false })
  }

  handleClick() {
    this.setState({ showModal: !this.state.showModal })
  }

  manyColoredFill() {
    return this.collisionDetected ? 'red' : 'white'
  }

  manyColoredOpacity(opacity) {
    if (this.collisionDetected) {
      return 1
    }
    if (this.props.active) {
      return opacity
    }
    if (this.props.shadow) {
      return opacity
    }
    return 0
  }

  opacity() {
    const lms = new LocalMatchState(this.props.matchData)
    let result = 1
    if (lms.isActiveCar({ id: this.props.id }) && !this.props.active && !lms.awaitAllSpeedsSet()) {
      result = 0.5
    }
    if (this.props.shadow) {
      result = 1 / 4
    }
    return result
  }

  wipeoutLabel(car, x, y) {
    const lms = new LocalMatchState(this.props.matchData)
    const isMovingCar = car.id === lms.activeCarId()
    if (isMovingCar && (this.props.shadow || !this.props.active)) {
      return <g></g>
    }
    if (!isMovingCar && !this.props.shadow) {
      return <g></g>
    }
    if (car.status.nextMove.length === 0) {
      return <g></g>
    }
    const nextMove = car.status.nextMove[0]
    if (nextMove) {
      const style = {
        fill: 'black',
        stroke: 'white',
        strokeWidth: 1,
        fontSize: '22px', // default is 24
        fontFamily: 'fantasy',
        fontVariant: 'small-caps',
      }
      const msgs = []
      if (nextMove.fishtailDistance !== 0) {
        msgs.push(`fishtail ${nextMove.spinDirection} ${nextMove.fishtailDistance / INCH}"`)
      }
      if (nextMove.maneuver) {
        if (nextMove.maneuver.match(/skid/i)) {
          msgs.push(`${nextMove.maneuver} ${nextMove.maneuverDistance / INCH}"`)
        } else if (nextMove.maneuver.match(/spinout/i)) {
          msgs.push(`${nextMove.maneuver} ${nextMove.spinDirection}`)
        } else {
          msgs.push(`${nextMove.maneuver}`)
        }
      }
      return (
        <text x={x} y={y} style={style}>
          {msgs.join(' & ')}
        </text>
      )
    }
    return <g></g>
  }

  strobeMoving() {
    if (!this.props.active) {
      return
    }
    return (
      <animate
        attributeType="XML"
        attributeName="opacity"
        values="1;1;1;1;0.5;0;0.5;1;1;1;1"
        dur=".4s"
        repeatCount="indefinite"
      />
    )
  }

  vehicleVisualDesign({ car, tempRect, transform }) {
    const x = tempRect.brPoint().x - tempRect.width //+ margin
    const y = tempRect.brPoint().y - tempRect.length //+ 2 * margin

    console.log(car.design.imageFile)

    return (
      <g transform={`rotate(${tempRect.facing + 90} ${x + tempRect.width} ${y + tempRect.length})`}>
        <SVG src={car.design.imageFile} x={x} y={y} style={{ opacity: this.opacity(), fill: car.color }} />
        <circle
          cx={tempRect.brPoint().x - tempRect.width / 2}
          cy={tempRect.brPoint().y - 0.95 * tempRect.length + 2}
          r={tempRect.width / 16}
          style={{ fill: 'black', stroke: 'black' }}
        />
      </g>
    )
  }

  render() {
    const lms = new LocalMatchState(this.props.matchData)
    const car = lms.car({ id: this.props.id })

    if (this.props.shadow && this.props.matchData.match.time.phase.subphase !== '6_damage') {
      if (lms.isActiveCar({ id: this.props.id })) {
        return <g></g>
      }
      if (car.status.nextMove.length === 0) {
        return <g></g>
      }
    }

    if (!car) {
      return <></>
    }

    let tempRect = this.props.active ? new Rectangle(car.phasing.rect) : new Rectangle(car.rect)
    const nextMove = car.status.nextMove[0]
    if (this.props.shadow && nextMove) {
      if (nextMove.fishtailDistance !== 0) {
        if (nextMove.spinDirection === 'left') {
          tempRect = tempRect.leftFrontCornerPivot(nextMove.fishtailDistance)
        } else if (nextMove.spinDirection === 'right') {
          tempRect = tempRect.rightFrontCornerPivot(-nextMove.fishtailDistance)
        } else {
          throw new Error(`direction unknown: ${nextMove.spinDirection}`)
        }
      }
      if (nextMove.maneuver === 'skid' || nextMove.maneuver === 'controlledSkid') {
        // show skid for next probable move - handle 1/2"
        tempRect = tempRect.move({
          degrees: nextMove.maneuverDirection,
          distance: nextMove.maneuverDistance,
          slide: true,
        })
        tempRect = tempRect.move({
          degrees: tempRect.facing,
          distance: INCH - nextMove.maneuverDistance,
          slide: true,
        })
      } else {
        // other moves not implemented yet
        // return(<g></g>)
      }
    }

    this.collisionDetected = this.props.active ? car.phasing.collisionDetected : car.collisionDetected

    const rotatePoint = {
      x: tempRect.brPoint().x,
      y: tempRect.brPoint().y,
    }
    // BUGBUG: Why + 90 degree rotation?
    const transform = `rotate(${tempRect.facing + 90},
                            ${rotatePoint.x},
                            ${rotatePoint.y})`

    return (
      <svg id={this.props.id} onClick={this.handleClick}>
        <g className="vehicle">
          {/* outline */}
          <rect
            x={tempRect.brPoint().x - tempRect.width}
            y={tempRect.brPoint().y - tempRect.length}
            width={tempRect.width}
            height={tempRect.length}
            style={{
              fill: this.manyColoredFill(),
              stroke: 'black',
              strokeWidth: 2,
              opacity: this.collisionDetected ? 1 : this.opacity(),
              fillOpacity: this.manyColoredOpacity(this.opacity()),
            }}
            transform={transform}
          />
          {this.vehicleVisualDesign({ car, tempRect, transform })}
          {this.strobeMoving()}
        </g>
        <CarModal
          modalClose={this.handleClose}
          showModal={this.state.showModal}
          matchData={this.props.matchData}
          carId={car.id}
          client={this.props.client}
        />
        <TimingOverlays client={this.props.client} matchData={this.props.matchData} id={car.id} />
        <KillMessage matchData={this.props.matchData} carId={car.id} />
        {this.wipeoutLabel(car, tempRect.center().x - 30, tempRect.center().y)}
      </svg>
    )
  }
}

Car.propTypes = {
  active: PropTypes.bool,
  client: PropTypes.object,
  id: PropTypes.string,
  matchData: PropTypes.object,
  shadow: PropTypes.bool,
}

export default Car
