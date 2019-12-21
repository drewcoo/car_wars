import React from 'react'
import { HotKeys } from 'react-hotkeys'
import { useDispatch, useSelector } from 'react-redux'
import {
  maneuverSet, maneuverNext, maneuverPrevious,
  speedNext, speedPrevious,
  weaponNext, weaponPrevious,
  playerNext,
  ghostForward, ghostReset, ghostTurnBend, ghostMoveDrift, ghostTurnSwerve,
  ghostShowCollisions,
  ghostTargetNext, ghostTargetPrevious,
  ghostFire,
  acceptMove
} from '../../../redux'

const KeystrokeInput = () => {
  const dispatch = useDispatch()
  const cars = useSelector((state) => state.cars)
  const players = useSelector((state) => state.time.moveMe.players)

  const getCurrentCar = () => {
    var player = players.all[players.currentIndex]
    var id = player.carIds[player.currentCarIndex]
    return cars.find(function (elem) { return elem.id === id })
  }

  const keyMap = {
    fireWeapon: 'f',
    nextManeuver: 'm',
    previousManeuver: 'shift+m',
    nextWeapon: 'w',
    previousWeapon: 'shift+w',
    nextSpeed: 's',
    previousSpeed: 'shift+s',
    nextTarget: 't',
    previousTarget: 'shift+t',
    acceptMove: 'enter',
    turnLeft: ['z', 'shift+x'],
    turnRight: ['x', 'shift+z'],
    home: '.'
  }

  var viewElement = (id) => {
    var element = document.getElementById(id)
    if (!element) { return }
    element.scrollIntoViewIfNeeded() // scrollIntoView();//{ block: 'center', inline: 'center' });
    element.scrollIntoView({ block: 'center', inline: 'center' })
  }

  const currentManeuver = (car) => {
    return car.status.maneuvers[car.phasing.maneuverIndex]
  }

  const showHideCar = (car, manIdxDelta) => {
    var index = (car.phasing.maneuverIndex + manIdxDelta) %
                 car.status.maneuvers.length
    if (car.status.maneuvers[index] === 'none') {
      dispatch(ghostReset({ id: car.id }))
    } else {
      dispatch(ghostForward({ id: car.id }))
    }
    dispatch(ghostShowCollisions({ id: car.id }))
  }

  const turnRight = (fRight) => {
    var car = getCurrentCar()
    switch (currentManeuver(car)) {
      case 'forward':
        dispatch(maneuverSet({
          id: car.id,
          maneuverIndex: car.status.maneuvers.indexOf('bend')
        }))
        // Make it easy to maneuver (bend from forward position) as long as that's possible.
        if (!car.status.maneuvers.includes('bend')) { break }
        // fall through
      case 'bend':
        dispatch(ghostTurnBend({ id: car.id, degrees: (fRight ? 15 : -15) }))
        break
      case 'drift':
        dispatch(ghostMoveDrift({ id: car.id, direction: (fRight ? 'right' : 'left') }))
        break
      case 'swerve':
        dispatch(ghostTurnSwerve({ id: car.id, degrees: (fRight ? 15 : -15) }))
        break
      default:
        console.log(`maneuver: ${currentManeuver(car)}`)
        return
    }
    dispatch(ghostShowCollisions({ id: car.id }))
  }

  const handlers = {
    nextManeuver: (event) => {
      var car = getCurrentCar()
      viewElement(car.id)
      dispatch(maneuverNext({ id: car.id }))
      dispatch(ghostShowCollisions({ id: car.id }))
      showHideCar(car, 1)
    },
    previousManeuver: (event) => {
      var car = getCurrentCar()
      viewElement(car.id)
      dispatch(maneuverPrevious({ id: car.id }))
      dispatch(ghostShowCollisions({ id: car.id }))
      showHideCar(car, -1)
    },
    nextSpeed: (event) => {
      var car = getCurrentCar()
      viewElement(car.id)
      dispatch(speedNext({ id: car.id }))
    },
    previousSpeed: (event) => {
      var car = getCurrentCar()
      viewElement(car.id)
      dispatch(speedPrevious({ id: car.id }))
    },
    nextWeapon: (event) => {
      var car = getCurrentCar()
      viewElement(car.id)
      dispatch(weaponNext({ id: car.id }))
      viewElement('reticle')
    },
    previousWeapon: (event) => {
      var car = getCurrentCar()
      viewElement(car.id)
      dispatch(weaponPrevious({ id: car.id }))
      viewElement('reticle')
    },
    nextTarget: (event) => {
      dispatch(ghostTargetNext({ id: getCurrentCar().id }))
      viewElement('reticle')
    },
    previousTarget: (event) => {
      dispatch(ghostTargetPrevious({ id: getCurrentCar().id }))
      viewElement('reticle')
    },
    fireWeapon: (event) => {
      viewElement('reticle')
      dispatch(ghostFire({ id: getCurrentCar().id }))
    },
    acceptMove: (event) => {
      var car = getCurrentCar()
      var moved = (car.rect.brPoint().x !== car.phasing.rect.brPoint().x) ||
                  (car.rect.brPoint().y !== car.phasing.rect.brPoint().y)
      if (moved) {
        dispatch(acceptMove({ id: car.id }))
        dispatch(playerNext())
        viewElement('ghost')
      }
    },
    turnRight: (event) => {
      viewElement(getCurrentCar().id)
      turnRight(true)
    },
    turnLeft: (event) => {
      viewElement(getCurrentCar().id)
      turnRight(false)
    },
    home: (event) => {
      var car = getCurrentCar()
      viewElement(car.id)
      dispatch(ghostReset({ id: car.id }))
    }
  }

  return (
    <HotKeys
      attach={ document }
      focused={ true }
      handlers={ handlers }
      keyMap={ keyMap } />
  )
}

export default KeystrokeInput
