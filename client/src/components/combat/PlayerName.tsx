import * as React from 'react'
import LocalMatchState from './lib/LocalMatchState'

class PlayerName extends React.Component {
  props: any
  lms: any
  render() {
    const player = new LocalMatchState(this.props.matchData).currentPlayer()
    const colorStyle = {
      color: player.color,
      padding: '10px'
    }

    return (
      <span style={ colorStyle }>
        { player.name }
      </span>
    )
  }
}

export default PlayerName
