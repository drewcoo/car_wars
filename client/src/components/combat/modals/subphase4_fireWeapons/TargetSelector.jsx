import * as React from 'react'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import LocalMatchState from '../../lib/LocalMatchState'
import setTarget from '../../../graphql/mutations/setTarget'
import '../../../../App.css'

const SET_TARGET = graphql(setTarget, { name: 'setTarget' })

class Target extends React.Component {
  constructor (props) {
    super(props)
    this.matchId = props.matchId
    this.thisId = 'target'
    this.onChange = this.onChange.bind(this)
  }

  async targetSetter ({ id, targetIndex }) {
    this.props.setTarget({ variables: { id, targetIndex } })
  }

  listTargets (car) {
    const lms = new LocalMatchState(this.props.matchData)
    var result = []
    if (car.phasing.targets.length > 0) {
      for (var i = 0; i < car.phasing.targets.length; i++) {
        // option name is:
        //   <car_name> <facing_abbreviation> <tire|side>
        //
        const locType = (car.phasing.targets[i].name.length === 1) ? 'side' : 'tire'
        const shootThatCar = lms.car({ id: car.phasing.targets[i].carId })
        const locString = `${shootThatCar.name} ${car.phasing.targets[i].name} ${locType}`
        result.push(
          <option key={ i } value={ i } style={ this.selectStyle(i) } >{ locString }</option>
        )
      }
    } else {
      console.assert(car.phasing.targetIndex === 0)
      result.push(<option key={ 'none' } value={' none' }>none</option>)
    }
    return result
  }

  targetValue (car) {
    return car.phasing.targetIndex || 0
  }

  onChange (event) {
    const lms = new LocalMatchState(this.props.matchData)
    const car = lms.car({ id: this.props.carId })

    this.targetSetter({
      id: car.id,
      targetIndex: parseInt(event.target.value)
    })
    // release focus so we can pick up keyoard input again
    // document.getElementById(this.thisId).blur()
  }

  selectStyle (index) {
    const lms = new LocalMatchState(this.props.matchData)
    const car = lms.car({ id: this.props.carId })

    let color = 'white'
    if (car.phasing.targets.length > 0) {
      color = lms.car({ id: car.phasing.targets[parseInt(index)].carId }).color
    }
    return {
      color: color
    }
  }

  render () {
    const lms = new LocalMatchState(this.props.matchData)
    const car = lms.car({ id: this.props.carId })

    return (
      <>
        <u>T</u>arget:&nbsp;&nbsp;
        <select
          className='Options'
          style={ this.selectStyle(this.targetValue(car)) }
          id={ this.thisId }
          value={ this.targetValue(car) }
          onChange={ this.onChange }>
          { this.listTargets(car) }
        </select>
      </>
    )
  }
}

export default compose(
  SET_TARGET
)(Target)
