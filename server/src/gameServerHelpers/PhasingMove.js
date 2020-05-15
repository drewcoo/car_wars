import { FACE, INCH } from '../utils/constants'
import { degreesDifference } from '../utils/conversions'
import Log from '../utils/Log'
import Control from './Control'
import VehicleStatusHelper from './VehicleStatusHelper'
import Rectangle from '../utils/geometry/Rectangle'

class PhasingMove {
  static bend({ car, degrees }) {
    // how far already?
    const currentFacingDelta = degreesDifference({
      initial: car.rect.facing,
      second: car.phasing.rect.facing,
    })
    const desiredFacing = currentFacingDelta + degrees

    // if already + delta too big, return
    // Can't turn more than 90 deg.
    if (Math.abs(desiredFacing) > 90) {
      return car.phasing.rect
    }

    // calculate change from a straight move and do it
    const facingRight = currentFacingDelta > 0
    const facingLeft = currentFacingDelta < 0
    const turningRight = degrees > 0

    let resultRect = PhasingMove.straight({ car: PhasingMove.center({ car }) })

    if (turningRight) {
      if (!facingLeft) {
        resultRect = resultRect.backRightCornerPivot(desiredFacing)
      } /* facing left */ else {
        resultRect = resultRect.backLeftCornerPivot(desiredFacing)
      }
    } /* turning left */ else {
      if (!facingRight) {
        resultRect = resultRect.backLeftCornerPivot(desiredFacing)
      } /* facing right */ else {
        resultRect = resultRect.backRightCornerPivot(desiredFacing)
      }
    }

    car.phasing.difficulty = Math.ceil(
      Math.abs(resultRect.facing - car.rect.facing) / 15,
    )

    return resultRect
  }

  //
  // What if I have car.rect show the current car location,
  // center (renamed?) always show the fishtail/skid/etc.-effect next position?
  //
  // Then I can use center to show activey-blur future skid locations
  // when other cars are moving.
  // Show only when center doesn't return the same value as car.rect.
  //
  // And on move, other PhasingMove methods can build on this for turning?
  //
  // Or change it???
  //
  static center({ car }) {
    car.phasing.rect = car.rect.clone()
    return car
  }

  static drift({ car, distance }) {
    // BUGBUG:
    // how far already?
    /*
    const currentDistanceDelta = car.rect
      .frPoint()
      .distanceTo(car.phasing.rect.brPoint())
    const currentDegrees = car.rect
      .frPoint()
      .degreesTo(car.phasing.rect.brPoint())
    const currentdirectionFactor =
      car.rect.arcForPoint(car.phasing.rect.blPoint()) === 'L' ? -1 : 1
*/
    // if already + delta too big, return
    /*
    if (
      Math.abs(currentDirectionFactor * currentDistanceDalta + distance) >
      INCH / 2
    ) {
      return car.phasing.rect
    }
    */

    // calculate change from a straight move and do it
    const targetPoint = car.phasing.rect
      .brPoint()
      .move({ degrees: car.rect.facing + FACE.RIGHT, distance })
    const nullBrPoint = car.rect
      .brPoint()
      .move({ degrees: car.rect.facing, distance: INCH })
    const currentDist = Math.floor(targetPoint.distanceTo(nullBrPoint))

    // Drifts are max 1/2".
    if (currentDist > INCH / 2) {
      return car.phasing.rect
    }

    car.phasing.rect._brPoint = targetPoint

    // Set maneuver difficulty. Resolve that when the move is accepted.
    if (currentDist === 0) {
      car.phasing.difficulty = 0
    } else if (currentDist > INCH / 4) {
      car.phasing.difficulty = 3
    } else {
      car.phasing.difficulty = 1
    }

    return car.phasing.rect
  }

  static fishtail({ car, direction, degrees }) {
    Log.info(`fishtail ${direction} ${degrees} degrees!`, car)
    if (direction === 'left') {
      car.phasing.rect = car.phasing.rect.frontLeftCornerPivot(degrees)
    } else if (direction === 'right') {
      car.phasing.rect = car.phasing.rect.frontRightCornerPivot(-degrees)
    } else {
      throw new Error(`unknown direction: ${direction}`)
    }
    return direction
  }

  static straight({ car, distance = INCH }) {
    return car.phasing.rect.move({ distance, degrees: car.phasing.rect.facing })
  }

  static hasMoved({ car }) {
    return !new Rectangle(car.rect).equals(new Rectangle(car.phasing.rect))
  }

  static possibleSpeeds({ car }) {
    const setSpeeds = ({
      currentSpeed,
      topSpeed,
      acceleration,
      canAccelerate,
      canBrake,
    }) => {
      const acc = canAccelerate ? acceleration : 0
      // BUGBUG: Only does straight
      const possibleMax = currentSpeed + acc
      const max = topSpeed >= possibleMax ? possibleMax : topSpeed
      // no more than 45 slower without special equipment
      const possibleMin = canBrake ? currentSpeed - 45 : currentSpeed
      const min = possibleMin >= 0 ? possibleMin : 0
      const result = []
      for (let i = min; i <= max; i += 5) {
        result.push({ speed: i, difficulty: 0, damageDice: '' })
      }
      return result
    }

    const result = setSpeeds({
      currentSpeed: car.status.speed,
      topSpeed: car.design.attributes.topSpeed,
      acceleration: car.design.attributes.acceleration,
      canAccelerate: VehicleStatusHelper.canAccelerate(car),
      canBrake: VehicleStatusHelper.canBrake(car),
    })

    let index =
      result.findIndex((change) => change.speed === car.status.speed) - 3

    // unclear how to handle > 45mph deceleration - see p.9
    const difficulties = [
      { dIndex: -3, difficulty: 1, damageDice: '' },
      { dIndex: -4, difficulty: 2, damageDice: '' },
      { dIndex: -5, difficulty: 3, damageDice: '' },
      { dIndex: -6, difficulty: 5, damageDice: '' },
      { dIndex: -7, difficulty: 7, damageDice: '0d+2' },
      { dIndex: -8, difficulty: 9, damageDice: '1d' },
      { dIndex: -9, difficulty: 11, damageDice: '1d+3' },
    ]

    while (index >= 0) {
      const change = difficulties.shift()
      result[index].difficulty = change.difficulty
      result[index].damageDice = change.damageDice
      index--
    }

    return result
  }

  static reset({ car }) {
    const possibles = this.possibleSpeeds({ car })

    car.phasing = {
      collisionDetected: false,
      collisions: [],
      controlChecksForSpeedChanges: [],
      damage: [],
      difficulty: 0,
      maneuverIndex: 0,
      rect: car.rect ? car.rect.clone() : null,
      showSpeedChangeModal: false,
      speedChangeIndex: possibles.findIndex(
        (possible) => possible.speed === car.status.speed,
      ),
      speedChanges: possibles,
      targetIndex: car.phasing.targetIndex,
      targets: [],
      weaponIndex: car.phasing.weaponIndex,
      // BUGBUG: should keep weapon & target indices by character because often
      // some weapons will be used by a single crew member (e.g. gunner uses the turreted TWL
      // while driver handles dropped weapons) and maybe also leverage for sustained fire bonuses
    }

    if (car.phasing.speedChangeIndex === -1) {
      throw new Error('wat happened?')
    }

    car.phasing.controlChecksForSpeedChanges = car.phasing.speedChanges.map(
      (setting) => {
        return {
          speed: setting.speed,
          checks: Control.row({ speed: setting.speed }),
        }
      },
    )
  }

  // controlled skid skids on next move
  static swerve({ car, degrees }) {
    const currentFacingDelta = degreesDifference({
      initial: car.rect.facing,
      second: car.phasing.rect.facing,
    })
    const desiredFacing = currentFacingDelta + degrees
    let resultRect = car.phasing.rect.clone()

    // Can't turn more than 90 deg.
    if (Math.abs(desiredFacing) > 90) {
      return resultRect
    }

    const facingLeft = currentFacingDelta < 0
    const facingRight = currentFacingDelta > 0
    const turningToFront = desiredFacing === 0
    const turningLeft = degrees < 0
    const turningRight = degrees > 0

    const drift = (direction = 'right') => {
      resultRect = resultRect.move({
        degrees: resultRect.facing + FACE.RIGHT,
        distance: direction === 'right' ? INCH / 4 : -INCH / 4,
      })
      resultRect.facing += FACE.LEFT
    }

    if (turningToFront) {
      resultRect._brPoint = resultRect.brPoint().clone()
      resultRect = car.rect.move({
        degrees: car.rect.facing,
        distance: INCH,
      })
    } else if (turningRight) {
      if (facingRight) {
        resultRect = resultRect.backRightCornerPivot(degrees)
      } else if (facingLeft) {
        resultRect = resultRect.backLeftCornerPivot(degrees)
      } /* facing straight */ else {
        drift('left')
        resultRect = resultRect.backRightCornerPivot(degrees)
      }
    } else if (turningLeft) {
      if (facingLeft) {
        resultRect = resultRect.backLeftCornerPivot(degrees)
      } else if (facingRight) {
        resultRect = resultRect.backRightCornerPivot(degrees)
      } /* facing straight */ else {
        drift('right')
        resultRect = resultRect.backLeftCornerPivot(degrees)
      }
    }

    car.phasing.difficulty = Math.ceil(Math.abs(desiredFacing) / 15)
    if (car.phasing.difficulty > 0) {
      car.phasing.difficulty++
    }

    return resultRect
  }
}

export default PhasingMove
