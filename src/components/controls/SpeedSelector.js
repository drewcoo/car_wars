import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { speedSet } from '../../redux'

const Speed = (props) => {
  const thisId = 'speed'
  const dispatch = useDispatch()

  const optionStyle = {
    background: 'black',
    color: 'white',
    fontSize: '24px',
    fontFamily: 'fantasy',
    fontVariant: 'small-caps'
  }

  // const nonSelectColor_override = {
  //  color: 'darkgray',
  // };

  const players = useSelector((state) => state.time.moveMe.players)
  const cars = useSelector((state) => state.cars)
  const getCurrentCar = () => {
    var playerColor = players.all[players.currentIndex].color
    var carColor = playerColor
    return cars.find(function (elem) { return elem.color === carColor })
  }

  const onChange = (event) => {
    dispatch(speedSet({
      id: getCurrentCar().id,
      speedChangeIndex: event.target.value
    }))
    document.getElementById(thisId).blur()
  }

  const listSpeedChanges = () => {
    const car = getCurrentCar()
    var result = []
    for (var i = 0; i < car.phasing.speedChanges.length; i++) {
      result.push(
        <option key={i} value={i}>
          { car.phasing.speedChanges[i] }
        </option>
      )
    }
    return result
  }

  return (
    <select
      id={ thisId }
      style={ optionStyle }
      value={ getCurrentCar().phasing.speedChangeIndex }

      onChange={onChange}>
      { listSpeedChanges() }
    </select>
  )
}

export default Speed
