import * as React from 'react'
import LocalMatchState from '../../../lib/LocalMatchState'
import DangerColorizer from '../../../lib/DangerColorizer'

class HandlingStats extends React.Component {
  props: any
  lms: any

  collisionMessage(car: any) {
    if (!car.phasing.collisionDetected) {
      return
    }
    const damStyle = { color: 'red' }
    const colls = car.phasing.collisions.map((elem: any) => elem.type).join(', ')
    return <span style={damStyle}>{`Collision: ${colls}`}</span>
  }

  damageDice(car: any): any {
    if (car.phasing.damage[0] && car.phasing.damage[0].target.damageDice) {
      if (car.phasing.damage[0].message !== 'tire damage') return <></>
      return (
        <>
          <br />
          <span style={{ color: 'red' }}>
            {car.phasing.damage[0].target.damageDice} {car.phasing.damage[0].message}
          </span>
        </>
      )
    }
    return <></>
  }

  render() {
    const lms = new LocalMatchState(this.props.matchData)
    const car = this.props.carId ? lms.car({ id: this.props.carId }) : lms.activeCar()
    if (!car) {
      return null
    }
    return (
      <div style={{ fontSize: '24px' }}>
        <span style={DangerColorizer.handlingStatusColorizer(car)}>handling: {car.status.handling}</span>
        <br />
        <span style={DangerColorizer.handlingDifficultyColorizer(car)}>D{car.phasing.difficulty} maneuver</span>
        {this.damageDice(car)}
        <br />
        {this.collisionMessage(car)}
      </div>
    )
  }
}

export default HandlingStats
