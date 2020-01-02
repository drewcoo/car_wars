import React from 'react'
import { HotKeys } from 'react-hotkeys'
import { useDispatch, useSelector } from 'react-redux'
import {
  maneuverSet, maneuverNext, maneuverPrevious,
  speedNext, speedPrevious,
  weaponNext, weaponPrevious,
  ghostForward, ghostReset, ghostTurnBend, ghostMoveDrift, ghostTurnSwerve,
  ghostShowCollisions,
  ghostTargetNext, ghostTargetPrevious,
  fireWeapon,
  acceptMove
} from '../../../redux'

const KeystrokeInput = ({ matchId }) => {
  const dispatch = useDispatch()
  const match = useSelector((state) => state.matches[matchId])
  const cars = match.cars
  const players = match.time.moveMe.players
  const currentPlayer = players.all[players.currentIndex]
  const currentCarId = currentPlayer.cars[currentPlayer.currentCarIndex].id

  const getCar = (id) => {
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
    element.scrollIntoView()
    element.scrollIntoView({ block: 'center', inline: 'center' })
  }

  const currentManeuver = (car) => {
    return car.status.maneuvers[car.phasing.maneuverIndex]
  }

  const showHideCar = (car, manIdxDelta) => {
    var index = (car.phasing.maneuverIndex + manIdxDelta) %
                 car.status.maneuvers.length
    if (car.status.maneuvers[index] === 'none') {
      dispatch(ghostReset({ matchId: matchId, id: car.id }))
    } else {
      dispatch(ghostForward({ matchId: matchId, id: car.id }))
    }
    dispatch(ghostShowCollisions({ matchId: matchId, id: car.id }))
  }

  const turnRight = (fRight) => {
    var car = getCar(currentCarId)
    switch (currentManeuver(car)) {
      case 'forward':
        dispatch(maneuverSet({
          matchId: matchId,
          id: currentCarId,
          maneuverIndex: car.status.maneuvers.indexOf('bend')
        }))
        // Make it easy to maneuver (bend from forward position) as long as that's possible.
        if (!car.status.maneuvers.includes('bend')) { break }
        // fall through
      case 'bend':
        dispatch(ghostTurnBend({ matchId: matchId, id: currentCarId, degrees: (fRight ? 15 : -15) }))
        break
      case 'drift':
        dispatch(ghostMoveDrift({ matchId: matchId, id: currentCarId, direction: (fRight ? 'right' : 'left') }))
        break
      case 'swerve':
        dispatch(ghostTurnSwerve({ matchId: matchId, id: currentCarId, degrees: (fRight ? 15 : -15) }))
        break
      default:
        console.log(`maneuver: ${currentManeuver(car)}`)
        return
    }
    dispatch(ghostShowCollisions({ matchId: matchId, id: car.id }))
  }

  const handlers = {
    nextManeuver: (event) => {
      var car = getCar(currentCarId)
      viewElement(currentCarId)
      dispatch(maneuverNext({ matchId: matchId, id: currentCarId }))
      dispatch(ghostShowCollisions({ matchId: matchId, id: currentCarId }))
      showHideCar(car, 1)
    },
    previousManeuver: (event) => {
      var car = getCar(currentCarId)
      viewElement(currentCarId)
      dispatch(maneuverPrevious({ matchId: matchId, id: currentCarId }))
      dispatch(ghostShowCollisions({ matchId: matchId, id: currentCarId }))
      showHideCar(car, -1)
    },
    nextSpeed: (event) => {
      viewElement(currentCarId)
      dispatch(speedNext({ matchId: matchId, id: currentCarId }))
    },
    previousSpeed: (event) => {
      viewElement(currentCarId)
      dispatch(speedPrevious({ matchId: matchId, id: currentCarId }))
    },
    nextWeapon: (event) => {
      viewElement(currentCarId)
      dispatch(weaponNext({ matchId: matchId, id: currentCarId }))
      viewElement('reticle')
    },
    previousWeapon: (event) => {
      viewElement(currentCarId)
      dispatch(weaponPrevious({ matchId: matchId, id: currentCarId }))
      viewElement('reticle')
    },
    nextTarget: (event) => {
      dispatch(ghostTargetNext({ matchId: matchId, id: currentCarId }))
      viewElement('reticle')
    },
    previousTarget: (event) => {
      dispatch(ghostTargetPrevious({ matchId: matchId, id: currentCarId }))
      viewElement('reticle')
    },
    fireWeapon: (event) => {
      viewElement('reticle')
      dispatch(fireWeapon({ matchId: matchId, id: currentCarId }))
    },
    acceptMove: (event) => {
      var car = getCar(currentCarId)
      var moved = (car.rect.brPoint().x !== car.phasing.rect.brPoint().x) ||
                  (car.rect.brPoint().y !== car.phasing.rect.brPoint().y)
      if (moved) {
        dispatch(acceptMove({ matchId: matchId, id: currentCarId }))
        viewElement('ghost')
      }
    },
    turnRight: (event) => {
      viewElement(currentCarId)
      turnRight(true)
    },
    turnLeft: (event) => {
      viewElement(currentCarId)
      turnRight(false)
    },
    home: (event) => {
      viewElement(currentCarId)
      dispatch(ghostReset({ matchId: matchId, id: currentCarId }))
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
