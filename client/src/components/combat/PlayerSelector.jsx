import * as React from 'react'
import LocalMatchState from './lib/LocalMatchState'

class PlayerName extends React.Component {
  constructor (props) {
    super(props)
    this.players = this.props.matchData.players.map(player => {
      return ({
        id: player.id,
        color: player.color,
        name: player.name
      })
    })
    this.activePlayer = this.players[0]
    this.handlePlayerChange = this.handlePlayerChange.bind(this)
  }

  handlePlayerChange (event) {
    this.activePlayer = this.players.find(player => player.name === event.target.value)
    this.setState({ value: event.target.value })
  }

  playerSelector () {
    var result = []
    this.players.forEach(player =>
      result.push(
        <option
          key={ player.id }
          id={ player.id }
          value={ player.name }
        >
          { player.name }
        </option>
      )
    )
    return (
      <select
        id={ 'playerSelector' }
        onChange={ this.handlePlayerChange }
        value={ this.activePlayer.name }
      >
        { result }
      </select>
    )
  }

  render () {
    const colorStyle = {
      color: new LocalMatchState(this.props.matchData).activePlayer().color,
      padding: '10px'
    }

    return (
      <span style={ colorStyle }>
        {
          this.playerSelector()
        }
      </span>
    )
  }
}

export default PlayerName
