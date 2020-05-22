import * as React from 'react'
import LocalMatchState from '../../../lib/LocalMatchState'
import HandlingStats from './HandlingStats'

class CarStats extends React.Component {
  props: any
  lms: any

  speed(car: any) {
    const speedDelta = car.status.speed - car.status.speedInitThisTurn
    const sign = speedDelta > 0 ? '+' : '' // because negative numbers have a -

    return (
      <span>
        speed: {car.status.speed} {speedDelta === 0 ? '' : `(${sign}${speedDelta})`}
      </span>
    )
  }

  render() {
    const lms = new LocalMatchState(this.props.matchData)
    const car = this.props.carId ? lms.car({ id: this.props.carId }) : lms.activeCar()
    // const car = new LocalMatchState(this.props.matchData).activeCar()
    if (!car) {
      return null
    }
    return (
      <div style={{ fontSize: '24px' }}>
        <span>{car.design.attributes.size}</span>
        <br />
        <span>{car.design.attributes.chassis} chassis</span>
        <br />
        <span>{car.design.attributes.suspension} suspension</span>
        <br />
        <span>${car.design.attributes.cost}</span>
        <br />
        <span>{car.design.attributes.weight} lbs</span>
        <br />
        <br />
        <span>top speed: {car.design.attributes.topSpeed}</span>
        <br />
        <span>acc: {car.design.attributes.acceleration}</span>
        <br />
        <span>hc: {car.design.attributes.handlingClass}</span>
        <br />
        <br />
        {this.speed(car)}
        <br />
        <HandlingStats matchData={this.props.matchData} carId={this.props.carId} />
      </div>
    )
  }
}

export default CarStats
