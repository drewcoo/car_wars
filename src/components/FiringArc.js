import React from 'react'
import { useSelector } from 'react-redux'
import CrewMember from '../reducers/lib/CrewMember'
import Weapon from '../reducers/lib/Weapon'

import { FACE, INCH } from '../utils/constants'

const FiringArc = () => {
  const players = useSelector((state) => state.players)
  const cars = useSelector((state) => state.cars)
  const getCurrentCar = () => {
    const playerColor = players.all[players.currentIndex].color
    return cars.find(function (car) { return car.color === playerColor })
  }

  const car = getCurrentCar()
  const currentWeapon = car.design.components.weapons[car.phasing.weaponIndex]
  const currentCrewMember = car.design.components.crew.driver

  const drawArc = () => {
    if (!(Weapon.canFire(currentWeapon) &&
           CrewMember.canFire(currentCrewMember))) { return }
    const arcFacing = currentWeapon.location

    const rect = car.phasing.rect
    const arcRayLen = 50 * INCH

    const arcSides = (inches) => {
      var left = null
      var right = null
      switch (arcFacing) {
        // Could do all of these with rect flAngle, frAngle, brAngle, and blAngle
        case 'F':
        case 'B':
          left = rect.center().move({
            degrees: rect.facing + FACE[arcFacing] + 30,
            distance: inches * INCH
          })
          right = rect.center().move({
            degrees: rect.facing + FACE[arcFacing] - 30,
            distance: inches * INCH
          })
          break
        case 'L':
        case 'R':
          left = rect.center().move({
            degrees: rect.facing + FACE[arcFacing] + 60,
            distance: inches * INCH
          })
          right = rect.center().move({
            degrees: rect.facing + FACE[arcFacing] - 60,
            distance: inches * INCH
          })
          break
        case 'none':
          return null
        default:
          throw Error(`ERROR: UNKNOWN ${arcFacing}`)
      }
      return ({
        facing: rect.facing + FACE[arcFacing],
        left: left,
        right: right
      })
    }

    if (arcSides() === null) { return }

    const textLoc = (inches) => {
      return rect.center().move({ degrees: arcSides().facing, distance: inches * INCH })
    }

    const arcFill = () => {
      const sides = arcSides(arcRayLen)
      if (sides === null) { return }
      return (
        <path
          d={`M${arcSides(arcRayLen).left.x},${arcSides(arcRayLen).left.y}
              A${arcRayLen},${arcRayLen} 0 0,0 ${arcSides(arcRayLen).right.x},${arcSides(arcRayLen).right.y}
              L${rect.center().x},${rect.center().y}
              L${arcSides(arcRayLen).left.x},${arcSides(arcRayLen).left.y}`}
          style={ filledArcStyle }
        />
      )
    }

    // Change this to show the +4 inside the 1" arc?
    const arcAtInches = ({ label, inches }) => {
      return (
        <g key={`arc-${inches}-in`}>
          <path
            d={`M${arcSides(inches).left.x},${arcSides(inches).left.y}
              A${inches * INCH},${inches * INCH} 0 0,0 ${arcSides(inches).right.x},${arcSides(inches).right.y}`}
            style={ arcStyle }
          />
          <text
            x={textLoc(inches).x}
            y={textLoc(inches).y}
            style= { arcTextStyle }
          >
            { label }
          </text>
        </g>
      )
    }

    const arcFacingDistanceMod = () => {
      switch (arcFacing) {
        case 'F':
        case 'B':
          return 0.5
        case 'L':
        case 'R':
          return 0.25
        default:
          return 0
      }
    }

    const arcIncrements = () => {
      var result = {}
      result[arcFacingDistanceMod() + 1] = '+4'
      var modifier = 0
      for (var i = arcFacingDistanceMod() + 4; i < 50; i += 4) {
        result[i] = --modifier
      }
      return result
    }

    return (
      <g key={`${getCurrentCar().id}-arc`}>
        { arcFill() }
        { Object.keys(arcIncrements()).map(function (key) {
          return arcAtInches({ label: arcIncrements()[key], inches: key })
        })
        }
      </g>
    )
  }

  const filledArcStyle = {
    fill: 'yellow',
    //  stroke: 'orange',
    //  strokeWidth: 5,
    opacity: 0.20
  }

  const arcStyle = {
    fill: 'none',
    stroke: 'red',
    // strokeWidth: 5,
    opacity: 0.8
  }

  const arcTextStyle = {
    fill: 'red',
    fontSize: '16px',
    fontFamily: 'fantasy',
    fontVariant: 'small-caps',
    opacity: 1
  }

  return (
    <g>
      { drawArc() }
    </g>
  )
}

export default FiringArc
