import React from 'react'
import { useSelector } from 'react-redux'

const Damage = () => {
//  const players = useSelector((state) => state.players)
  const players = useSelector((state) => state.time.moveMe.players)
  const cars = useSelector((state) => state.cars)
  const getCurrentCar = () => {
    const playerColor = players.all[players.currentIndex].color
    return cars.find(function (car) { return car.color === playerColor })
  }

  const getCurrentDamage = () => {
    const car = getCurrentCar()
    if (car.phasing.damageMarker != null && car.phasing.damageMessage != null) {
      return drawDamage({
        point: car.phasing.damageMarker.displayPoint,
        message: car.phasing.damageMessage
      })
    }
  }

  const damageStyle = {
    stroke: 'red',
    strokeWidth: '2',
    fill: 'none',
    fontSize: '26px',
    fontFamily: 'fantasy',
    fontVariant: 'small-caps'
  }

  const damageText = {
    fill: 'black',
    stroke: 'none',
    fontSize: '16px', // '26px',
    fontFamily: 'fantasy',
    fontVariant: 'small-caps'
  }

  const missText = {
    fill: 'red',
    stroke: 'none',
    fontSize: '16px',
    fontFamily: 'sans-serif'
  }

  const polylineStar = ({ x, y, pointCount, offset = 0, radiusMultiplier = 1 }) => {
    const inner = (radians) => {
      const radius = 10 + (Math.random() * 10)
      return `${x + radius * Math.cos(radians)},${y + radius * Math.sin(radians)} `
    }

    const outer = (radians) => {
      const radius = radiusMultiplier * (20 + (Math.random() * 20))
      return `${x + radius * Math.cos(radians)},${y + radius * Math.sin(radians)} `
    }

    var result = ''
    for (var i = 0; i < pointCount; i++) {
      var innerRads = 2 * Math.PI * (i / pointCount + offset)
      result += inner(innerRads)
      var outerRads = 2 * Math.PI * ((i + 0.5) / pointCount + offset)
      result += outer(outerRads)
    }
    result += inner(0)
    return result
  }

  const stopSign = ({ x, y, radius, text0, text1 = '' }) => {
    const stopSignStyle = {
      fill: 'red',
      stroke: 'white'
    }
    const stopSignTextStyle = {
      fill: 'white',
      stroke: 'none',
      fontSize: `${2 * radius / 3}px`, // '16px',
      fontFamily: 'fantasy',
      fontVariant: 'small-caps'
    }

    var points = ''
    var angle = 2 * Math.PI / 16
    for (var i = angle; i < 2 * Math.PI; i += 2 * angle) {
      points += `${x + radius * Math.cos(i)}, ${y + radius * Math.sin(i)} `
    }
    return (
      <g key={ `damage-${x}-${y}` } style={ stopSignStyle }>
        <polygon points={points}/>
        <text x ={ x } y={ y - radius / 5 } textAnchor={ 'middle' } style={ stopSignTextStyle }>{text0}</text>
        <text x ={ x } y={ y + 2 * radius / 5 } textAnchor={ 'middle' } style={ stopSignTextStyle }>{text1}</text>
      </g>
    )
  }

  const drawDamage = ({ point, message }) => {
    var offset = 2 * Math.PI / 10
    if (message === 'empty') {
      point = getCurrentCar().rect.center()
      return (
        stopSign({ x: point.x, y: point.y, radius: 25, text0: 'no', text1: 'ammo' })
      )
    } else if (message === 0) {
      return (
        <g key={ `damage-${point.x}-${point.y}` } style={ damageStyle }>
          <circle cx={ point.x } cy={ point.y } r={ 18 } fill={'white'} />
          <text x ={ point.x } y={ point.y + 4 } textAnchor={ 'middle' } style={ missText }>miss</text>
        </g>
      )
    } else {
      return (
        <g key={ `damage-${point.x}-${point.y}` } style={ damageStyle }>
          <polyline points={ `${polylineStar({ x: point.x, y: point.y, pointCount: 10, offset: 0.3 * offset, radiusMultiplier: 1.4 })}`} fill={'yellow'} />
          <polyline points={ `${polylineStar({ x: point.x, y: point.y, pointCount: 8, offset: offset })}`} fill={'red'} />
          <polyline points={ `${polylineStar({ x: point.x, y: point.y, pointCount: 8, radiusMultiplier: 0.8 })}`} fill={'orange'} />
          <circle cx={ point.x } cy={ point.y } r={ 18 } fill={'white'} />
          <text x ={ point.x } y={ point.y + 8 } textAnchor={ 'middle' } style={ damageText }>{message}</text>
        </g>
      )
    }
  }

  return (
    <g>
      { getCurrentDamage() }
    </g>
  )
}

export default Damage
