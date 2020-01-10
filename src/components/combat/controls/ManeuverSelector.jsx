import * as React from 'react'
import {connect} from "react-redux"
import MatchWrapper from '../../../utils/wrappers/MatchWrapper'
import ViewElement from '../../../utils/ViewElement'
import { store, maneuverSet, ghostForward, ghostHalf, ghostReset, ghostShowCollisions } from '../../../redux'
import '../../../App.css'

const mapStateToProps = (state) => {
  return({ matches: state.matches })
}

class Maneuver extends React.Component {
  // props.matchId
  constructor(props) {
    super(props)
    this.thisId = 'maneuver'
    this.onChange = this.onChange.bind(this)
  }

  onChange(event) {
    const currentCarId = new MatchWrapper({ match: this.props.matches[this.props.matchId] }).currentCarId()
    ViewElement(currentCarId)
    store.dispatch(maneuverSet({
      matchId: this.props.matchId,
      id: currentCarId,
      maneuverIndex: event.target.value
    }))

    const match = this.props.matches[this.props.matchId]
    const car = match.cars[match.time.phase.moving]

    // argh - the index here is a stringified number
    if (event.target.value === '0') {
      store.dispatch(ghostReset({ matchId: this.props.matchId, id: currentCarId }))
    } else if (event.target.value === 'half') {
      store.dispatch(ghostHalf({ matchId: this.props.matchId, id: car.id }))
    } else {
      store.dispatch(ghostForward({ matchId: this.props.matchId, id: currentCarId }))
    }
    store.dispatch(ghostShowCollisions({ matchId: this.props.matchId, id: currentCarId }))
    document.getElementById(this.thisId).blur()
  }

  listManeuvers({ match }) {
    const car = match.currentCar()
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
    const match = new MatchWrapper({ match: this.props.matches[this.props.matchId] })

    return (
      <span>
        <select
          className='Options'
          id={ this.thisId }
          value={ match.currentCar().phasing.maneuverIndex }
          onChange={ this.onChange }
        >
          { this.listManeuvers({ match }) }
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

export default connect(mapStateToProps)(Maneuver)
