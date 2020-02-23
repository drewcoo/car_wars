import React from 'react'
import { compose } from 'recompose'
import { withRouter } from 'react-router-dom'
import '../../../App.css'
import uuid from 'uuid/v4'
import { graphql } from 'react-apollo'
import  createCompleteMatch from '../../graphql/mutations/createCompleteMatch'

const CREATE_MATCH = graphql(createCompleteMatch, { name: 'createCompleteMatch' })

class MatchNew extends React.Component {
  constructor (props) {
    super(props)
    this.state = { value: '' }
    this.map = 'arenaMap1'
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
        design: 'Killer Kart',
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

  submitStyle (color) {
    let result = this.colorStyle(color)
    result.float = 'right'
    return result
  }

  handlePlayerNameChange (event) {
    this.players[event.target.id].name = event.target.value
  }

  handleColorChange (event) {
    const id = event.target.id.replace('color-', '')
    const player = this.players[id]
    player.color = event.target.value
    this.setState({ value: event.target.value })
  }

  handleCarNameChange (event) {
    const car = this.cars[event.target.id]
    car.name = event.target.value
  }

  async handleSubmit (event) {
    event.preventDefault()

    console.log(
      Object.values(this.players).map(player => {
       let car = this.cars[player.carIds[0]]
       return {
         name: car.name,
         playerName: player.name,
         playerColor: player.color,
         designName: car.design
       }
     })
    )

    let response = await this.props.createCompleteMatch({
      variables: {
        mapName: "ArenaMap1",
        carData: Object.values(this.players).map(player => {
          let car = this.cars[player.carIds[0]]
          return {
            name: car.name,
            playerName: player.name,
            playerColor: player.color,
            designName: car.design
          }
        })
      }
    })

    let match = response.data.createCompleteMatch

    // Strange kludge. Not sure how to do this right.
    // use some kind of navigate package?
    this.props.history.push('/match/' + match.id)
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
        id={ `color-${player.id}` }
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
          <br/><br/>
          <input type="submit" value="Submit" style={ this.submitStyle() } />
          <br/><br/><br/><br/>
          <div key='mapName' style={ this.colorStyle() } >
            { this.map.name }
          </div>
          { Object.keys(this.players).map(playerId => this.addPlayerToForm(this.players[playerId])) }
        </form>
      </div>
    )
  }
}

const unrouted = compose (
  CREATE_MATCH,
)(MatchNew)
export default withRouter(unrouted)
