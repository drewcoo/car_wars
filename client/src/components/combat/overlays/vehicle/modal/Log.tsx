import * as React from 'react'
import LocalMatchState from '../../../lib/LocalMatchState'
import uuid from 'uuid/v4'

interface Props {
  carId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  matchData: any
}

class Log extends React.Component<Props> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  entries(car: any): React.ReactNode {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return car.log.map((entry: any) => {
      return <li key={uuid()}>{entry}</li>
    })
  }

  render(): React.ReactNode {
    const lms = new LocalMatchState(this.props.matchData)
    const car = this.props.carId ? lms.car({ id: this.props.carId }) : lms.activeCar()
    // const car = new LocalMatchState(this.props.matchData).activeCar()
    if (!car) {
      return null
    }
    return (
      <div style={{ fontSize: '24px', overflow: 'scroll', height: '400px' }}>
        LOG
        <br />
        <ul>{this.entries(car)}</ul>
      </div>
    )
  }
}

export default Log
