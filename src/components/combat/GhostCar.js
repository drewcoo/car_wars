import React from 'react'
import { useSelector } from 'react-redux'
import Car from './Car'
import FiringArc from './FiringArc'

const GhostCar = ({ matchId }) => {
  const match = useSelector((state) => state.matches[matchId])
  const players = match.time.moveMe.players
  const currentPlayer = players.all[players.currentIndex]
  const currentCarId = currentPlayer.cars[currentPlayer.currentCarIndex].id

  return (
    <g>
      <FiringArc matchId={ matchId } />
      <Car
        matchId={ matchId }
        id={ currentCarId }
        key='ghost'
        ghost={ true }
      />
    </g>
  )
}

export default GhostCar
