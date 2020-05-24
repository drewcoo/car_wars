/* eslint-disable no-console */
import React from 'react'
import InsetLayout from './InsetLayout'
import LocalMatchState from '../../../../lib/LocalMatchState'
import '.././../../../../../App.css'
import Dimensions from '../../../../../../utils/Dimensions'

interface Props {
  carId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  matchData: any
}

class CarInset extends React.Component<Props> {
  render(): React.ReactNode {
    const length = 400 // tempRect.length * 5/80 * INCH;
    const width = 200 // tempRect.width * 5/80 * INCH;

    const lms = new LocalMatchState(this.props.matchData)
    const car = this.props.carId ? lms.car({ id: this.props.carId }) : lms.activeCar()
    if (!car) {
      return <></>
    }
    const inset = true
    const scaling = 1 // inset ? 1 : 1;    ///5; //40/INCH : 1/10;
    const active = false
    const tempRect = active ? car.rect : car.phasing.rect
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
    const manyColoredFill = (): string => {
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

    const showInset = (): React.ReactNode => {
      if (inset) {
        return (
          <InsetLayout
            carId={this.props.carId}
            matchData={this.props.matchData}
            carDimensions={new Dimensions({ length, width })}
          />
        )
      }
    }

    return (
      <svg className="flexCentered" id={`${car.id}-inset`} x="0" y="0" width={width} height={length}>
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
        {showInset()}
      </svg>
    )
  }
}

export default CarInset
