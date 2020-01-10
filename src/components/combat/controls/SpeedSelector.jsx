import * as React from 'react'
import {connect} from "react-redux"
import MatchWrapper from '../../../utils/wrappers/MatchWrapper'
import { store, speedSet } from '../../../redux'
import '../../../App.css'

const mapStateToProps = (state) => {
  return({ matches: state.matches })
}

class Speed extends React.Component {
  // props.matchId
  constructor(props) {
    super(props)
    this.thisId = 'speed'
    this.onChange = this.onChange.bind(this)
  }

  onChange(event) {
    const match = new MatchWrapper({ match: this.props.matches[this.props.matchId] })
    store.dispatch(speedSet({
      matchId: this.props.matchId,
      id: match.currentCar().id,
      speedChangeIndex: event.target.value
    }))
    document.getElementById(this.thisId).blur()
  }

  listSpeedChanges({ match }) {
    const car = match.currentCar()
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
    const match = new MatchWrapper({ match: this.props.matches[this.props.matchId] })

    return (
      <select
        className='Options'
        id={ this.thisId }
        value={ match.currentCar().phasing.speedChangeIndex }
        onChange={this.onChange}>
        { this.listSpeedChanges({ match }) }
      </select>
    )
  }
}

export default connect(mapStateToProps)(Speed)
