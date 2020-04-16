import * as React from 'react'
import LocalMatchState from '../lib/LocalMatchState'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'

import '../../../App.css'
import activeManeuverSet from '../../graphql/mutations/activeManeuverSet'
const ACTIVE_MANEUVER_SET = graphql(activeManeuverSet, { name: 'activeManeuverSet' })

class Maneuver extends React.Component {
  constructor(props) {
    super(props)
    this.thisId = 'maneuver'
    this.onChange = this.onChange.bind(this)
  }

  async activeManeuverSet({ id, maneuverIndex }) {
    return await this.props.activeManeuverSet({
      variables: { id: id, maneuverIndex: maneuverIndex }
    })
  }

  onChange(event) {
    const id = new LocalMatchState(this.props.matchData).currentCarId()

    this.activeManeuverSet({
      id: id,
      maneuverIndex: parseInt(event.target.value)
    })

    // release focus so we can pick up keyoard input again
    document.getElementById(this.thisId).blur()
  }

  listManeuvers() {
    const car = new LocalMatchState(this.props.matchData).currentCar()
    var result = []
    for (var i = 0; i < car.status.maneuvers.length; i++) {
      result.push(
        <option key={ i } value={ i }>
          { car.status.maneuvers[i] }
        </option>
      )
    }
    return result
  }

  render() {
    return (
      <span>
        <select
          className='Options'
          id={ this.thisId }
          value={ new LocalMatchState(this.props.matchData).currentCar().phasing.maneuverIndex }
          onChange={ this.onChange }
        >
          { this.listManeuvers() }
        </select>
        <span>&nbsp;&nbsp;</span>
        <select id='degrees' style={{ visibility: 'hidden' }} defaultValue='0'>
          <option>-1</option>
          <option>0</option>
          <option>1</option>
        </select>
      </span>
    )
  }
}

export default compose (
//  ACTIVE_SHOW_COLLISIONS,
  ACTIVE_MANEUVER_SET
)(Maneuver)
