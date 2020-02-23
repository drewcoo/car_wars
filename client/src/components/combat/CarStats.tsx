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

  render() {
    const car = new LocalMatchState(this.props.matchData).currentCar()
    const warnStyle: { color: string, visibility: 'hidden' | 'visible'} = {
      color: 'yellow',
      visibility: (car.phasing.difficulty === 0) ? 'hidden' : 'visible'
    }

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
        <span>handling: { car.status.handling }</span><br/>
        <span style={ warnStyle }>D{ car.phasing.difficulty } maneuver</span><br/>
        { this.collisionMessage(car) }<br/>
        <span>SPEED: { car.status.speed }</span>
      </div>
    )
  }
}

export default CarStats
