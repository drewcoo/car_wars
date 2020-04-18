import * as React from 'react'
import LocalMatchState from '../lib/LocalMatchState'
import Session from '../lib/Session'
import '../../../App.css'
import { compose } from 'recompose'
import setWeapon from '../../graphql/mutations/setWeapon'
import { graphql } from 'react-apollo'

const SET_WEAPON = graphql(setWeapon, { name: 'setWeapon' })

class Weapon extends React.Component {
  constructor(props) {
    super(props)
    this.thisId = 'weapon'
    this.onChange = this.onChange.bind(this)
  }

  async weaponSetter({ id, weaponIndex }) {
    return await this.props.setWeapon({
      variables: { id: id, weaponIndex: weaponIndex }
    })
  }

  listWeapons() {
    const weapons = new LocalMatchState(this.props.matchData).currentCar().design.components.weapons
    var result = []
    for (var i = 0; i < weapons.length; i++) {
      result.push(<option key={i} value={i}>{weapons[i].abbreviation} - {weapons[i].location}</option>)
    }
    return result
  }

  onChange(event) {
    if (!Session.currentPlayer(this.props.matchData)) { return }
    const id = new LocalMatchState(this.props.matchData).currentCarId()
    this.weaponSetter({
      id: id,
      weaponIndex: parseInt(event.target.value)
    })
    // release focus so we can pick up keyoard input again
    document.getElementById(this.thisId).blur()
  }

  render() {
    return (
      <select
        className='Options'
        id={ this.thisId }
        value={ new LocalMatchState(this.props.matchData).currentCar().phasing.weaponIndex }
        onChange={ this.onChange }
      >
        { this.listWeapons() }
      </select>
    )
  }
}

export default compose (
  SET_WEAPON
)(Weapon)
