import * as React from 'react'
import LocalMatchState from '../lib/LocalMatchState'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'

import '../../../App.css'
import ghostManeuverSet from '../../graphql/mutations/ghostManeuverSet'
const GHOST_MANEUVER_SET = graphql(ghostManeuverSet, { name: 'ghostManeuverSet' })

class Maneuver extends React.Component {
  constructor(props) {
    super(props)
    this.thisId = 'maneuver'
    this.onChange = this.onChange.bind(this)
  }

  async ghostManeuverSet({ id, maneuverIndex }) {
    return await this.props.ghostManeuverSet({
      variables: { id: id, maneuverIndex: maneuverIndex }
    })
  }

  onChange(event) {
    const id = new LocalMatchState(this.props.matchData).currentCarId()

    this.ghostManeuverSet({
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
//  GHOST_SHOW_COLLISIONS,
  GHOST_MANEUVER_SET
)(Maneuver)
