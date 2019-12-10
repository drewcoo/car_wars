import React from 'react'
import Car from './Car'
import { useSelector } from 'react-redux'
import FiringArc from './FiringArc'

const GhostCar = () => {
//  const players = useSelector((state) => state.players)
  const players = useSelector((state) => state.time.moveMe.players)
  const cars = useSelector((state) => state.cars)
  const getCurrentCar = () => {
    const playerColor = players.all[players.currentIndex].color
    return cars.find(function (car) { return car.color === playerColor })
  }

  return (
    <g>
      <FiringArc />
      <Car id='ghost' key='ghost' state={ getCurrentCar() } ghost={ true } />
    </g>
  )
}

export default GhostCar
