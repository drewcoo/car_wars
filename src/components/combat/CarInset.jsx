import React from 'react'
import {connect} from "react-redux"
import MatchWrapper from '../../utils/wrappers/MatchWrapper'
import { INCH } from '../../utils/constants'
import '../../App.css'

import Driver from './carComponents/Driver'
import Plant from './carComponents/Plant'
import Tire from './carComponents/Tire'
import FrontMG from './carComponents/FrontMG'

const mapStateToProps = (state) => {
  return({ matches: state.matches })
}

class InsetLayout extends React.Component {
  // props.car
  // props.matchId
  // props.length
  // props.width

  tire(front, left) {
    return (<Tire width={this.props.width} length={this.props.length} front={front} left={left} matchId={this.props.matchId} />)
  }

  plant() {
    return (<Plant width={this.props.width} length={this.props.length} matchId={this.props.matchId} />)
  }

  frontMg() {
    return (<FrontMG width={this.props.width} length={this.props.length} matchId={this.props.matchId} />)
  }

  driver() {
    return (<Driver width={this.props.width} length={this.props.length} matchId={this.props.matchId} />)
  }

  render() {
    return (
      <g>
        <text x = { this.props.width * 16 / 64 } y = { this.props.length * 9 / 64 } >
          F:{ this.props.car.design.components.armor.F }
        </text>
        <text x = { this.props.width * 38 / 64 } y = { this.props.length * 9 / 64 } >
          T:{ this.props.car.design.components.armor.T }
        </text>
        <text x = { this.props.width * 1 / 64 } y = { this.props.length * 36 / 64 } >
          L:{ this.props.car.design.components.armor.L }
        </text>
        <text x = { this.props.width * 63 / 64 } y = { this.props.length * 36 / 64 } textAnchor={'end'} >
          R:{ this.props.car.design.components.armor.R }
        </text>
        <text x = { this.props.width * 16 / 64 } y = { this.props.length * 63 / 64 } >
          B:{ this.props.car.design.components.armor.B }
        </text>
        <text x = { this.props.width * 38 / 64 } y = { this.props.length * 63 / 64 } >
          U:{ this.props.car.design.components.armor.U }
        </text>
        { this.tire(true, true) }
        { this.tire(true, false) }
        { this.tire(false, true) }
        { this.tire(false, false) }
        { this.plant() }
        { this.frontMg() }
        { this.driver() }
      </g>
    )
  }
}

class CarInset extends React.Component {
  // props.matchId

  render() {
    const  match = new MatchWrapper({ match: this.props.matches[this.props.matchId] })
    const car = match.currentCar()
    const inset = true
    const id = 'inset'
    const scaling = 1 // inset ? 1 : 1;    ///5; //40/INCH : 1/10;
    const ghost = false
    const tempRect = ghost ? car.rect : car.phasing.rect
    const length = 400 // tempRect.length * 5/80 * INCH;
    const width = 200 // tempRect.width * 5/80 * INCH;
    const tempBrPoint = (inset) ? { x: width, y: length } : tempRect.brPoint()
    const tempFacing = (inset) ? 0 : tempRect.facing
    const opacity = ghost ? 1 / 2 : 1

    const bodyStyle = {
      fill: car.color,
      stroke: 'black',
      strokeWidth: 5,
      opacity: opacity
    }
    const roofStyle = {
      fill: car.color,
      opacity: opacity
    }
    const mainBodyStyle = {
      fill: car.color,
      stroke: 'black',
      strokeWidth: 2,
      opacity: opacity
    }
    const glassStyle = {
      fill: 'white',
      stroke: 'gray',
      strokeWidth: 3,
      opacity: opacity
    }
    const manyColoredFill = () => {
      if (car.phasing.collisionDetected) { return 'red' }
      if (ghost) { return 'yellow' }
      return 'white'
    }
    const outlineStyle = {
      fill: manyColoredFill(),
      stroke: 'black',
      strokeWidth: 5,
      opacity: car.phasing.collisionDetected ? 1 : opacity
    }

    const margin = width / 6
    const smidge = width / 15 // bug?
    const hoodLength = 6 * margin
    const windshieldMargin = 2 * margin - smidge / 2
    const roofLength = 3 * margin
    const roofWidth = width - (1.75 * windshieldMargin)

    var rotatePoint = {
      x: tempBrPoint.x,
      y: tempBrPoint.y
    }
    var transform = `rotate(${tempFacing},
                            ${rotatePoint.x},
                            ${rotatePoint.y}),
                     scale(${scaling}, ${scaling})`

    function showInset({ matchId }) {
      if (inset) {
        return (<InsetLayout car={ car } length={ length } width={ width } matchId={ matchId } />)
      }
    }

    return (
      <svg id='CarInset' height={400} >
        <g id={id } >
          { /* outline */ }
          <rect
            x = { tempBrPoint.x - width }
            y = { tempBrPoint.y - length }
            width = { width }
            height = { length }
            style = { outlineStyle }
            transform = { transform }
          />
          { /* body */ }
          <rect
            rx = { width / 4 }
            x = { tempBrPoint.x - width + margin }
            y = { tempBrPoint.y - length + 2 * margin }
            width = { width - 2 * margin }
            height = { length - 3 * margin }
            style = { mainBodyStyle }
            transform = { transform }
          />
          { /* windshield/back window */ }
          <rect
            rx = { width / 8 }
            x = { tempBrPoint.x - width + windshieldMargin }
            y = { tempBrPoint.y - length + 5.5 * margin }
            width = { width - 2 * windshieldMargin }
            height = { 1.5 * roofLength }
            style = { glassStyle }
            transform = { transform }
          />
          { /* side windows */ }
          <rect
            rx = { width / 8 }
            x = { tempBrPoint.x - width / 2 - (roofWidth + smidge) / 2 }
            y = { tempBrPoint.y - length + hoodLength + 2 * smidge }
            width = { roofWidth + smidge }
            height = { roofLength - smidge }
            style = { glassStyle }
            transform = { transform }
          />
          { /* roof */ }
          <rect
            rx = { width / 8 }
            x = { tempBrPoint.x - width / 2 - roofWidth / 2 }
            y = { tempBrPoint.y - length + hoodLength + smidge * 3 / 2 }
            width = { roofWidth }
            height = { roofLength }
            style = { roofStyle }
            transform = { transform }
          />
          { /* front pip */ }
          <circle
            visibility = { (!inset) ? 'visible' : 'hidden' }
            cx = { tempBrPoint.x - width / 2 }
            cy = { tempBrPoint.y - length + 2 + smidge }
            r = { width / 16 }
            style = { bodyStyle }
            transform = { transform }
          />
          {
            showInset({matchId: this.props.matchId})
          }
          { /* sample text label on map */ }
          <text
            x = { tempBrPoint.x - width }
            y = { tempBrPoint.y - length + length / 2 + (-3 / 4 * length) }
            transform = { transform }
            fontSize = { 5 * INCH }
            fontWeight = 'bold'
            stroke = 'black'
          >
            { `real: (${car.rect.brPoint().x / INCH},
              ${car.rect.brPoint().y / INCH})\n` }
            { `ghost: (${car.phasing.rect.brPoint().x / INCH},
              ${car.phasing.rect.brPoint().y / INCH})` }
          </text>
        </g>
      </svg>
    )
  }
}

export default connect(mapStateToProps)(CarInset)
