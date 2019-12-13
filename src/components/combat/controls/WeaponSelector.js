import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { weaponSet } from '../../../redux'

const Weapon = (props) => {
  const thisId = 'weapon'
  const dispatch = useDispatch()

  const optionStyle = {
    background: 'black',
    color: 'white',
    fontSize: '24px',
    fontFamily: 'fantasy',
    fontVariant: 'small-caps'
  }

  const players = useSelector((state) => state.time.moveMe.players)
  const cars = useSelector((state) => state.cars)
  const getCurrentCar = () => {
    const playerColor = players.all[players.currentIndex].color
    const carColor = playerColor
    return cars.find(function (elem) { return elem.color === carColor })
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
    element.scrollIntoViewIfNeeded() // scrollIntoView();//{ block: 'center', inline: 'center' });
    element.scrollIntoView({ block: 'center', inline: 'center' })
  }

  const onChange = (event) => {
    var car = getCurrentCar()
    viewElement(car.id)
    dispatch(weaponSet({
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
