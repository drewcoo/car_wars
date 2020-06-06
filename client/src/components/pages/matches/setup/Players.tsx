import React from 'react'
import '../../../../App.css'
import Player from './Player'

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  players: any[string]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  designs: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleCarNameChange: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleColorChange: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleDesignChange: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handlePlayerNameChange: any
}

class Players extends React.Component<Props> {
  listStarted: boolean
  constructor(props: Props) {
    super(props)
    this.listStarted = false
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  startList(): boolean {
    if (this.listStarted) {
      return false
    }
    this.listStarted = true
    return true
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addPlayerToForm(player: any): React.ReactNode {
    console.log(this.props.designs)
    return (
      <Player
        autoFocus={this.startList()}
        designs={this.props.designs}
        handleCarNameChange={this.props.handleCarNameChange}
        handleColorChange={this.props.handleColorChange}
        handleDesignChange={this.props.handleDesignChange}
        handlePlayerNameChange={this.props.handlePlayerNameChange}
        key={player.id}
        player={player}
      />
    )
  }

  render(): React.ReactNode {
    return (
      <div style={{ columns: 2 }}>
        {Object.keys(this.props.players).map((playerId) => this.addPlayerToForm(this.props.players[playerId]))}
      </div>
    )
  }
}

export default Players
