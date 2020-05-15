import * as React from 'react'
import LocalMatchState from '../../../lib/LocalMatchState'
import uuid from 'uuid/v4'

class Log extends React.Component {
  props: any
  lms: any

  entries(car: any) {
    return car.log.map((entry: any) => {
      return (
        <li key={uuid()}>{entry}</li>
      )
    })
  }

  render() {
    const lms = new LocalMatchState(this.props.matchData)
    const car = this.props.carId
      ? lms.car({ id: this.props.carId })
      : lms.activeCar()
    // const car = new LocalMatchState(this.props.matchData).activeCar()
    if (!car) {
      return null
    }
    return (
      <div style={{ fontSize: '24px' }}>
        LOG
        <br />

        <ul>
          {this.entries(car)}
        </ul>
      </div>
    )
  }
}

export default Log
