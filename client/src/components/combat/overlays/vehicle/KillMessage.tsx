import * as React from 'react'
import LocalMatchState from '../../lib/LocalMatchState'
import Rectangle from '../../../../utils/geometry/Rectangle'
import '../../../../App.css'

interface Props {
  carId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  matchData: any
}

class KillMessage extends React.Component<Props> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  msgStyle(): any {
    return {
      fill: 'black',
      stroke: 'white',
      strokewidth: 1,
      fontSize: '20px', // default is 24
      fontFamily: 'fantasy',
      fontVariant: 'small-caps',
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nameStyle(color: string): any {
    return {
      fill: color,
      stroke: 'white',
      fontSize: '22px',
      fontFamily: 'fantasy',
      fontVariant: 'small-caps',
    }
  }

  render(): React.ReactNode {
    const lms = new LocalMatchState(this.props.matchData)
    const car = lms.car({ id: this.props.carId })
    if (!car.status.killed) {
      return <g />
    }

    const killerCar = lms.car({ id: car.status.lastDamageBy[car.status.lastDamageBy.length - 1] })
    const killerPlayer = lms.player({ id: killerCar.playerId })

    const rect = new Rectangle(car.rect)
    const x = rect.center().x
    const y = rect.center().y

    return (
      <g>
        <image x={x - 20} y={y - 30} width="60" height="60" href="/img/skull_and_bones.svg" />
        <text x={x} y={y} style={this.msgStyle()} dy="0">
          <tspan textAnchor="middle" x={x} dy="1em" style={this.nameStyle(killerPlayer.color)}>
            {killerPlayer.name}
          </tspan>
        </text>
      </g>
    )
  }
}

export default KillMessage
