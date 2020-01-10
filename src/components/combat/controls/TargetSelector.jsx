import * as React from 'react'
import {connect} from "react-redux"
import MatchWrapper from '../../../utils/wrappers/MatchWrapper'
import ViewElement from '../../../utils/ViewElement'
import { store, ghostTargetSet } from '../../../redux'
import '../../../App.css'

const mapStateToProps = (state) => {
  return({ matches: state.matches })
}

class Target extends React.Component {
  constructor(props) {
    super(props)
    this.matchId = props.matchId
    this.thisId = 'target'
    this.onChange = this.onChange.bind(this)
  }

  listTargets({ match }) {
    const car = match.currentCar()
    var result = []
    if (car.phasing.targets.length > 0) {
      for (var i = 0; i < car.phasing.targets.length; i++) {
        const locType = (car.phasing.targets[i].name.length === 1) ? 'side' : 'tire'
        const shootThatCar = match.car({ id: car.phasing.targets[i].carId })
        const locString = `${shootThatCar.name} ${car.phasing.targets[i].name} ${locType}`
        result.push(<option key={i} value={i}>{ locString }</option>)
      }
    } else {
      console.assert(car.phasing.targetIndex === 0)
      result.push(<option key={ 'none' } value={' none' }>none</option>)
    }
    return result
  }

  targetValue({ match }) {
    return match.currentCar().phasing.targetIndex || 0
  }

  onChange(event) {
    const match = new MatchWrapper({ match: this.props.matches[this.matchId] })
    store.dispatch(ghostTargetSet({
      matchId: this.matchId,
      id: match.currentCar().id,
      targetIndex: event.target.value
    }))
    ViewElement('reticle')
    // release focus so we can pick up keyoard input again
    document.getElementById(this.thisId).blur()
  }

  render() {
    const match = new MatchWrapper({ match: this.props.matches[this.matchId] })

    return (
      <select
        className='Options'
        id={ this.thisId }
        value={ this.targetValue({ match }) }
        onChange={ this.onChange }>
        { this.listTargets({ match }) }
      </select>
    )
  }
}

export default connect(mapStateToProps)(Target)
