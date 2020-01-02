import React from 'react'
import { useSelector } from 'react-redux'

const CarInset = ({ matchId }) => {
  const players = useSelector((state) => state.matches[matchId].time.moveMe.players)
  const currentPlayer = players.all[players.currentIndex]

  // WORKS!!
  const cars = useSelector((state) => state.matches[matchId].cars)
  var car = cars.find(function (element) {
    return element.color === currentPlayer.color
  })

  const warnStyle = {
    color: 'yellow',
    visibility: (car.phasing.difficulty === 0) ? 'hidden' : 'visible'
  }

  return (
    <div>
      <span>{ car.design.attributes.size }</span><br/>
      <span>{ car.design.attributes.chassis } chassis</span><br/>
      <span>{ car.design.attributes.suspension } suspension</span><br/>
      <span>${ car.design.attributes.cost }</span><br/>
      <span>{ car.design.attributes.weight } lbs</span><br/><br/>
      <span>top speed: { car.design.attributes.topSpeed }</span><br/>
      <span>acc: { car.design.attributes.acceleration }</span><br/>
      <span>hc: { car.design.attributes.handlingClass }</span><br/><br/>
      <span>handling: { car.status.handling }</span><br/>
      <span style={ warnStyle }>D{ car.phasing.difficulty } maneuver</span><br/><br/>
      <span>SPEED: { car.status.speed }</span>
    </div>
  )
}

export default CarInset
