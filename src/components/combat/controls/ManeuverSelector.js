import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { maneuverSet, ghostForward, ghostReset, ghostShowCollisions } from '../../../redux'

const Maneuver = ({ matchId }) => {
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

  const match = useSelector((state) => state.matches[matchId])
  const players = match.time.moveMe.players
  const cars = match.cars
  const currentPlayer = players.all[players.currentIndex]
  const currentCarId = currentPlayer.cars[currentPlayer.currentCarIndex].id

  const getCurrentCar = () => {
    return cars.find(function (elem) { return elem.id === currentCarId })
  }

  var viewElement = (id) => {
    var element = document.getElementById(id)
    if (!element) { return }
    element.scrollIntoView()
    element.scrollIntoView({ block: 'center', inline: 'center' })
  }

  const onChange = (event) => {
    viewElement(currentCarId)
    dispatch(maneuverSet({
      matchId: matchId,
      id: currentCarId,
      maneuverIndex: event.target.value
    }))

    // argh - the index here is a stringified number
    if (event.target.value === '0') {
      console.log('RESET!!!!')
      dispatch(ghostReset({ matchId: matchId, id: currentCarId }))
    } else {
      dispatch(ghostForward({ matchId: matchId, id: currentCarId }))
    }
    dispatch(ghostShowCollisions({ matchId: matchId, id: currentCarId }))
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
