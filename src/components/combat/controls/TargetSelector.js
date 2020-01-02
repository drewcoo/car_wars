import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ghostTargetSet } from '../../../redux'

const Target = ({ matchId }) => {
  const thisId = 'target'
  const dispatch = useDispatch()

  const optionStyle = {
    background: 'black',
    color: 'white',
    fontSize: '24px',
    fontFamily: 'fantasy',
    fontVariant: 'small-caps'
  }

  const players = useSelector((state) => state.matches[matchId].time.moveMe.players)
  const cars = useSelector((state) => state.matches[matchId].cars)
  const getCarById = (id) => {
    return cars.find(function (elem) { return elem.id === id })
  }
  const getCurrentCar = () => {
    var playerColor = players.all[players.currentIndex].color
    var carColor = playerColor
    return cars.find(function (elem) { return elem.color === carColor })
  }

  const listTargets = () => {
    const car = getCurrentCar()
    var result = []
    if (car.phasing.targets.length > 0) {
      for (var i = 0; i < car.phasing.targets.length; i++) {
        const locType = (car.phasing.targets[i].name.length === 1) ? 'side' : 'tire'
        const shootThatCar = getCarById(car.phasing.targets[i].carId)
        const locString = `${shootThatCar.name} ${car.phasing.targets[i].name} ${locType}`
        result.push(<option key={i} value={i}>{ locString }</option>)
      }
    } else {
      console.assert(car.phasing.targetIndex === 0)
      result.push(<option key={ 'none' } value={' none' }>none</option>)
    }
    return result
  }

  const targetValue = () => {
    return getCurrentCar().phasing.targetIndex || 0
  }

  var viewElement = (id) => {
    var element = document.getElementById(id)
    if (!element) { return }
    element.scrollIntoView()
    element.scrollIntoView({ block: 'center', inline: 'center' })
  }

  const onChange = (event) => {
    dispatch(ghostTargetSet({
      matchId: matchId,
      id: getCurrentCar().id,
      targetIndex: event.target.value
    }))
    viewElement('reticle')
    // release focus so we can pick up keyoard input again
    document.getElementById(thisId).blur()
  }

  return (
    <select
      id={ thisId }
      style={ optionStyle }
      value={ targetValue() }
      onChange={ onChange }>
      { listTargets() }
    </select>
  )
}

export default Target
