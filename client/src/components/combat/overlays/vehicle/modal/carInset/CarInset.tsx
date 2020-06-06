/* eslint-disable no-console */
import React from 'react'
import SVG from 'react-inlinesvg'
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
    /*
    x={tempBrPoint.x - width}
          y={tempBrPoint.y - length}
    */

    console.log(car.design.imageFile)
    return (
      <svg className="flexCentered" id={`${car.id}-inset`} x="0" y="0" width={width} height={length}>
        <rect
          x={tempBrPoint.x - width}
          y={tempBrPoint.y - length}
          width={width}
          height={length}
          style={outlineStyle}
          transform={transform}
        />

        <SVG
          x={0}
          y={0}
          width={width}
          height={length}
          style={{ opacity: opacity, fill: car.color }}
          src={car.design.imageFile}
        />

        {showInset()}
      </svg>
    )
  }
}

export default CarInset
