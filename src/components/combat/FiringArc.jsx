import React from 'react'
import {connect} from "react-redux"
import MatchWrapper from '../../utils/wrappers/MatchWrapper'
import { FACE, INCH } from '../../utils/constants'
import '../../App.css'

const mapStateToProps = (state) => {
  return({ matches: state.matches })
}

class FiringArc extends React.Component {
  // props.matchId

  sides({ match, inches = 0 }) {
    const arcFacing = match.currentCar().currentWeapon().location
    const rect = match.currentCar().phasing.rect

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

  fill({ match }) {
    const arcRayLen = 50 * INCH
    const rect = match.currentCar().phasing.rect
    const computedSides = this.sides({ match, inches: arcRayLen })
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

  graduationTextLoc({ match, inches }) {
    const rect = match.currentCar().phasing.rect
    return rect.center().move({ degrees: this.sides({ match }).facing, distance: inches * INCH })
  }

  // Change this to show the +4 inside the 1" arc?
  graduation({ match, label, inches }) {
    const computedSides = this.sides({ match, inches })
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
          x={ this.graduationTextLoc({ match, inches }).x }
          y={ this.graduationTextLoc({ match, inches }).y }
        >
          { label }
        </text>
      </g>
    )
  }

  graduationIncrements({ match }) {
    function arcFacingDistanceMod() {
      const arcFacing = match.currentCar().currentWeapon().location
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
    var result = {}
    for (var i = 1; i < 12; i++) {
      result[arcFacingDistanceMod() + 4 * i] = -i
    }
    result[arcFacingDistanceMod() + 1] = '+4'
    return result
  }

  draw({ match }) {
    if (!match.currentCar().currentWeapon().canFire()) { return }
    if (this.sides({ match }) === null) { return }

    const increments = this.graduationIncrements({ match })

    return (
      <g key={ `${match.currentCarId()}-arc` }>
        { this.fill({ match }) }
        { Object.keys(increments).map(key => {
            return this.graduation({ match, label: increments[key], inches: key })
          })
        }
      </g>
    )
  }

  render() {
    const match = new MatchWrapper({ match: this.props.matches[this.props.matchId] })
    return (
      <g>
        { this.draw({ match }) }
      </g>
    )
  }
}

export default connect(mapStateToProps)(FiringArc)
