import React from 'react'
import { useSelector } from 'react-redux'

import Car from './Car'
import Damage from './Damage'
import GhostCar from './GhostCar'
import MapBackground from './MapBackground'
import Reticle from './Reticle'
import Walls from './Walls'

const ArenaMap = ({ matchId }) => {
  const match = useSelector((state) => state.matches[matchId])
  const size = match.map.size
  const players = match.time.moveMe.players

  return (
    <svg id='ArenaMap' width={ size.width } height={ size.height } >
      <MapBackground matchId={ matchId } />
      <Walls matchId={ matchId } />
      {
        players.all.map((player) => (
          player.cars.map((car) => (
            <Car key={ car.id } matchId={ matchId } id={ car.id } />
          ))
        ))
      }
      <GhostCar matchId={ matchId } />
      <Reticle matchId={ matchId } />
      <Damage matchId={ matchId } />
    </svg>
  )
}

export default ArenaMap
