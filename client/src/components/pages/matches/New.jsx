/* eslint-disable no-console */
import React from 'react'
import { graphql, Query } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import uuid from 'uuid/v4'
import '../../../App.css'
import createCompleteMatch from '../../graphql/mutations/createCompleteMatch'
import setupOptions from '../../graphql/queries/setupOptions'
import Players from './setup/Players'

const CREATE_MATCH = graphql(createCompleteMatch, { name: 'createCompleteMatch' })
const SETUP_OPTIONS = setupOptions

class MatchNew extends React.Component {
  constructor(props) {
    super(props)
    this.state = { value: '' }
    this.map = 'arenaMap1'
    this.players = this.createPlayers([
      { name: 'Alice', color: 'red', startingPositions: [0] },
      { name: 'Bob', color: 'blue', startingPositions: [1] },
      { name: 'Carol', color: 'green', startingPositions: [2] },
      { name: 'Donald', color: 'purple', startingPositions: [3] },
    ])
    this.handleCarNameChange = this.handleCarNameChange.bind(this)
    this.handleColorChange = this.handleColorChange.bind(this)
    this.handleDesignChange = this.handleDesignChange.bind(this)
    this.handlePlayerNameChange = this.handlePlayerNameChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  createPlayers(data) {
    const result = {}
    data.forEach((element) => {
      const playerId = uuid()
      result[playerId] = {
        cars: [],
        color: element.color,
        id: playerId,
        name: element.name,
      }

      element.startingPositions.forEach((startingPosition) => {
        const carId = uuid()
        result[playerId].cars.push({
          color: element.color,
          designName: 'Killer Kart',
          id: carId,
          name: `car${startingPosition}`,
          playerId: playerId,
          startingPosition: startingPosition,
        })
      })
    })
    return result
  }

  handlePlayerNameChange(event) {
    this.players[event.target.id].name = event.target.value
    this.setState({ value: event.target.value })
  }

  handleColorChange(event) {
    const id = event.target.id.replace('color-', '')
    this.players[id].color = event.target.value
    this.players[id].cars.forEach((car) => (car.color = event.target.value))
    this.setState({ value: event.target.value })
  }

  handleCarNameChange(event) {
    const [_junk, playerId, vehicleId] = event.target.id.match(/carname-p(.*)-v(.*)/)
    const vehicle = this.players[playerId].cars.find((element) => element.id === vehicleId)
    vehicle.name = event.target.value
    this.setState({ value: event.target.value })
  }

  handleDesignChange(event) {
    const [_junk, playerId, vehicleId] = event.target.id.match(/design-p(.*)-v(.*)/)
    const vehicle = this.players[playerId].cars.find((element) => element.id === vehicleId)
    vehicle.designName = event.target.value
    this.setState({ value: event.target.value })
  }

  async handleSubmit(event) {
    event.preventDefault()

    const response = await this.props.createCompleteMatch({
      variables: {
        mapName: 'ArenaMap1',
        carData: Object.values(this.players).map((player) => {
          const car = player.cars[0] // hard-coded first car
          return {
            name: car.name,
            playerName: player.name,
            playerId: player.id,
            playerColor: player.color,
            designName: car.designName,
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

    localStorage.setItem('playerId', Object.keys(this.players)[0])

    this.props.history.push({
      pathname: `/match/${match.id}`, // }?godmode=true`,
      state: { from: this.props.location },
    })
  }

  render() {
    this.listStarted = false
    if (document.getElementById('navOptions')) {
      document.getElementById('navOptions').style.display = ''
    }
    return (
      <Query pollInterval={250} query={SETUP_OPTIONS} variables={{}}>
        {({ loading, error, data }) => {
          if (loading) {
            return 'Loading...'
          }
          if (error) {
            console.log('error')
            console.log(error)
            return `Error! ${error.message}`
          }

          if (document.getElementById('navOptions')) {
            document.getElementById('navOptions').style.display = 'none'
          }

          console.log(data)

          return (
            <div>
              <div style={{ backgroundColor: '#121212' }}>
                <form onSubmit={this.handleSubmit}>
                  <fieldset className="SetupPage" style={{ width: '40%' }}>
                    <legend className="SetupPage">map</legend>
                    <div className="SetupPage" key="mapName">
                      {this.map}
                    </div>
                  </fieldset>
                  <br />

                  <Players
                    players={this.players}
                    designs={data.setupOptions.designs}
                    handleCarNameChange={this.handleCarNameChange}
                    handleColorChange={this.handleColorChange}
                    handleDesignChange={this.handleDesignChange}
                    handlePlayerNameChange={this.handlePlayerNameChange}
                  />

                  <input className="SetupPage" type="submit" value="Submit" />
                </form>
              </div>
            </div>
          )
        }}
      </Query>
    )
  }
}

const unrouted = compose(CREATE_MATCH)(MatchNew)
export default withRouter(unrouted)
