import * as React from 'react'
import LocalMatchState from '../lib/LocalMatchState'
import '../../../App.css'

import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import { gql } from 'apollo-boost'

const SET_SPEED = graphql(gql`
  mutation($id: ID!, $speed: Int!) {
    setSpeed(id: $id, speed: $speed)
  }
`, { name: 'setSpeed' })

class Speed extends React.Component {
  constructor(props) {
    super(props)
    this.thisId = 'speed'
    this.onChange = this.onChange.bind(this)
  }

  async speedSetter({ id, speed }) {
    return await this.props.setSpeed({
      variables: { id: id, speed: speed }
    })
  }

  onChange(event) {
    const lms = new LocalMatchState(this.props.matchData)
    const id = lms.currentCarId()
    lms.setSpeedIndex({ id: id, speedIndex: event.target.value })
    let changedSpeed = this.speedSetter({
      id: id,
      speed: lms.speed({ id })
    }).then(() => {
      document.getElementById(this.thisId).blur()
    })
  }

  listSpeedChanges(car) {
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

  render() {
    const lms = new LocalMatchState(this.props.matchData)

    return (
      <select
        className='Options'
        id={ this.thisId }
        value={ new LocalMatchState(this.props.matchData).currentCar().phasing.speedChangeIndex }
        onChange={ this.onChange }>
        { this.listSpeedChanges(new LocalMatchState(this.props.matchData).currentCar()) }
      </select>
    )
  }
}

export default compose (
  SET_SPEED,
)(Speed)
