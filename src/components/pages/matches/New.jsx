import React from 'react'
import { withRouter } from 'react-router-dom'
import { store, addMatch, addMap, addCarToMatch, startMatch } from '../../../redux'
import '../../../App.css'

import uuid from 'uuid/v4'

// Here but don't know why? You may have been redirected by the kludge
// in src/utils/wrappers/MatchWrapper.ts.

class MatchNew extends React.Component {
  constructor (props) {
    super(props)
    this.state = { value: '' }
    this.map = 'arenaMap1'
    this.matchId = uuid()
    this.players = this.createPlayers([
      { name: 'Alice', color: 'red' },
      { name: 'Bob', color: 'blue' },
      { name: 'Carol', color: 'green' },
      { name: 'Donald', color: 'purple' }
    ])
    this.cars = this.createCars({ startingPositions: [ 0, 1, 2, 3] })
    Object.keys(this.cars).forEach((carId) => {
      let pid = this.cars[carId].playerId
      this.players[pid].carIds.push(carId)
    })
    this.palette = ['maroon', 'red', 'orange', 'yellow', 'olive', 'green',
      'purple', 'fuchsia', 'lime', 'teal', 'aqua', 'blue',
      'navy', 'black', 'gray', 'silver', 'white']
    this.handleCarNameChange = this.handleCarNameChange.bind(this)
    this.handleColorChange = this.handleColorChange.bind(this)
    this.handlePlayerNameChange = this.handlePlayerNameChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  createPlayers(namesAndColors) {
    let result = {}
    namesAndColors.forEach( ({ name, color = 'black'}) => {
      let id = uuid()
      result[id] = {
        carIds: [],
        color: color,
        id: id,
        name: name
      }
    })
    return result
  }

  createCar ({ id, playerId, name, design, startingPosition }) {
    return {
      color: this.players[playerId].color,
      name: name,
      id: id,
      playerId: playerId,
      design: design,
      startingPosition: startingPosition
    }
  }

  createCars({ startingPositions }) {
    let result = {}
    let index = 0
    Object.keys(this.players).forEach((playerId) => {
      let car = this.createCar({
        id: uuid(),
        playerId: playerId,
        name: `car${index}`,
        design: 'KillerKart',
        startingPosition: startingPositions[index]
      })
      result[car.id] = car
      index++
    })
    return result
  }

  colorStyle (myColor = 'white') {
    return {
      background: 'black',
      color: myColor,
      fontSize: '40px',
      fontFamily: 'fantasy',
      fontVariant: 'small-caps'
    }
  }

  handlePlayerNameChange (event) {
    this.players[event.target.id].name = event.target.value
  }

  handleColorChange (event) {
    const player = this.players[event.target.id]
    player.color = event.target.value
    this.setState({ value: event.target.value })
  }

  handleCarNameChange (event) {
    const car = this.cars[event.target.id]
    car.name = event.target.value
  }

  handleSubmit (event) {
    event.preventDefault()

    store.dispatch(addMatch({
      matchId: this.matchId,
      map: this.map,
      cars: {},
      players: this.players
    }))

    store.dispatch(addMap({
      matchId: this.matchId,
      map: this.map
    }))

    Object.keys(this.players).forEach((playerId) => {
      let player = this.players[playerId]
      this.players[playerId].carIds.forEach((carId) => {
        let car = this.cars[carId]
        store.dispatch(addCarToMatch({
          matchId: this.matchId,
          id: car.id,
          design: car.design,
          name: car.name,
          playerId: player.id,
          // Ugly shortcut so that I can call car.color instead of players[car.playerId].color
          color: player.color,
          startingPosition: car.startingPosition
        }))
      })
    })

    store.dispatch(startMatch({ matchId: this.matchId }))

    // Strange kludge. Not sure how to do this right.
    this.props.history.push('/match/' + this.matchId)
  }

  addPlayerColorSelector (player) {
    var result = []
    this.palette.forEach(color =>
      result.push(
        <option
          key={ `${color}-${player.id}` }
          id={ player.id }
          value={ color }
          style={ this.colorStyle(color) } >
          { color }
        </option>
      )
    )
    return (
      <select
        id={ player.id }
        onChange={ this.handleColorChange }
        value={ player.color }
        style={ this.colorStyle(player.color) }
      >
        { result }
      </select>
    )
  }

  showCars (player) {
    var result = []
    // BUGBUG: hard-code to first car
    player.carIds.forEach((carId) => {
      let car = this.cars[carId]
      result.push(
        <span key={ car.id } style={ this.colorStyle() }>
          <input
            id={ car.id }
            key={ car.id }
            style={ this.colorStyle() }
            type='text'
            defaultValue={ car.name }
            onChange={ this.handleCarNameChange }
          />
          { car.design }
        </span>
      )
    })
    return result
  }

  addPlayerToForm (player) {
    return (
      <label key={ player.id }>
        <input
          id={ player.id }
          key={ player.id }
          style={ this.colorStyle() }
          type='text'
          defaultValue={ player.name }
          onChange={ this.handlePlayerNameChange }
        />
        { this.addPlayerColorSelector(player) }
        { this.showCars(player) }
        <br />
      </label>
    )
  }

  render () {
    return (
      <div>
        <form onSubmit={ this.handleSubmit }>
          <div key='mapName' style={ this.colorStyle() } >
            { this.map.name }
          </div>
          { Object.keys(this.players).map(playerId => this.addPlayerToForm(this.players[playerId])) }
          <input type="submit" value="Submit" style={ this.colorStyle() } />
        </form>
      </div>
    )
  }
}

export default withRouter(MatchNew)
