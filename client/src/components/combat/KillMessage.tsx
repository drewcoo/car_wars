import * as React from 'react'
import LocalMatchState from './lib/LocalMatchState'
import Rectangle from '../../utils/geometry/Rectangle'


class KillMessage extends React.Component {
  props: any

  msgStyle() {
    return ({
      fill: 'black',
      stroke: 'white',
      strokewidth: 1,
      fontSize: '20px', // default is 24
      fontFamily: 'fantasy',
      fontVariant: 'small-caps'
    })
  }

  nameStyle(color: string) {
    return {
      fill: color,
      stroke: 'white',
      fontSize: '22px',
      fontFamily: 'fantasy',
      fontVariant: 'small-caps'
    }
  }

  render() {
    let lms = new LocalMatchState(this.props.matchData)
    const car = lms.car({ id: this.props.carId })
    if (!car.status.killed) { return(<g/>) }

    const killerCar = lms.car({ id: car.status.lastDamageBy[car.status.lastDamageBy.length - 1] })
    const killerPlayer = lms.player(killerCar.playerId)

    let rect = new Rectangle(car.rect)
    let x = rect.center().x
    let y = rect.center().y

    /*
    <text x = {x} y = {y + 35} style={this.nameStyle(killerPlayer.color)}>
    {killerPlayer.name}
    </text>
    */

    return (
      <g>
        <image x= {x -16} y = {y - 30} width = "45" height = "45" href="/img/skull_and_bones.svg" />
        <text x = {x} y = {y} style = {this.msgStyle()} dy="0">
          {/*<tspan text-anchor="middle" >killed by</tspan>*/}
          <tspan textAnchor="middle" x={x} dy="1em" style={this.nameStyle(killerPlayer.color)}>{killerPlayer.name}</tspan>
        </text>
      </g>
    )
  }
}

export default KillMessage
