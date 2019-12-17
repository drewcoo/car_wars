import React, { Component,  useReducer  } from 'react'
import { Provider } from 'react-redux'
import { store } from '../../redux'

import { useDispatch, useSelector} from 'react-redux'
import { playersReset } from '../../redux'

import {
//  BrowserRouter as Router,
//  Switch,
//  Route,
  Link
//  useRouteMatch,
//  useParams
} from 'react-router-dom'

import '../../App.css'

import uuid from 'uuid/v4'

class NewGame extends React.Component {
  constructor(props) {
    super(props)
    this.state = {value: ''}

    this.map = { name: 'arenaMap1' }

    this.players = this.createPlayerList([
      { name: 'Alice', color: 'red' },
      { name: 'Bob', color: 'blue' },
      { name: 'Carol', color: 'green' },
      { name: 'Donald', color: 'purple' }
    ])
    this.startingPositions = ['a', 'b', 'c', 'd']
    this.players.forEach((player, index) => player.cars.push(
      this.createCar({ player: player,
                       name: `car${index}`,
                       design: 'KillerKart',
                       startingPosition: this.startingPositions[index] })
    ))
    this.palette = ['maroon', 'red', 'orange', 'yellow', 'olive', 'green',
      'purple', 'fuchsia', 'lime', 'teal', 'aqua', 'blue',
      'navy', 'black', 'gray', 'silver', 'white']

    this.handleCarNameChange = this.handleCarNameChange.bind(this)
    this.handleColorChange = this.handleColorChange.bind(this)
    this.handlePlayerNameChange = this.handlePlayerNameChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  colorStyle(myColor = 'white') {
    return {
      background: 'black',
      color: myColor,
      fontSize: '40px',
      fontFamily: 'fantasy',
      fontVariant: 'small-caps'
    }
  }

  handlePlayerNameChange(event) {
    var player = this.players.find(player => player.id === event.target.id)
    player.name = event.target.value
  }

  handleColorChange(event) {
    var player = this.players.find(player => player.id === event.target.id)
    player.color = event.target.value
    this.setState({value: event.target.value})
  }

  handleCarNameChange(event) {
    var car = this.players.find(player =>
      player.cars.find(car => car.id === event.target.id)
    )
    car.name = event.target.value
    console.log(this.players)
  }


  handleSubmit(event) {
    console.log(this.players)
    console.log(store.getState())
    store.dispatch(playersReset({ players: this.players }))
    /*dispatch(playersReset({
      players: this.players
    }))
    alert('A name was submitted: ' + this.state.value);
    */
    console.log(this.players)
    console.log(store.getState())
  //  window.location.href = '/arena'
    event.preventDefault()
    console.log(store.getState())

  }

  createPlayer({ name, color = 'black' }) {
    return { id: uuid(), name: name, color: color,
             cars: [],
             currentCarIndex: 0, currentSpeed: 20  }
  }

  createPlayerList(playerArray) {
    return playerArray.map(init => this.createPlayer(init))
  }

  createCar({ player, name, design, startingPosition }) {
    return {
      color: player.color,
      name: name,
      id: uuid(),
      design: design,
      startingPosition: startingPosition,
    }
  }

  addPlayerColorSelector(player) {
    var result = []
    this.palette.forEach(color =>
      result.push(
        <option key={ `${color}-${player.id}` } id={player.id} value={ color } style={ this.colorStyle(color) } >
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

  showCars(player) {
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

  addPlayerToForm(player) {
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

  render() {
    return (
      <Provider store={ store }>
      <form onSubmit={ this.handleSubmit }>
        <div key='mapName' style={ this.colorStyle() } >
          { this.map.name }
        </div>
        { this.players.map(player => this.addPlayerToForm(player)) }
        <input type="submit" value="Submit" />
      </form>
      </Provider>
    )
  }
}

export default NewGame
