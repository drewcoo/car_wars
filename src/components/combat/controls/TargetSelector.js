import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ghostTargetSet } from '../../../redux'

const Target = (props) => {
  const thisId = 'target'
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
        const locString = `${car.phasing.targets[i].carId} ${car.phasing.targets[i].name} ${locType}`
        result.push(<option key={i} value={i}>{locString}</option>)
      }
    } else {
      console.assert(car.phasing.targetIndex === 0)
      result.push(<option key={ 'none' } value={' none' }>none</option>)
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
    dispatch(ghostTargetSet({
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
      value={ getCurrentCar().phasing.targetIndex }
      onChange={ onChange }>
      { listTargets() }
    </select>
  )
}

export default Target
