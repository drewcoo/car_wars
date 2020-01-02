import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { weaponSet } from '../../../redux'

const Weapon = ({ matchId }) => {
  const thisId = 'weapon'
  const dispatch = useDispatch()

  const optionStyle = {
    background: 'black',
    color: 'white',
    fontSize: '24px',
    fontFamily: 'fantasy',
    fontVariant: 'small-caps'
  }

  const match = useSelector((state) => state.matches[matchId])
  const players = match.time.moveMe.players
  const cars = match.cars

  const currentPlayer = players.all[players.currentIndex]
  const currentCarId = currentPlayer.cars[currentPlayer.currentCarIndex].id

  const getCar = (id) => {
    return cars.find(function (elem) { return elem.id === id })
  }

  const getCurrentCar = () => {
    return getCar(currentCarId)
  }

  const weapons = getCurrentCar().design.components.weapons

  const listWeapons = () => {
    var result = []
    for (var i = 0; i < weapons.length; i++) {
      result.push(<option key={i} value={i}>{weapons[i].abbreviation} - {weapons[i].location}</option>)
    }
    return result
  }

  var viewElement = (id) => {
    console.log(`getting element: ${id}`)
    var element = document.getElementById(id)
    if (!element) { return }
    element.scrollIntoView()
    element.scrollIntoView({ block: 'center', inline: 'center' })
  }

  const onChange = (event) => {
    var car = getCurrentCar()
    viewElement(car.id)
    dispatch(weaponSet({
      matchId: matchId,
      id: car.id,
      weapon: event.target.value
    }))
    // BUGBUG - timing makes this focus-setting fail.
    // viewElement('reticle')

    // release focus so we can pick up keyoard input again
    document.getElementById(thisId).blur()
  }

  return (
    <select
      id={ thisId }
      style={ optionStyle }
      value={ getCurrentCar().phasing.weaponIndex }
      onChange={ onChange }
    >
      { listWeapons() }
    </select>
  )
}

export default Weapon
