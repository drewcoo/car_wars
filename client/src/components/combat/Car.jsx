import * as React from 'react'
import '../../App.css'
import Rectangle from '../../utils/geometry/Rectangle'
import LocalMatchState from './lib/LocalMatchState'
import Damage from './Damage'
import KillMessage from './KillMessage'
import { INCH } from '../../utils/constants'

class Car extends React.Component {
  constructor(props) {
    super(props)
    let collisionDetected = false
  }

  manyColoredFill() {
    if (this.collisionDetected) { return 'red' }
    return 'white'
  }

  manyColoredOpacity(opacity) {
    if (this.collisionDetected) { return 1 }
    if (this.props.active) { return opacity }
    if (this.props.shadow) {return opacity}
    return 0
  }

  wipeoutLabel(car, x, y) {
    const lms = new LocalMatchState(this.props.matchData)
    const isMovingCar = car.id === lms.currentCarId()
    if (isMovingCar && (
        this.props.shadow || !this.props.active)) {
      return (<g></g>)
    }
    if (!isMovingCar && !this.props.shadow) {
      return (<g></g>)
    }
    if(car.status.nextMove.length === 0) {
      return (<g></g>)
    }
    let nextMove = car.status.nextMove[0]
    if (nextMove) {
      let style = {
        fill: 'black',
        stroke: 'white',
        strokeWidth: 1,
        fontSize: '22px', // default is 24
        fontFamily: 'fantasy',
        fontVariant: 'small-caps'
      }
      let msgs = []
      if (nextMove.fishtailDistance != 0) { msgs.push(`fishtail ${nextMove.spinDirection} ${nextMove.fishtailDistance / INCH}\"`) }
      if (nextMove.maneuver) {
        if (nextMove.maneuver.match(/skid/i)) {
          msgs.push(`${nextMove.maneuver} ${nextMove.maneuverDistance / INCH}"`)
        } else if (nextMove.maneuver.match(/spinout/i)) {
          msgs.push(`${nextMove.maneuver} ${nextMove.spinDirection}`)
        } else {
          msgs.push(`${nextMove.maneuver}`)
        }
      }
      return (<text x={x} y={y} style={style} >{msgs.join(' & ')}</text>)
    }
    return (<g></g>)
  }

  strobeMoving() {
    if (!this.props.active) { return }
    return (
      <animate
        attributeType="XML"
        attributeName="opacity"
        values="1;1;1;1;0.5;0;0.5;1;1;1;1"
        dur=".4s"
        repeatCount="indefinite"/>
    )
  }

  opacity(vehicle) {
    const lms = new LocalMatchState(this.props.matchData)
    let result = (lms.currentCarId() === this.props.id && !this.props.active) ? 1/2 : 1
    if (this.props.shadow) { result = 1/4 }
    return result
  }

  style(car) {
    let opacity = this.opacity(car)

    return {
      Body: {
        fill: car.color,
        stroke: 'black',
        strokeWidth: 3,
        opacity: opacity
      },
      Roof: {
        fill: car.color,
        opacity: opacity
      },
      MainBody: {
        fill: car.color,
        stroke: 'black',
        strokeWidth: 2,
        opacity: opacity
      },
      Glass: {
        fill: 'white',
        stroke: 'gray',
        strokeWidth: 3,
        opacity: opacity
      },
      Outline: {
        fill: this.manyColoredFill(),
        stroke: 'black',
        strokeWidth: 2,
        opacity : this.collisionDetected ? 1 : opacity,
        fillOpacity: this.manyColoredOpacity(opacity)
      }
    }
  }

  vehicleVisualDesign({ car, tempRect, transform }) {
    const margin = tempRect.width / 6
    const smidge = tempRect.width / 15 // bug?
    const hoodLength = 6 * margin
    const windshieldMargin = 2 * margin - smidge / 2
    const roofLength = 3 * margin
    const roofWidth = tempRect.width - (1.75 * windshieldMargin)

    return (
      <>
        { /* body */ }
        <rect
          rx = { tempRect.width / 4 }
          x = { tempRect.brPoint().x - tempRect.width + margin }
          y = { tempRect.brPoint().y - tempRect.length + 2 * margin }
          width = { tempRect.width - 2 * margin }
          height = { tempRect.length - 3 * margin }
          style = { this.style(car).MainBody }
          transform = { transform }
        />
        { /* windshield/back window */ }
        <rect
          rx = { tempRect.width / 8 }
          x = { tempRect.brPoint().x - tempRect.width + windshieldMargin }
          y = { tempRect.brPoint().y - tempRect.length + 5.5 * margin }
          height = { 1.5 * roofLength }
          width = { tempRect.width - 2 * windshieldMargin }
          style = { this.style(car).Glass }
          transform = { transform }
        />
        { /* side windows */ }
        <rect
          rx = { tempRect.width / 8 }
          x = { tempRect.brPoint().x - tempRect.width / 2 - (roofWidth + smidge) / 2 }
          y = { tempRect.brPoint().y - tempRect.length + hoodLength + 2 * smidge }
          width = { roofWidth + smidge }
          height = { roofLength - smidge }
          style = { this.style(car).Glass }
          transform = { transform }
        />
        { /* roof */ }
        <rect
          rx = { tempRect.width / 8 }
          x = { tempRect.brPoint().x - tempRect.width / 2 - roofWidth / 2 }
          y = { tempRect.brPoint().y - tempRect.length + hoodLength + smidge * 3 / 2 }
          width = { roofWidth }
          height = { roofLength }
          style = { this.style(car).Roof }
          transform = { transform }
        />
        { /* front pip */ }
        <circle
          cx = { tempRect.brPoint().x - tempRect.width / 2 }
          cy = { tempRect.brPoint().y - tempRect.length + 2 + smidge }
          r = { tempRect.width / 16 }
          style = { this.style(car).Body }
          transform = { transform }
        />
      </>
    )

  }

  render() {
    const lms = new LocalMatchState(this.props.matchData)
    const car = lms.car({ id: this.props.id })

    if (this.props.shadow) {
      if (lms.currentCarId() === this.props.id) { return(<g></g>) }
      if (car.status.nextMove.length === 0) { return(<g></g>) }
    }

    let tempRect = this.props.active ? new Rectangle(car.phasing.rect) : new Rectangle(car.rect)
    if (this.props.shadow) {
      let nextMove = car.status.nextMove[0]

      if (nextMove.fishtailDistance != 0) {
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
        tempRect = tempRect.move({ degrees: nextMove.maneuverDirection, distance: nextMove.maneuverDistance, slide: true })
        tempRect = tempRect.move({ degrees: tempRect.facing, distance: INCH - nextMove.maneuverDistance, slide: true })
      } else {
        // other moves not implemented yet
        //return(<g></g>)
      }
    }

    this.collisionDetected = this.props.active ? car.phasing.collisionDetected : car.collisionDetected

    var rotatePoint = {
      x: tempRect.brPoint().x,
      y: tempRect.brPoint().y
    }
    // BUGBUG: Why + 90 degree rotation?
    var transform = `rotate(${tempRect.facing + 90},
                            ${rotatePoint.x},
                            ${rotatePoint.y})`

    return (
      <g id={ this.props.id } >
        <g className="vehicle">
          { /* outline */ }
          <rect
            x = { tempRect.brPoint().x - tempRect.width }
            y = { tempRect.brPoint().y - tempRect.length }
            width = { tempRect.width }
            height = { tempRect.length }
            style = { this.style(car).Outline }
            transform = { transform } />
          { this.vehicleVisualDesign({ car, tempRect, transform }) }
          { this.strobeMoving() }
        </g>

        <Damage client={this.props.client} matchData={ new LocalMatchState(this.props.matchData).data } />
        <KillMessage matchData={ new LocalMatchState(this.props.matchData).data} carId={car.id} />
        { this.wipeoutLabel(car, tempRect.center().x - 30, tempRect.center().y) }
      </g>
    )
  }
}

export default Car
