import React from 'react'
import { FACE, INCH } from '../../utils/constants'
import '../../App.css'
import LocalMatchState from './lib/LocalMatchState'
import Reticle from './Reticle'

class FiringArc extends React.Component {
  sides({ inches = 0 }) {
    const lms = new LocalMatchState(this.props.matchData)
    const arcFacing = lms.currentWeapon().location
    const rect = lms.currentCar().phasing.rect

    let left = null
    let right = null
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

  fill() {
    const arcRayLen = 50 * INCH
    const rect = new LocalMatchState(this.props.matchData).currentCar().phasing.rect
    const computedSides = this.sides({ inches: arcRayLen })
    if (computedSides === null) { return }
    return (
      <path className='FiringArcFill'
        d={ `M${computedSides.left.x},
              ${computedSides.left.y}
             A${arcRayLen},
              ${arcRayLen} 0 0,
              0 ${computedSides.right.x},
              ${computedSides.right.y}
             L${rect.center().x},
              ${rect.center().y}
             L${computedSides.left.x},
              ${computedSides.left.y}` }
      />
    )
  }

  graduationTextLoc({ inches }) {
    const rect = new LocalMatchState(this.props.matchData).currentCar().phasing.rect
    return rect.center().move({ degrees: this.sides({}).facing, distance: inches * INCH })
  }

  // Change this to show the +4 inside the 1" arc?
  graduation({ label, inches }) {
    const computedSides = this.sides({ inches })
    return (
      <g key={ `arc-${inches}-in` }>
        <path className='FiringArcGraduation'
          d={ `M${computedSides.left.x},
                ${computedSides.left.y}
               A${inches * INCH},
                ${inches * INCH} 0 0,
                0 ${computedSides.right.x},
                ${computedSides.right.y}` }
        />
      <text className='FiringArcGraduationText'
          x={ this.graduationTextLoc({ inches }).x }
          y={ this.graduationTextLoc({ inches }).y }
        >
          { label }
        </text>
      </g>
    )
  }

  graduationIncrements() {
    function arcFacingDistanceMod(arcFacing) {
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
    const weapon = new LocalMatchState(this.props.matchData).currentWeapon()
    var result = {}
    for (var i = 1; i < 12; i++) {
      result[arcFacingDistanceMod(weapon.location) + 4 * i] = -i
    }
    result[arcFacingDistanceMod(weapon.location) + 1] = '+4'
    return result
  }

  draw() {
    const lms = new LocalMatchState(this.props.matchData)
    if (!lms.canFire()) { return }

    if (this.sides({}) === null) { return }

    const increments = this.graduationIncrements()

    return (
      <g key={ `${lms.currentCarId()}-arc` }>
        { this.fill() }
        { Object.keys(increments).map(key => {
            return this.graduation({ label: increments[key], inches: key })
          })
        }
      </g>
    )
  }

  render() {
    return (
      <g>
        { this.draw() }
        <Reticle client={this.props.client} matchData={ this.props.matchData } />
      </g>
    )
  }
}

export default FiringArc
