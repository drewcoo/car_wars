import * as React from 'react'
import LocalMatchState from '../lib/LocalMatchState'
import Session from '../lib/Session'
import '../../../App.css'

import { compose } from 'recompose'
import { graphql } from 'react-apollo'

//
// if 'godmode' is in the URL search string, show this
//
class SwitchUser extends React.Component {
  constructor(props) {
    super(props)
    this.matchId = props.matchId
    this.thisId = 'switchUser'
    this.state = { userId: props.matchData.playerSession }
    this.onChange = this.onChange.bind(this)
  }

  listUsers() {
    const lms = new LocalMatchState(this.props.matchData)
    return (
      lms.players().map(player => {
        return (<option key={ player.id } value={ player.id } style={ { color: player.color } } >{ player.name }</option>)
      })
    )
  }

  onChange(event) {
    this.setState({ userId: event.target.value })
    this.props.onUserIdChange(event.target.value)
    document.getElementById(this.thisId).blur()
  }

  render() {
    if (!Session.godMode(this.props.matchData)) { return(<></>) }

    const lms = new LocalMatchState(this.props.matchData)
    const color = lms.player(this.state.userId).color
    return(
      <select
        className='Options'
        id={ this.thisId }
        value={ this.state.userId }
        style={ { color: color }}
        onChange={ this.onChange }>
        { this.listUsers() }
      </select>
    )
  }
}

export default SwitchUser
