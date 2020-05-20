/* eslint-disable no-console */
import React from 'react'
import { compose } from 'recompose'
import { withRouter } from 'react-router-dom'
import '../../../App.css'
import uuid from 'uuid/v4'
import { graphql } from 'react-apollo'
import createCompleteMatch from '../../graphql/mutations/createCompleteMatch'

const CREATE_MATCH = graphql(createCompleteMatch, { name: 'createCompleteMatch' })

class MatchNew extends React.Component {
  constructor(props) {
    super(props)
    this.fieldsetColor = '#121212'
    this.trimColor = '#2b2b2b'
    this.backgroundColor = 'black'
    this.state = { value: '', foo: '' }
    this.map = 'arenaMap1'
    this.players = this.createPlayers([
      { name: 'You', color: 'red' },
      { name: 'Bob', color: 'blue' },
      { name: 'Carol', color: 'green' },
      { name: 'Donald', color: 'purple' },
    ])
    this.cars = this.createCars({ startingPositions: [0, 1, 2, 3] })
    Object.keys(this.cars).forEach((carId) => {
      const pid = this.cars[carId].playerId
      this.players[pid].carIds.push(carId)
    })
    this.palette = [
      'maroon',
      'red',
      'orange',
      'yellow',
      'olive',
      'green',
      'purple',
      'fuchsia',
      'lime',
      'teal',
      'aqua',
      'blue',
      'navy',
      'black',
      'gray',
      'silver',
      'white',
    ]
    this.handleCarNameChange = this.handleCarNameChange.bind(this)
    this.handleColorChange = this.handleColorChange.bind(this)
    this.handlePlayerNameChange = this.handlePlayerNameChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.listStarted = false
  }

  createPlayers(namesAndColors) {
    const result = {}
    namesAndColors.forEach(({ name, color = 'black' }) => {
      const id = uuid()
      result[id] = {
        carIds: [],
        color: color,
        id: id,
        name: name,
      }
    })
    return result
  }

  createCar({ id, playerId, name, design, startingPosition }) {
    return {
      color: this.players[playerId].color,
      name: name,
      id: id,
      playerId: playerId,
      design: design,
      startingPosition: startingPosition,
    }
  }

  createCars({ startingPositions }) {
    const result = {}
    let index = 0
    Object.keys(this.players).forEach((playerId) => {
      const car = this.createCar({
        id: uuid(),
        playerId: playerId,
        name: `car${index}`,
        design: 'Killer Kart',
        startingPosition: startingPositions[index],
      })
      result[car.id] = car
      index++
    })
    return result
  }

  colorStyle(myColor = 'white') {
    return {
      borderColor: this.trimColor,
      background: this.backgroundColor,
      color: myColor,
      fontSize: '30px',
      fontFamily: 'fantasy',
      fontVariant: 'small-caps',
    }
  }

  submitStyle(color) {
    return this.colorStyle(color)
  }

  handlePlayerNameChange(event) {
    this.players[event.target.id].name = event.target.value
  }

  handleColorChange(event) {
    const id = event.target.id.replace('color-', '')
    const player = this.players[id]
    player.color = event.target.value
    this.setState({ value: event.target.value })
  }

  handleCarNameChange(event) {
    const car = this.cars[event.target.id]
    car.name = event.target.value
  }

  async handleSubmit(event) {
    event.preventDefault()

    console.log(
      Object.values(this.players).map((player) => {
        const car = this.cars[player.carIds[0]]
        return {
          name: car.name,
          playerName: player.name,
          playerColor: player.color,
          designName: car.design,
        }
      }),
    )

    const response = await this.props.createCompleteMatch({
      variables: {
        mapName: 'ArenaMap1',
        carData: Object.values(this.players).map((player) => {
          const car = this.cars[player.carIds[0]]
          return {
            name: car.name,
            playerName: player.name,
            playerId: player.id,
            playerColor: player.color,
            designName: car.design,
          }
        }),
      },
    })

    const match = response.data.createCompleteMatch

    // Another kludge - make the nav select go away on map page
    if (document.getElementById('navOptions')) {
      document.getElementById('navOptions').style.display = 'none'
    }
    // Strange kludge. Not sure how to do this right.
    // use some kind of navigate package?

    Object.keys(this.players).forEach((k) => console.log(k))
    console.log(`this player: ${Object.keys(this.players)[0]}`)

    localStorage.setItem('playerId', Object.keys(this.players)[0])

    this.props.history.push({
      pathname: `/match/${match.id}`, // }?godmode=true`,
      state: { from: this.props.location },
    })
    console.log()
  }

  addPlayerColorSelector(player) {
    const result = []
    this.palette.forEach((color) =>
      result.push(
        <option key={`${color}-${player.id}`} id={player.id} value={color} style={this.colorStyle(color)}>
          {color}
        </option>,
      ),
    )
    return (
      <select
        id={`color-${player.id}`}
        onChange={this.handleColorChange}
        value={player.color}
        style={this.colorStyle(player.color)}
      >
        {result}
      </select>
    )
  }

  showCars(player) {
    const result = []
    // BUGBUG: hard-code to first car
    player.carIds.forEach((carId) => {
      const car = this.cars[carId]
      result.push(
        <span key={car.id} style={this.colorStyle()}>
          <input
            id={car.id}
            key={car.id}
            style={this.colorStyle()}
            type="text"
            defaultValue={car.name}
            onChange={this.handleCarNameChange}
          />
          <div style={{ whiteSpace: 'nowrap' }}>{car.design}</div>
        </span>,
      )
    })
    return result
  }

  startList() {
    if (this.listStarted) {
      return false
    }
    this.listStarted = true
    return true
  }

  addPlayerToForm(player) {
    return (
      <div key={player.id}>
        <fieldset style={{ width: '80%', backgroundColor: this.backgroundColor, borderColor: this.trimColor }}>
          <legend>
            <input
              autoFocus={this.startList()}
              id={player.id}
              key={player.id}
              style={this.colorStyle()}
              type="text"
              defaultValue={player.name}
              onChange={this.handlePlayerNameChange}
            />
          </legend>
          {this.addPlayerColorSelector(player)}
          <br />
          {this.showCars(player)}
        </fieldset>
        <br />
      </div>
    )
  }

  render() {
    this.listStarted = false
    if (document.getElementById('navOptions')) {
      document.getElementById('navOptions').style.display = ''
    }
    return (
      <div>
        <br />
        <div style={{ backgroundColor: this.fieldsetColor }}>
          <form onSubmit={this.handleSubmit}>
            <br />
            <fieldset style={{ borderColor: this.trimColor, backgroundColor: this.backgroundColor, width: '40%' }}>
              <legend style={this.colorStyle()}>map</legend>
              <div key="mapName" style={this.colorStyle()}>
                {this.map}
              </div>
            </fieldset>
            <br />
            <fieldset style={{ borderColor: this.trimColor, borderStyle: 'solid' }}>
              <legend style={this.colorStyle()}>Players</legend>
              <div style={{ columns: 2 }}>
                {Object.keys(this.players).map((playerId) => this.addPlayerToForm(this.players[playerId]))}
              </div>
            </fieldset>
            <br />

            <input type="submit" value="Submit" style={this.submitStyle()} />
          </form>
          <br />
        </div>
      </div>
    )
  }
}

const unrouted = compose(CREATE_MATCH)(MatchNew)
export default withRouter(unrouted)
