import React from 'react'
import Car from './Car'
import MapBackground from './MapBackground'
import GhostCar from './GhostCar'
import Walls from './Walls'

import FiringArc from './FiringArc'
import Damage from './Damage'
import Reticle from './Reticle'

import { useSelector } from 'react-redux'

import { MAP_SIZE } from '../maps/arena_map_1'

const ArenaMap = () => {
  const cars = useSelector((state) => state.cars)
  const players = useSelector((state) => state.players)

  const get_car_by_id = (id) => {
    return cars.find(function (elem) { return elem.id === id })
  }

  const get_current_car = () => {
    var player_color = players.all[players.current_index].color
    var car_color = player_color
    return cars.find(function (elem) { return elem.color === car_color })
  }

  return (
    <svg id='ArenaMap' width={ MAP_SIZE.WIDTH } height={ MAP_SIZE.HEIGHT } >
      <MapBackground />
      <Walls />
      {
        players.all.map((player) => (
          player.car_ids.map((id) => (
            <Car id={id} key={id} state={ get_car_by_id(id) } />
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
