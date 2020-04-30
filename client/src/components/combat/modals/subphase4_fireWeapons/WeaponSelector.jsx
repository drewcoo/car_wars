import * as React from 'react'
import LocalMatchState from '../../lib/LocalMatchState'
import '../../../../App.css'
import { compose } from 'recompose'
import setWeapon from '../../../graphql/mutations/setWeapon'
import { graphql } from 'react-apollo'

const SET_WEAPON = graphql(setWeapon, { name: 'setWeapon' })

class Weapon extends React.Component {
  constructor (props) {
    super(props)
    this.thisId = 'weapon'
    this.onChange = this.onChange.bind(this)
  }

  async weaponSetter ({ id, weaponIndex }) {
    await this.props.setWeapon({
      variables: { id: id, weaponIndex: weaponIndex }
    })
  }

  listWeapons (car) {
    const weapons = car.design.components.weapons
    var result = []
    for (var i = 0; i < weapons.length; i++) {
      result.push(<option key={i} value={i}>{weapons[i].abbreviation} - {weapons[i].location}</option>)
    }
    return result
  }

  onChange (event) {
    const lms = new LocalMatchState(this.props.matchData)
    const car = lms.car({ id: this.props.carId })
    this.weaponSetter({
      id: car.id,
      weaponIndex: parseInt(event.target.value)
    })
  }

  render () {
    const lms = new LocalMatchState(this.props.matchData)
    const car = lms.car({ id: this.props.carId })

    return (
      <>
        <u>W</u>eapon:&nbsp;&nbsp;
        <select
          className='Options'
          value={ car.phasing.weaponIndex }
          onChange={ this.onChange }
        >
          { this.listWeapons(car) }
        </select>
      </>
    )
  }
}

export default compose(
  SET_WEAPON
)(Weapon)
