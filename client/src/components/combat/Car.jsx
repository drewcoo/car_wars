import * as React from 'react'
import '../../App.css'
import Rectangle from '../../utils/geometry/Rectangle'
import LocalMatchState from './lib/LocalMatchState'
import Damage from './Damage'

class Car extends React.Component {
  constructor(props) {
    super(props)
    let collisionDetected = false
  }

  manyColoredFill() {
    if (this.collisionDetected) { return 'red' }
    if (this.props.ghost) { return 'yellow' }
    return 'white'
  }

  manyColoredOpacity(opacity) {
    if (this.collisionDetected) { return 1 }
    if (this.props.ghost) { return opacity }
    return 0
  }

  render() {
    const car = new LocalMatchState(this.props.matchData).car({ id: this.props.id })
    const opacity = this.props.ghost ? 1 / 2 : 1
    const tempRect = this.props.ghost ? new Rectangle(car.phasing.rect) : new Rectangle(car.rect)
    this.collisionDetected = this.props.ghost ? car.phasing.collisionDetected : car.collisionDetected

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
        strokeWidth: 2,
        opacity : this.collisionDetected ? 1 : opacity,
        fillOpacity: this.manyColoredOpacity(opacity)
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
      <Damage client={this.props.client} matchData={ new LocalMatchState(this.props.matchData).data } />
      </g>
    )
  }
}

export default Car
