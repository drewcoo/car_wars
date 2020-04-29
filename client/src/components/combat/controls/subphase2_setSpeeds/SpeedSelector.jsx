import * as React from 'react'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import LocalMatchState from '../../lib/LocalMatchState'
import '../../../../App.css'
import setSpeed from '../../../graphql/mutations/setSpeed'

const SET_SPEED = graphql(setSpeed, { name: 'setSpeed' })

class SpeedSelector extends React.Component {
  constructor (props) {
    super(props)
    this.thisId = 'speed'
    this.onChange = this.onChange.bind(this)
  }

  async speedSetter ({ id, speed }) {
    this.props.setSpeed({
      variables: { id: id, speed: parseInt(speed) }
    })
  }

  onChange (event) {
    const lms = new LocalMatchState(this.props.matchData)
    const id = this.props.carId
    lms.setSpeedIndex({ id: id, speedIndex: event.target.value })
    this.speedSetter({
      id: id,
      speed: lms.speed({ id })
    }).then(() => {
      document.getElementById(this.thisId).blur()
    })
  }

  listSpeedChanges (car) {
    var result = []
    for (var i = 0; i < car.phasing.speedChanges.length; i++) {
      result.push(
        <option key={i} value={i}>
          { car.phasing.speedChanges[i] }
        </option>
      )
    }
    return result
  }

  render () {
    const lms = new LocalMatchState(this.props.matchData)
    const car = lms.car({ id: this.props.carId })
    return (
      <>
        <u>S</u>peed:&nbsp;&nbsp;
        <select
          className='Options'
          id={ this.thisId }
          value={ car.phasing.speedChangeIndex }
          onChange={ this.onChange }>
          { this.listSpeedChanges(car) }
        </select>
      </>
    )
  }
}

export default compose(
  SET_SPEED
)(SpeedSelector)
