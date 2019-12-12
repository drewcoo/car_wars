import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { maneuverSet } from '../../redux'

const Maneuver = (props) => {
  const thisId = 'maneuver'

  const dispatch = useDispatch()

  const optionStyle = {
    background: 'black',
    color: 'white',
    fontSize: '24px',
    fontFamily: 'fantasy',
    fontVariant: 'small-caps'
  }

  const hiddenStyle = {
    visibility: 'hidden'
  }

  const players = useSelector((state) => state.time.moveMe.players)
  const cars = useSelector((state) => state.cars)
  const getCurrentCar = () => {
    var playerColor = players.all[players.currentIndex].color
    var carColor = playerColor
    return cars.find(function (elem) { return elem.color === carColor })
  }

  const onChange = (event) => {
    dispatch(maneuverSet({
      id: getCurrentCar().id,
      maneuverIndex: event.target.value
    }))
    document.getElementById(thisId).blur()
  }

  const listManeuvers = () => {
    const car = getCurrentCar()
    var result = []
    for (var i = 0; i < car.status.maneuvers.length; i++) {
      result.push(
        <option key={ i } value={ i }>
          { car.status.maneuvers[i] }
        </option>
      )
    }
    return result
  }

  return (
    <span>
      <select
        id={ thisId }
        style={ optionStyle }
        value={ getCurrentCar().phasing.maneuverIndex }
        onChange={ onChange }
      >
        { listManeuvers() }
      </select>
      <span>&nbsp;&nbsp;</span>
      <select id='degrees' style={ hiddenStyle } defaultValue='0'>
        <option>-1</option>
        <option>0</option>
        <option>1</option>
      </select>
    </span>
  )
}

export default Maneuver
