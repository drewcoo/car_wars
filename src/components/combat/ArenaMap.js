import React from 'react'
import Car from './Car'
import MapBackground from './MapBackground'
import GhostCar from './GhostCar'
import Walls from './Walls'

import Damage from './Damage'
import Reticle from './Reticle'

import { useSelector } from 'react-redux'

import { MAP_SIZE } from '../../maps/arenaMap1'

const ArenaMap = () => {
  const cars = useSelector((state) => state.cars)
  const players = useSelector((state) => state.time.moveMe.players)
  const getCarById = (id) => {
    return cars.find(function (elem) { return elem.id === id })
  }

  return (
    <svg id='ArenaMap' width={ MAP_SIZE.WIDTH } height={ MAP_SIZE.HEIGHT } >
      <MapBackground />
      <Walls />
      {
        players.all.map((player) => (
          player.carIds.map((id) => (
            <Car id={id} key={id} state={ getCarById(id) } />
          ))
        ))
      }
      <GhostCar />
      <Reticle />
      <Damage />
    </svg>
  )
}

export default ArenaMap
