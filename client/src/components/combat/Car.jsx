import * as React from 'react'
import uuid from 'uuid/v4'
import '../../App.css'
import { INCH } from '../../utils/constants'
import Rectangle from '../../utils/geometry/Rectangle'
import KillMessage from './KillMessage'
import LocalMatchState from './lib/LocalMatchState'
import CarModal from './modals/car/CarModal'
import SpeedModal from './modals/subphase2_setSpeeds/SpeedModal'
import ManeuverModal from './modals/subphase3_maneuver/ManeuverModal'
import FireModal from './modals/subphase4_fireWeapons/FireModal'
import DamageModal from './modals/subphase5_damage/DamageModal'
import RevealSpeedChangeModal from './modals/subphase2.1_revealSpeedChange/RevealSpeedChangeModal'

class Car extends React.Component {
  constructor (props) {
    super(props)
    this.collisionDetected = false
    this.state = {
      showModal: false
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  handleClose () {
    this.setState({ showModal: false })
  }

  handleClick (e) {
    this.setState({ showModal: !this.state.showModal })
    // e.stopPropagation()
  }

  manyColoredFill () {
    return this.collisionDetected ? 'red' : 'white'
  }

  manyColoredOpacity (opacity) {
    if (this.collisionDetected) { return 1 }
    if (this.props.active) { return opacity }
    if (this.props.shadow) { return opacity }
    return 0
  }

  wipeoutLabel (car, x, y) {
    const lms = new LocalMatchState(this.props.matchData)
    const isMovingCar = car.id === lms.activeCarId()
    if (isMovingCar && (
      this.props.shadow || !this.props.active)) {
      return (<g></g>)
    }
    if (!isMovingCar && !this.props.shadow) {
      return (<g></g>)
    }
    if (car.status.nextMove.length === 0) {
      return (<g></g>)
    }
    const nextMove = car.status.nextMove[0]
    if (nextMove) {
      const style = {
        fill: 'black',
        stroke: 'white',
        strokeWidth: 1,
        fontSize: '22px', // default is 24
        fontFamily: 'fantasy',
        fontVariant: 'small-caps'
      }
      const msgs = []
      if (nextMove.fishtailDistance !== 0) { msgs.push(`fishtail ${nextMove.spinDirection} ${nextMove.fishtailDistance / INCH}"`) }
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

  strobeMoving () {
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

  opacity (vehicle) {
    const lms = new LocalMatchState(this.props.matchData)
    let result = 1
    if (lms.isActiveCar({ id: this.props.id }) &&
        !this.props.active &&
        !lms.awaitAllSpeedsSet()) {
      result = 0.5
    }
    if (this.props.shadow) { result = 1 / 4 }
    return result
  }

  style (car) {
    const opacity = this.opacity(car)

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
        opacity: this.collisionDetected ? 1 : opacity,
        fillOpacity: this.manyColoredOpacity(opacity)
      }
    }
  }

  vehicleVisualDesign ({ car, tempRect, transform }) {
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

  renderModal (car) {
    const subphase = this.props.matchData.match.time.phase.subphase
    console.log(subphase)

    switch (subphase) {
      case '1_start':
        break
      case '2_set_speeds':
        // after this, show new speeds/changes?
        return (
          <SpeedModal
            key={uuid()}
            client={this.props.client}
            matchData={ new LocalMatchState(this.props.matchData).data }
            carId={ car.id }/>
        )
      case '2_1_reveal_speed_change':
        return (
          <RevealSpeedChangeModal
            key={uuid()}
            client={this.props.client}
            matchData={ new LocalMatchState(this.props.matchData).data }
            carId={ car.id }/>
        )
      case '3_maneuver':
        return (
          <ManeuverModal
            key={uuid()}
            client={this.props.client}
            matchData={ new LocalMatchState(this.props.matchData).data }
            carId={ car.id }/>
        )
      case '4_fire_weapons':
        return (
          <FireModal
            key={uuid()}
            client={this.props.client}
            matchData={ new LocalMatchState(this.props.matchData).data }
            carId={ car.id }/>
        )
      case '5_damage':
        if (!car) { return (<></>) }
        // either make this a timeout or modals all around if there were shots fired
        // show weapons fire animations plus damage/miss stickers
        return (
          <DamageModal
            key={uuid()}
            client={this.props.client}
            matchData={ new LocalMatchState(this.props.matchData).data }
            carId={ car.id }/>
        )
      case '6_end':
        break
      default:
        throw new Error(`unknown subphase: ${subphase}`)
    }
  }

  render () {
    const lms = new LocalMatchState(this.props.matchData)
    const car = lms.car({ id: this.props.id })

    if (this.props.shadow &&
      (this.props.matchData.match.time.phase.subphase !== '5_damage')) {
      if (lms.isActiveCar({ id: this.props.id })) { return (<g></g>) }
      if (car.status.nextMove.length === 0) { return (<g></g>) }
    }

    if (car) {
      console.log(car.color)
    } else {
      console.log(this.props)
      console.log(car)
      return (<></>)
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
        tempRect = tempRect.move({ degrees: nextMove.maneuverDirection, distance: nextMove.maneuverDistance, slide: true })
        tempRect = tempRect.move({ degrees: tempRect.facing, distance: INCH - nextMove.maneuverDistance, slide: true })
      } else {
        // other moves not implemented yet
        // return(<g></g>)
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
      <svg id={ this.props.id } onClick={ this.handleClick } >
        <g className="vehicle">
          { /* outline */ }
          <rect
            x = { tempRect.brPoint().x - tempRect.width }
            y = { tempRect.brPoint().y - tempRect.length }
            width = { tempRect.width }
            height = { tempRect.length }
            style = { this.style(car).Outline }
            transform = { transform }
          />
          { this.vehicleVisualDesign({ car, tempRect, transform }) }
          { this.strobeMoving() }
        </g>
        { this.renderModal(car) }
        <CarModal
          modalClose={this.handleClose}
          showModal={this.state.showModal}
          matchData={ this.props.matchData }
          carId={ car.id }
          client={this.props.client}/>
        <KillMessage matchData={ new LocalMatchState(this.props.matchData).data} carId={car.id} />
        { this.wipeoutLabel(car, tempRect.center().x - 30, tempRect.center().y) }
      </svg>
    )
  }
}

export default Car
