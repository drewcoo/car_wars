import React from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { useDispatch } from 'react-redux'
// import { speedSet } from '../../../redux'

const MapSelector = (props) => {
  const thisId = 'mapSelector'
  //  const dispatch = useDispatch()

  const optionStyle = {
    background: 'black',
    color: 'white',
    fontSize: '40px',
    fontFamily: 'fantasy',
    fontVariant: 'small-caps'
  }

  // const nonSelectColor_override = {
  //  color: 'darkgray',
  // };
  /*
  const players = useSelector((state) => state.time.moveMe.players)
  const cars = useSelector((state) => state.cars)
  const getCurrentCar = () => {
    var playerColor = players.all[players.currentIndex].color
    var carColor = playerColor
    return cars.find(function (elem) { return elem.color === carColor })
  }
*/

  const onChange = (event) => {
    /*    dispatch(speedSet({
      id: getCurrentCar().id,
      speedChangeIndex: event.target.value
    }))
    */
    document.getElementById(thisId).blur()
  }

  const listMaps = () => {
    const allMaps = {
      'Area Map #1': 'areaMap1.js',
      'Duplicate of Area Map #1': 'areaMap2.js'
    }
    var result = []
    Object.entries(allMaps).forEach(pair => {
      result.push(
        <option key={pair[1]} value={pair[1]}>
          { pair[0] }
        </option>
      )
    })
    return result
  }

  // style={ optionStyle }

  return (
    <select
      id={ thisId }
      style={ optionStyle }
      onChange={onChange}
    >
      { listMaps() }
    </select>
  )
}

export default MapSelector
