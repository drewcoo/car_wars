import * as React from 'react'
import SVG from 'react-inlinesvg'
import LocalMatchState from '../../lib/LocalMatchState'

class SpeedChange extends React.Component {
  props: any
  lms: any

  textStyle(height = 24) {
    return {
      fill: 'black',
      stroke: 'white',
      strokeOpacity: 0.5,
      strokeWidth: 1,
      fontSize: `${height}px`, // default is 24
      fontFamily: 'fantasy',
      fontVariant: 'small-caps',
    }
  }

  arrow({ speedDelta = 0 }: { speedDelta: number }) {
    if (speedDelta === 0) {
      return <></>
    }
    const image = speedDelta > 0 ? '/img/speedUp.svg' : '/img/speedDown.svg'
    return <SVG x="-170" y="0" height="5%" src={image} opacity={0.15} />
  }

  speedText({ car, x, y, speedDelta }: { car: any; x: number; y: number; speedDelta: number }): any {
    const textHeight = 24
    console.log(speedDelta)
    let deltaString = ''
    if (speedDelta > 0) {
      deltaString = `+${speedDelta}`
    }
    if (speedDelta < 0) {
      deltaString = `${speedDelta}`
    }

    return (
      <svg>
        <text style={this.textStyle()} textAnchor="middle" x={55} y={30}>
          {car.status.speed}
        </text>
        <text style={this.textStyle(18)} textAnchor="middle" x={55} y={30 + textHeight / 2}>
          mph
        </text>
        <text style={this.textStyle(12)} textAnchor="middle" x={55} y={30 + textHeight * 1.2}>
          {deltaString}
        </text>
      </svg>
    )
  }

  render() {
    const lms = new LocalMatchState(this.props.matchData)

    if (lms.data.match.time.phase.subphase === '6_damage') {
      return <></>
    }

    const car = lms.car({ id: this.props.carId })
    const x = car.rect.center().x
    const y = car.rect.center().y

    const speedDelta = car.status.speed - car.status.speedInitThisTurn

    return (
      <svg x={x + 15} y={y - 30}>
        {this.arrow({ speedDelta })}
        {this.speedText({ car, x, y, speedDelta })}
      </svg>
    )
  }
}

export default SpeedChange
