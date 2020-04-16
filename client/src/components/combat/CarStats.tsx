import * as React from 'react'
import LocalMatchState from './lib/LocalMatchState'

class CarStats extends React.Component {
  props: any
  lms: any

  collisionMessage(car: any) {
    if (!car.phasing.collisionDetected) { return }
    const damStyle = { color: 'red' }
    let colls = car.phasing.collisions.map((elem: any) => elem.type).join(', ')
    return (
      <span style={ damStyle }>{ `Collision: ${colls}` }</span>
    )
  }

  handlingColor(car: any, handling: number) {
    let effectiveHandling = (handling < -6) ? -6 : handling
    const speed = parseInt(car.phasing.speedChanges[car.phasing.speedChangeIndex])
    const checks = car.phasing.controlChecksForSpeedChanges.find((entry : any) => entry.speed === speed).checks
    const checkIndex = [7, 6, 5, 4, 3, 2, 1, 0, -1, -2, -3, -4, -5, -6]

    let color : string
    let checkValue = checks[checkIndex.findIndex(e => e === effectiveHandling)]
    switch (checkValue) {
      case 'safe':
        color = 'white'
        break
      case 'XX':
        color = 'red'
        break
      default:
        color = `rgb(255, ${255 - 42 * (checkValue-1)}, 0)`
        console.log(255 - (42 * (checkValue-1)))
    }
    return color
  }

  handlingDifficultyColorizer(car: any): any {
    let color = this.handlingColor(car, car.status.handling - car.phasing.difficulty)
    let isVisible = (car.phasing.difficulty === 0) ? 'hidden' : 'visible'
    console.log(`HS: ${this.handlingColor(car, car.status.handling - car.phasing.difficulty)}`)
    return({ color: color, visibility: isVisible })
  }

  handlingStatusColorizer(car: any): any {
    console.log(`HC: ${this.handlingColor(car, car.status.handling)}`)
    return({ color: this.handlingColor(car, car.status.handling) })
  }

  render() {
    const car = new LocalMatchState(this.props.matchData).currentCar()
    return (
      <div>
        <span>{ car.design.attributes.size }</span><br/>
        <span>{ car.design.attributes.chassis } chassis</span><br/>
        <span>{ car.design.attributes.suspension } suspension</span><br/>
        <span>${ car.design.attributes.cost }</span><br/>
        <span>{ car.design.attributes.weight } lbs</span><br/><br/>
        <span>top speed: { car.design.attributes.topSpeed }</span><br/>
        <span>acc: { car.design.attributes.acceleration }</span><br/>
        <span>hc: { car.design.attributes.handlingClass }</span><br/><br/>
        <span style={ this.handlingStatusColorizer(car) }>handling: { car.status.handling }</span><br/>
        <span style={ this.handlingDifficultyColorizer(car) }>D{ car.phasing.difficulty } maneuver</span><br/>
        { this.collisionMessage(car) }<br/>
      </div>
    )
  }
}

export default CarStats
