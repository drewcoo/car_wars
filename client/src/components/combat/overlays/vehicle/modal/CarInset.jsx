/* eslint-disable no-console */
import React from 'react'
import Driver from '../../../carComponents/Driver'
import FrontMG from '../../../carComponents/FrontMG'
import Plant from '../../../carComponents/Plant'
import Tire from '../../../carComponents/Tire'
import LocalMatchState from '../../../lib/LocalMatchState'
import '../../../../../App.css'

class InsetLayout extends React.Component {
  tire(carId, front, left) {
    return (
      <Tire
        carId={carId}
        width={this.props.width}
        length={this.props.length}
        front={front}
        left={left}
        matchData={this.props.matchData}
      />
    )
  }

  plant(carId) {
    return <Plant carId={carId} width={this.props.width} length={this.props.length} matchData={this.props.matchData} />
  }

  frontMg(carId) {
    return (
      <FrontMG carId={carId} width={this.props.width} length={this.props.length} matchData={this.props.matchData} />
    )
  }

  driver(carId) {
    return <Driver carId={carId} width={this.props.width} length={this.props.length} matchData={this.props.matchData} />
  }

  armor(carId, location) {
    const dimensions = {
      F: { x: (this.props.width * 16) / 64, y: (this.props.length * 9) / 64 },
      T: { x: (this.props.width * 38) / 64, y: (this.props.length * 9) / 64 },
      L: { x: (this.props.width * 1) / 64, y: (this.props.length * 36) / 64 },
      R: { x: (this.props.width * 63) / 64, y: (this.props.length * 36) / 64 }, // textAnchor={'end'}
      B: { x: (this.props.width * 16) / 64, y: (this.props.length * 63) / 64 },
      U: { x: (this.props.width * 38) / 64, y: (this.props.length * 63) / 64 },
    }
    const style = {
      red: { fill: 'red' },
      black: { fill: 'black' },
    }
    const DP = new LocalMatchState(this.props.matchData).car({ id: carId }).design.components.armor[location]
    if (location === 'R') {
      return (
        <text
          x={dimensions[location].x}
          y={dimensions[location].y}
          textAnchor={'end'}
          style={DP < 1 ? style.red : style.black}
        >
          {location}:{DP}
        </text>
      )
    }
    return (
      <text x={dimensions[location].x} y={dimensions[location].y} style={DP < 1 ? style.red : style.black}>
        {location}:{DP}
      </text>
    )
  }

  render() {
    return (
      <g>
        {this.armor(this.props.carId, 'F')}
        {this.armor(this.props.carId, 'T')}
        {this.armor(this.props.carId, 'L')}
        {this.armor(this.props.carId, 'R')}
        {this.armor(this.props.carId, 'B')}
        {this.armor(this.props.carId, 'U')}
        {this.tire(this.props.carId, true, true)}
        {this.tire(this.props.carId, true, false)}
        {this.tire(this.props.carId, false, true)}
        {this.tire(this.props.carId, false, false)}
        {this.plant(this.props.carId)}
        {this.frontMg(this.props.carId)}
        {this.driver(this.props.carId)}
      </g>
    )
  }
}

class CarInset extends React.Component {
  render() {
    const initMatchData = this.props.matchData
    const lms = new LocalMatchState(this.props.matchData)
    const car = this.props.carId ? lms.car({ id: this.props.carId }) : lms.activeCar()
    if (!car) {
      return <></>
    }
    const inset = true
    const scaling = 1 // inset ? 1 : 1;    ///5; //40/INCH : 1/10;
    const active = false
    const tempRect = active ? car.rect : car.phasing.rect
    const length = 400 // tempRect.length * 5/80 * INCH;
    const width = 200 // tempRect.width * 5/80 * INCH;
    const tempBrPoint = inset ? { x: width, y: length } : tempRect.brPoint()
    const tempFacing = inset ? 0 : tempRect.facing
    const opacity = active ? 1 / 2 : 1

    const bodyStyle = {
      fill: car.color,
      stroke: 'black',
      strokeWidth: 5,
      opacity: opacity,
    }
    const roofStyle = {
      fill: car.color,
      opacity: opacity,
    }
    const mainBodyStyle = {
      fill: car.color,
      stroke: 'black',
      strokeWidth: 2,
      opacity: opacity,
    }
    const glassStyle = {
      fill: 'white',
      stroke: 'gray',
      strokeWidth: 3,
      opacity: opacity,
    }
    const manyColoredFill = () => {
      if (car.phasing.collisionDetected) {
        return 'red'
      }
      if (active) {
        return 'yellow'
      }
      return 'white'
    }
    const outlineStyle = {
      fill: manyColoredFill(),
      stroke: 'black',
      strokeWidth: 5,
      opacity: car.phasing.collisionDetected ? 1 : opacity,
    }

    const margin = width / 6
    const smidge = width / 15 // bug?
    const hoodLength = 6 * margin
    const windshieldMargin = 2 * margin - smidge / 2
    const roofLength = 3 * margin
    const roofWidth = width - 1.75 * windshieldMargin

    const rotatePoint = {
      x: tempBrPoint.x,
      y: tempBrPoint.y,
    }
    const transform = `rotate(${tempFacing},
                            ${rotatePoint.x},
                            ${rotatePoint.y}),
                     scale(${scaling}, ${scaling})`

    function showInset(carId) {
      if (inset) {
        return <InsetLayout carId={carId} length={length} width={width} matchData={initMatchData} />
      }
    }

    return (
      <svg className="flexCentered" id={`${car.id}-inset`} x="0" y="0" width="200" height="400">
        {/* outline */}
        <rect
          x={tempBrPoint.x - width}
          y={tempBrPoint.y - length}
          width={width}
          height={length}
          style={outlineStyle}
          transform={transform}
        />
        {/* body */}
        <rect
          rx={width / 4}
          x={tempBrPoint.x - width + margin}
          y={tempBrPoint.y - length + 2 * margin}
          width={width - 2 * margin}
          height={length - 3 * margin}
          style={mainBodyStyle}
          transform={transform}
        />
        {/* windshield/back window */}
        <rect
          rx={width / 8}
          x={tempBrPoint.x - width + windshieldMargin}
          y={tempBrPoint.y - length + 5.5 * margin}
          width={width - 2 * windshieldMargin}
          height={1.5 * roofLength}
          style={glassStyle}
          transform={transform}
        />
        {/* side windows */}
        <rect
          rx={width / 8}
          x={tempBrPoint.x - width / 2 - (roofWidth + smidge) / 2}
          y={tempBrPoint.y - length + hoodLength + 2 * smidge}
          width={roofWidth + smidge}
          height={roofLength - smidge}
          style={glassStyle}
          transform={transform}
        />
        {/* roof */}
        <rect
          rx={width / 8}
          x={tempBrPoint.x - width / 2 - roofWidth / 2}
          y={tempBrPoint.y - length + hoodLength + (smidge * 3) / 2}
          width={roofWidth}
          height={roofLength}
          style={roofStyle}
          transform={transform}
        />
        {/* front pip */}
        <circle
          visibility={!inset ? 'visible' : 'hidden'}
          cx={tempBrPoint.x - width / 2}
          cy={tempBrPoint.y - length + 2 + smidge}
          r={width / 16}
          style={bodyStyle}
          transform={transform}
        />
        {showInset(this.props.carId)}
      </svg>
    )
  }
}

export default CarInset
