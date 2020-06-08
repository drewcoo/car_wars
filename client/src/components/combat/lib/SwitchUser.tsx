import * as React from 'react'
import LocalMatchState from './LocalMatchState'
import Session from './Session'
import '../../../App.css'

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  matchData: any
  matchId: string
}

interface State {
  userId: string | null
}

//
// if 'godmode' is in the URL search string, show this
//
class SwitchUser extends React.Component<Props, State> {
  thisId: string

  constructor(props: Props) {
    super(props)
    this.thisId = 'switchUser'
    this.state = { userId: localStorage.getItem('playerId') }
    this.onChange = this.onChange.bind(this)
  }

  listUsers(): React.ReactNode {
    const lms = new LocalMatchState(this.props.matchData)
    return lms.players().map((player) => {
      return (
        <option key={player.id} value={player.id} style={{ color: player.color, fontSize: '50px' }}>
          {player.name}
        </option>
      )
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange(event: any): void {
    this.setState({ userId: event.target.value })
    localStorage.setItem('playerId', event.target.value)
    const elem = document.getElementById(this.thisId)
    if (!elem) {
      throw new Error(`Cannot find element with id ${this.thisId}`)
    }
    elem.blur()
    window.location.reload(false)
  }

  render(): React.ReactNode {
    const whoiam = Session.whoami(this.props.matchData)
    if (!Session.godMode(this.props.matchData)) {
      return <span className="StartGame">{whoiam}</span>
    }

    const lms = new LocalMatchState(this.props.matchData)
    if (!this.state.userId) {
      throw new Error(`there is no player with id ${this.state.userId}`)
    }
    const color = lms.player({ id: this.state.userId }).color
    return (
      <span>
        <select
          className="Options"
          id={this.thisId}
          value={this.state.userId}
          style={{ color: color, fontSize: '50px' }}
          onChange={this.onChange}
        >
          {this.listUsers()}
        </select>
      </span>
    )
  }
}

export default SwitchUser
