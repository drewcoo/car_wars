import React from 'react'
import { useSelector } from 'react-redux'

const PlayerName = () => {
  const players = useSelector((state) => state.players)
  const current_player = players.all[players.current_index]
  const color_style = {
    color: current_player.color,
    padding: '10px'
  }

  return (
    <span style={color_style}>
      {current_player.name}
    </span>
  )
}

export default PlayerName
