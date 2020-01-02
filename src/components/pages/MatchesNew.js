import React from 'react'
import { withRouter } from 'react-router-dom'
import { store, addMatch, addCarToMatch } from '../../redux'
import '../../App.css'

import uuid from 'uuid/v4'

import { Map } from '../../maps/arenaMap1'

class MatchesNew extends React.Component {
  constructor (props) {
    super(props)
    this.state = { value: '' }
    this.map = Map
    this.matchId = uuid()
    this.players = this.createPlayerList([
      { name: 'Alice', color: 'red' },
      { name: 'Bob', color: 'blue' },
      { name: 'Carol', color: 'green' },
      { name: 'Donald', color: 'purple' }
    ])
    this.startingPositions = [0, 1, 2, 3]
    this.players.forEach((player, index) => player.cars.push(
      this.createCar({
        player: player,
        name: `car${index}`,
        design: 'KillerKart',
        startingPosition: this.startingPositions[index]
      })
    ))
    this.palette = ['maroon', 'red', 'orange', 'yellow', 'olive', 'green',
      'purple', 'fuchsia', 'lime', 'teal', 'aqua', 'blue',
      'navy', 'black', 'gray', 'silver', 'white']

    this.handleCarNameChange = this.handleCarNameChange.bind(this)
    this.handleColorChange = this.handleColorChange.bind(this)
    this.handlePlayerNameChange = this.handlePlayerNameChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
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
    var player = this.players.find(player => player.id === event.target.id)
    player.name = event.target.value
  }

  handleColorChange (event) {
    var player = this.players.find(player => player.id === event.target.id)
    player.color = event.target.value
    this.setState({ value: event.target.value })
  }

  handleCarNameChange (event) {
    var car = this.players.find(player =>
      player.cars.find(car => car.id === event.target.id)
    )
    car.name = event.target.value
  }

  handleSubmit (event) {
    event.preventDefault()

    store.dispatch(addMatch({
      matchId: this.matchId,
      map: this.map,
      cars: [],
      players: this.players
    }))

    for (var i = 0; i < this.players.length; i++) {
      for (var j = 0; j < this.players[i].cars.length; j++) {
        var car = this.players[i].cars[j]
        store.dispatch(addCarToMatch({
          matchId: this.matchId,
          id: car.id,
          design: car.design,
          name: car.name,
          player: this.players[i],
          color: this.players[i].color,
          startingPosition: car.startingPosition
        }))
      }
    }

    this.props.history.push('/arena/' + this.matchId)
  }

  createPlayer ({ name, color = 'black' }) {
    return {
      id: uuid(),
      name: name,
      color: color,
      cars: [],
      currentCarIndex: 0,
      currentSpeed: 20
    }
  }

  createPlayerList (playerArray) {
    return playerArray.map(init => this.createPlayer(init))
  }

  createCar ({ player, name, design, startingPosition }) {
    return {
      color: player.color,
      name: name,
      id: uuid(),
      design: design,
      startingPosition: startingPosition
    }
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
    player.cars.forEach(car => {
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
          {car.design}
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
          { this.players.map(player => this.addPlayerToForm(player)) }
          <input type="submit" value="Submit" style={ this.colorStyle() } />
        </form>
      </div>
    )
  }
}

export default withRouter(MatchesNew)
