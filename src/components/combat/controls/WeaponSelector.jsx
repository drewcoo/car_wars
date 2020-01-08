import * as React from 'react'
import {connect} from "react-redux"
import MatchWrapper from '../../../utils/wrappers/MatchWrapper'
import ViewElement from '../../../utils/ViewElement'
import { store, weaponSet } from '../../../redux'
import '../../../App.css'

const mapStateToProps = (state) => {
  return({ matches: state.matches })
}

class Weapon extends React.Component {
  // props.matchId
  constructor(props) {
    super(props)
    this.thisId = 'weapon'
    this.onChange = this.onChange.bind(this)
  }

  listWeapons({ match }) {
    const weapons = match.currentCar().design.components.weapons
    var result = []
    for (var i = 0; i < weapons.length; i++) {
      result.push(<option key={i} value={i}>{weapons[i].abbreviation} - {weapons[i].location}</option>)
    }
    return result
  }

  onChange(event) {
    const car = new MatchWrapper(this.props.matches[this.props.matchId]).currentCar()
    ViewElement(car.id)
    store.dispatch(weaponSet({
      matchId: this.props.matchId,
      id: car.id,
      weapon: event.target.value
    }))
    // BUGBUG - timing makes this focus-setting fail.
    // viewElement('reticle')

    // release focus so we can pick up keyoard input again
    document.getElementById(this.thisId).blur()
  }

  render() {
    const match = new MatchWrapper(this.props.matches[this.props.matchId])

    return (
      <select
        className='Options'
        id={ this.thisId }
        value={ match.currentCar().phasing.weaponIndex }
        onChange={ this.onChange }
      >
        { this.listWeapons({ match }) }
      </select>
    )
  }
}

export default connect(mapStateToProps)(Weapon)
