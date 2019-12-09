import React from 'react'
import { HotKeys } from 'react-hotkeys'
import { useDispatch, useSelector } from 'react-redux'
import {
  maneuverSet, maneuverNext, maneuverPrevious,
  weaponNext, weaponPrevious,
  playerNext,
  ghostForward, ghostReset, ghostTurnBend, ghostMoveDrift, ghostTurnSwerve,
  ghostShowCollisions,
  ghostTargetNext, ghostTargetPrevious,
  ghostFire,
  acceptMove
} from '../../redux'

const KeystrokeInput = () => {
  const dispatch = useDispatch()
  const cars = useSelector((state) => state.cars)
  const players = useSelector((state) => state.players)

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
    next_target: 't',
    previous_target: 'shift+t',
    acceptMove: 'enter',
    turnLeft: ['z', 'shift+x'],
    turnRight: ['x', 'shift+z'],
    home: '.'
  }

  var viewCurrentCar = () => {
    var car = getCurrentCar()
    var element = document.getElementById(car.id)
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
      dispatch(ghostReset(car))
    } else {
      dispatch(ghostForward(car))
    }
    dispatch(ghostShowCollisions(car))
  }

  const turnRight = (fRight) => {
    var car = getCurrentCar()
    // viewCurrentCar();
    switch (currentManeuver(car)) {
      case 'forward':
        dispatch(maneuverSet({
          id: car.id,
          maneuverIndex: car.status.maneuvers.indexOf('bend')
        }))
        // fall through
      case 'bend':
        dispatch(ghostTurnBend({ car: car, degrees: (fRight ? 15 : -15) }))
        break
      case 'drift':
        dispatch(ghostMoveDrift({ car: car, direction: (fRight ? 'right' : 'left') }))
        break
      case 'swerve':
        dispatch(ghostTurnSwerve({ car: car, degrees: (fRight ? 15 : -15) }))
        break
      default:
        console.log(`maneuver: ${currentManeuver(car)}`)
        return
    }
    dispatch(ghostShowCollisions(car))
  }

  const handlers = {
    nextManeuver: (event) => {
      viewCurrentCar()
      var car = getCurrentCar()
      dispatch(maneuverNext(car))
      dispatch(ghostShowCollisions(car))
      showHideCar(car, 1)
    },
    previousManeuver: (event) => {
      var car = getCurrentCar()
      dispatch(maneuverPrevious(car))
      dispatch(ghostShowCollisions(car))
      showHideCar(car, -1)
    },
    nextWeapon: (event) => {
      dispatch(weaponNext(getCurrentCar()))
    },
    previousWeapon: (event) => {
      dispatch(weaponPrevious(getCurrentCar()))
    },
    next_target: (event) => {
      dispatch(ghostTargetNext(getCurrentCar()))
    },
    previous_target: (event) => {
      dispatch(ghostTargetPrevious(getCurrentCar()))
    },
    fireWeapon: (event) => {
      dispatch(ghostFire(getCurrentCar()))
    },
    acceptMove: (event) => {
      var car = getCurrentCar()
      var moved = (car.rect.brPoint().x !== car.phasing.rect.brPoint().x) ||
                  (car.rect.brPoint().y !== car.phasing.rect.brPoint().y)
      if (moved) {
        dispatch(acceptMove(car))
        dispatch(playerNext())
      }
    },
    turnRight: (event) => {
      turnRight(true)
    },
    turnLeft: (event) => {
      turnRight(false)
    },
    home: (event) => {
      viewCurrentCar()
      // console.log(`car id: ${car.id}`);
      // var element = document.getElementById(car.id);
      // element.scrollIntoView({block: 'center', inline: 'center'});
      dispatch(ghostReset(getCurrentCar()))
    }
  }

  return (
    <HotKeys
      attach={document}
      focused={true}
      handlers={handlers}
      keyMap={keyMap} />
  )
}

export default KeystrokeInput
