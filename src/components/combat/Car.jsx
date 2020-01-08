import * as React from 'react'
import {connect} from "react-redux"
import MatchWrapper from '../../utils/wrappers/MatchWrapper'
import '../../App.css'

const mapStateToProps = (state) => {
  return({ matches: state.matches })
}

class Car extends React.Component {
  // props.id
  // props.matchId

  constructor(props) {
    super(props)
    this.state = { ghost: props.ghost || false }
  }

  manyColoredFill() {
    if (this.collisionDetected) { return 'red' }
    if (this.state.ghost) { return 'yellow' }
    return 'white'
  }

  render() {
    const match = new MatchWrapper(this.props.matches[this.props.matchId])

    const car = match.cars.find((car) => car.id === this.props.id)
    const tempRect = this.state.ghost ? car.phasing.rect : car.rect
    this.collisionDetected = this.state.ghost ? car.phasing.collisionDetected : car.collisionDetected
    const opacity = this.state.ghost ? 1 / 2 : 1

    const Style = {
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
        strokeWidth: 3,
        opacity: this.collisionDetected ? 1 : opacity
      }
    }

    const margin = tempRect.width / 6
    const smidge = tempRect.width / 15 // bug?
    const hoodLength = 6 * margin
    const windshieldMargin = 2 * margin - smidge / 2
    const roofLength = 3 * margin
    const roofWidth = tempRect.width - (1.75 * windshieldMargin)

    var rotatePoint = {
      x: tempRect.brPoint().x,
      y: tempRect.brPoint().y
    }
    // BUGBUG: Why + 90 degree rotation
    var transform = `rotate(${tempRect.facing + 90},
                            ${rotatePoint.x},
                            ${rotatePoint.y})`

    const oneOff = {
      fill: this.manyColoredFill(),
      opacity: this.collisionDetected ? 1 : opacity
    }

    return (
      <g id={ this.props.id } >
        { /* outline */ }
        <rect
          x = { tempRect.brPoint().x - tempRect.width }
          y = { tempRect.brPoint().y - tempRect.length }
          width = { tempRect.width }
          height = { tempRect.length }
          style = { Style.Outline }
          transform = { transform }
          />
        { /* body */ }
        <rect
          rx = { tempRect.width / 4 }
          x = { tempRect.brPoint().x - tempRect.width + margin }
          y = { tempRect.brPoint().y - tempRect.length + 2 * margin }
          width = { tempRect.width - 2 * margin }
          height = { tempRect.length - 3 * margin }
          style = { Style.MainBody }
          transform = { transform }
        />
        { /* windshield/back window */ }
        <rect
          rx = { tempRect.width / 8 }
          x = { tempRect.brPoint().x - tempRect.width + windshieldMargin }
          y = { tempRect.brPoint().y - tempRect.length + 5.5 * margin }
          height = { 1.5 * roofLength }
          width = { tempRect.width - 2 * windshieldMargin }
          style = { Style.Glass }
          transform = { transform }
        />
        { /* side windows */ }
        <rect
          rx = { tempRect.width / 8 }
          x = { tempRect.brPoint().x - tempRect.width / 2 - (roofWidth + smidge) / 2 }
          y = { tempRect.brPoint().y - tempRect.length + hoodLength + 2 * smidge }
          width = { roofWidth + smidge }
          height = { roofLength - smidge }
          style = { Style.Glass }
          transform = { transform }
        />
        { /* roof */ }
        <rect
          rx = { tempRect.width / 8 }
          x = { tempRect.brPoint().x - tempRect.width / 2 - roofWidth / 2 }
          y = { tempRect.brPoint().y - tempRect.length + hoodLength + smidge * 3 / 2 }
          width = { roofWidth }
          height = { roofLength }
          style = { Style.Roof }
          transform = { transform }
        />
        { /* front pip */ }
        <circle
          cx = { tempRect.brPoint().x - tempRect.width / 2 }
          cy = { tempRect.brPoint().y - tempRect.length + 2 + smidge }
          r = { tempRect.width / 16 }
          style = { Style.Body }
          transform = { transform }
        />
      </g>
    )
  }
}

export default connect(mapStateToProps)(Car)
