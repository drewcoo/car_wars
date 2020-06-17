import * as React from 'react'
import SVG from 'react-inlinesvg'
import '../../App.css'
import { INCH } from '../../utils/constants'
import Rectangle from '../../utils/geometry/Rectangle'
import LocalMatchState from './lib/LocalMatchState'
import TimingOverlays from './overlays/TimingOverlays'
import KillMessage from './overlays/vehicle/KillMessage'
import CarModal from './overlays/vehicle/modal/CarModal'

interface Props {
  active?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: any
  id: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  matchData: any
  shadow?: boolean
}

interface State {
  showModal: boolean
}

class Car extends React.Component<Props, State> {
  collisionDetected: boolean

  constructor(props: Props) {
    super(props)
    this.collisionDetected = false
    this.state = {
      showModal: false,
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  handleClose(): void {
    this.setState({ showModal: false })
  }

  handleClick(): void {
    this.setState({ showModal: !this.state.showModal })
  }

  manyColoredFill(): string {
    return this.collisionDetected ? 'red' : 'white'
  }

  manyColoredOpacity(opacity: number): number {
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

  opacity(): number {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wipeoutLabel(car: any, x: number, y: number): React.ReactNode {
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

  strobeMoving(): React.ReactNode {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  vehicleVisualDesign({ car, tempRect }: { car: any; tempRect: Rectangle }): React.ReactNode {
    const x = tempRect.brPoint().x - tempRect.width //+ margin
    const y = tempRect.brPoint().y - tempRect.length //+ 2 * margin

    return (
      <g transform={`rotate(${tempRect.facing + 90} ${x + tempRect.width} ${y + tempRect.length})`}>
        <SVG src={car.design.imageFile} x={x} y={y} style={{ opacity: this.opacity(), fill: car.color }} />
        <polygon
          points={`
           ${tempRect.brPoint().x - 0.5 * tempRect.width}, ${tempRect.brPoint().y - 1.5 * tempRect.length}
           ${tempRect.brPoint().x - 0.8 * tempRect.width}, ${tempRect.brPoint().y - 1.3 * tempRect.length}
           ${tempRect.brPoint().x - 0.6 * tempRect.width}, ${tempRect.brPoint().y - 1.3 * tempRect.length}
           ${tempRect.brPoint().x - 0.6 * tempRect.width}, ${tempRect.brPoint().y - 1.1 * tempRect.length}
           ${tempRect.brPoint().x - 0.4 * tempRect.width}, ${tempRect.brPoint().y - 1.1 * tempRect.length}
           ${tempRect.brPoint().x - 0.4 * tempRect.width}, ${tempRect.brPoint().y - 1.3 * tempRect.length}
           ${tempRect.brPoint().x - 0.2 * tempRect.width}, ${tempRect.brPoint().y - 1.3 * tempRect.length}`}
          fill={car.color}
          opacity={0.3}
          stroke="black"
        />
      </g>
    )
  }

  render(): React.ReactNode {
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
          tempRect = tempRect.frontLeftCornerPivot(nextMove.fishtailDistance)
        } else if (nextMove.spinDirection === 'right') {
          tempRect = tempRect.frontRightCornerPivot(-nextMove.fishtailDistance)
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

    if (this.props.active) {
      this.collisionDetected = car.phasing.collisionDetected
    }

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
          {this.vehicleVisualDesign({ car, tempRect })}
          {this.strobeMoving()}
        </g>
        <CarModal
          modalClose={this.handleClose}
          showModal={this.state.showModal}
          matchData={this.props.matchData}
          carId={car.id}
          client={this.props.client}
        />
        {this.props.active || this.props.shadow ? (
          <></>
        ) : (
          <TimingOverlays client={this.props.client} matchData={this.props.matchData} id={car.id} />
        )}
        <KillMessage matchData={this.props.matchData} carId={car.id} />
        {this.wipeoutLabel(car, tempRect.center().x - 30, tempRect.center().y)}
      </svg>
    )
  }
}

export default Car
