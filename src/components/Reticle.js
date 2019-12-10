import React from 'react'
import { useSelector } from 'react-redux'
import { INCH } from '../utils/constants'

const Reticle = ({ color = 'red', x = 160, y = 160 }) => {
  const players = useSelector((state) => state.time.moveMe.players)
  const cars = useSelector((state) => state.cars)
  const getCurrentCar = () => {
    const playerColor = players.all[players.currentIndex].color
    return cars.find(function (car) { return car.color === playerColor })
  }

  const getCurrentTarget = () => {
    const car = getCurrentCar()

    if (car.phasing.damageMarker != null && car.phasing.damageMessage != null) {
      return
    }

    if (car.phasing.targets && car.phasing.targets[car.phasing.targetIndex]) {
      var target = car.phasing.targets[car.phasing.targetIndex]

      /// TODO: This for real instead of just show.
      // including things like not in target's firing arc, speed mods,
      // handling, sustained fire, etc.
      console.log('car.phasing.targets[car.phasing.targetIndex]')
      console.log(car.phasing.targets[car.phasing.targetIndex])
      var prettyName = (target.name.length === 2) ? ' tire' : ''
      var mod = (target.name === 'F' || target.name === 'B') ? -1 : 0

      // BUGBUG: middle is wrong.
      //  var targetPoint = car.phasing.rect.side(target.name) instanceof Point ?
      //    car.phasing.rect.side(target.name).displayPoint :
      console.log('spew')
      console.log(car.phasing.weaponIndex)
      console.log(car.design.components.weapons[car.phasing.weaponIndex])
      console.log(car.design.components.weapons[car.phasing.weaponIndex].location)
      var currentWeaponLocation = car.design.components.weapons[car.phasing.weaponIndex].location

      var dist = car.phasing.rect.side(currentWeaponLocation).middle().distanceTo(target.displayPoint)
      if (dist <= INCH) {
        mod += 4
      } else {
        mod -= Math.floor(dist / (4 * INCH))
      }

      // two-letter loc is a tire - doesn't take into account facing - FR always R
      if (target.name.length === 2) { mod -= 3 }

      return drawReticle({
        x: target.displayPoint.x,
        y: target.displayPoint.y,
        name: `${mod > 0 ? '+' : ''}${mod}${prettyName}`
      })
    }
  }

  const reticleStyle = {
    stroke: 'red',
    strokeWidth: '2',
    fill: 'none',
    fontSize: '26px',
    fontFamily: 'fantasy',
    fontVariant: 'small-caps'
  }

  const reticleText = {
    fill: 'red',
    stroke: 'none',
    fontSize: '26px',
    fontFamily: 'fantasy',
    fontVariant: 'small-caps'
  }

  const drawReticle = ({ x, y, name = '' }) => {
    console.log(`X: ${x}, Y: ${y}, Name: ${name}`)
    return (
      <g key={ `target-${x}=${y}` } style={ reticleStyle }>
        <text x ={ x + 12 } y={ y - 12 } style={ reticleText }>{ name }</text>
        <circle id='reticle' cx={ x } cy={ y } r={ 12 } />
        <circle cx={ x } cy={ y } r={ 7 } />
        <circle cx={ x } cy={ y } r={ 2 } />
        <line x1={ x - 17 } y1={ y } x2={ x + 17 } y2={ y } />
        <line x1={ x } y1={ y - 17 } x2={ x } y2={ y + 17 } />
      </g>
    )
  }

  return (
    <g>
      { getCurrentTarget() }
    </g>
  )
}

export default Reticle
