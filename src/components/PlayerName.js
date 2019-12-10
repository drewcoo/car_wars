import React from 'react'
import { useSelector } from 'react-redux'

const PlayerName = () => {
  const players = useSelector((state) => state.time.moveMe.players)
  const currentPlayer = players.all[players.currentIndex]
  const colorStyle = {
    color: currentPlayer.color,
    padding: '10px'
  }

  return (
    <span style={ colorStyle }>
      { currentPlayer.name }
    </span>
  )
}

export default PlayerName
