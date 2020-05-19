import * as React from 'react'
import LocalMatchState from './LocalMatchState'
import Session from './Session'
import '../../../App.css'

//
// if 'godmode' is in the URL search string, show this
//
class SwitchUser extends React.Component {
  constructor(props) {
    super(props)
    this.matchId = props.matchId
    this.thisId = 'switchUser'
    this.state = { userId: localStorage.getItem('playerId') }
    this.onChange = this.onChange.bind(this)
  }

  listUsers() {
    const lms = new LocalMatchState(this.props.matchData)
    return lms.players().map((player) => {
      return (
        <option key={player.id} value={player.id} style={{ color: player.color }}>
          {player.name}
        </option>
      )
    })
  }

  onChange(event) {
    this.setState({ userId: event.target.value })
    localStorage.setItem('playerId', event.target.value)
    document.getElementById(this.thisId).blur()
    window.location.reload(false)
  }

  render() {
    const whoiam = Session.whoami(this.props.matchData)
    if (!Session.godMode(this.props.matchData)) {
      return <span className="StartGame">{whoiam}</span>
    }

    const lms = new LocalMatchState(this.props.matchData)
    const color = lms.player({ id: this.state.userId }).color
    return (
      <span>
        <select
          className="Options"
          id={this.thisId}
          value={this.state.userId}
          style={{ color: color }}
          onChange={this.onChange}
        >
          {this.listUsers()}
        </select>
      </span>
    )
  }
}

export default SwitchUser
