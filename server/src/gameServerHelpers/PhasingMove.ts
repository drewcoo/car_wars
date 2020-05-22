import { FACE, INCH } from '../utils/constants'
import { degreesDifference } from '../utils/conversions'
import Log from '../utils/Log'
import Control from './Control'
import Vehicle from './Vehicle'
import Rectangle from '../utils/geometry/Rectangle'

class PhasingMove {
  static bend({ vehicle, degrees }: { vehicle: any, degrees: number }) {
    // how far already?
    const currentFacingDelta = degreesDifference({
      initial: vehicle.rect.facing,
      second: vehicle.phasing.rect.facing,
    })
    const desiredFacing = currentFacingDelta + degrees

    // if already + delta too big, return
    // Can't turn more than 90 deg.
    if (Math.abs(desiredFacing) > 90) {
      return vehicle.phasing.rect
    }

    // calculate change from a straight move and do it
    const facingRight = currentFacingDelta > 0
    const facingLeft = currentFacingDelta < 0
    const turningRight = degrees > 0

    //let centeredRect = PhasingMove.center({ vehicle })
    vehicle.phasing.rect = PhasingMove.center({ vehicle })
    //let resultRect = PhasingMove.straight({ vehicle: centered })
    let resultRect = PhasingMove.straight({ vehicle, distance: INCH })

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

    vehicle.phasing.difficulty = Math.ceil(Math.abs(resultRect.facing - vehicle.rect.facing) / 15)

    return resultRect
  }

  //
  // What if I have vehicle.rect show the current vehicle location,
  // center (renamed?) always show the fishtail/skid/etc.-effect next position?
  //
  // Then I can use center to show activey-blur future skid locations
  // when other vehicles are moving.
  // Show only when center doesn't return the same value as vehicle.rect.
  //
  // And on move, other PhasingMove methods can build on this for turning?
  //
  // Or change it???
  //
  static center({ vehicle }: { vehicle: any }) {
    return vehicle.rect.clone()
  }

  static drift({ vehicle, distance }: { vehicle: any, distance: number }) {
    // BUGBUG:
    // how far already?
    /*
    const currentDistanceDelta = vehicle.rect
      .frPoint()
      .distanceTo(vehicle.phasing.rect.brPoint())
    const currentDegrees = vehicle.rect
      .frPoint()
      .degreesTo(vehicle.phasing.rect.brPoint())
    const currentdirectionFactor =
      vehicle.rect.arcForPoint(vehicle.phasing.rect.blPoint()) === 'L' ? -1 : 1
*/
    // if already + delta too big, return
    /*
    if (
      Math.abs(currentDirectionFactor * currentDistanceDalta + distance) >
      INCH / 2
    ) {
      return vehicle.phasing.rect
    }
    */

    // calculate change from a straight move and do it
    const targetPoint = vehicle.phasing.rect.brPoint().move({ degrees: vehicle.rect.facing + FACE.RIGHT, distance })
    const nullBrPoint = vehicle.rect.brPoint().move({ degrees: vehicle.rect.facing, distance: INCH })
    const currentDist = Math.floor(targetPoint.distanceTo(nullBrPoint))

    // Drifts are max 1/2".
    if (currentDist > INCH / 2) {
      return vehicle.phasing.rect
    }

    vehicle.phasing.rect._brPoint = targetPoint

    // Set maneuver difficulty. Resolve that when the move is accepted.
    if (currentDist === 0) {
      vehicle.phasing.difficulty = 0
    } else if (currentDist > INCH / 4) {
      vehicle.phasing.difficulty = 3
    } else {
      vehicle.phasing.difficulty = 1
    }

    return vehicle.phasing.rect
  }

  static fishtail({ vehicle, direction, degrees }: { vehicle: any, direction: string, degrees: number }) {
    Log.info(`fishtail ${direction} ${degrees} degrees!`, vehicle)
    if (direction === 'left') {
      vehicle.phasing.rect = vehicle.phasing.rect.frontLeftCornerPivot(degrees)
    } else if (direction === 'right') {
      vehicle.phasing.rect = vehicle.phasing.rect.frontRightCornerPivot(-degrees)
    } else {
      throw new Error(`unknown direction: ${direction}`)
    }
    return direction
  }

  static straight({ vehicle, distance = INCH }: { vehicle: any, distance: number }) {
    return vehicle.rect.move({ distance, degrees: vehicle.phasing.rect.facing })
  }

  static hasMoved({ vehicle }: { vehicle: any }) {
    return !new Rectangle(vehicle.rect).equals(new Rectangle(vehicle.phasing.rect))
  }

  static possibleSpeeds({ vehicle }: { vehicle: any }) {
    const setSpeeds = ({ currentSpeed, topSpeed, acceleration, canAccelerate, canBrake }: { currentSpeed: number, topSpeed: number, acceleration: number, canAccelerate: boolean, canBrake: boolean }) => {
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
      currentSpeed: vehicle.status.speed,
      topSpeed: vehicle.design.attributes.topSpeed,
      acceleration: vehicle.design.attributes.acceleration,
      canAccelerate: Vehicle.canAccelerate({ vehicle }),
      canBrake: Vehicle.canBrake({ vehicle }),
    })

    let index = result.findIndex((change) => change.speed === vehicle.status.speed) - 3

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
      const change: any = difficulties.shift()
      result[index].difficulty = change.difficulty
      result[index].damageDice = change.damageDice
      index--
    }

    return result
  }

  static reset({ vehicle }: { vehicle: any }) {
    const possibles = this.possibleSpeeds({ vehicle })

    vehicle.phasing = {
      collisionDetected: false,
      collisions: [],
      controlChecksForSpeedChanges: [],
      damage: [],
      difficulty: 0,
      maneuverIndex: 0,
      rect: vehicle.rect ? vehicle.rect.clone() : null,
      showSpeedChangeModal: false,
      speedChangeIndex: possibles.findIndex((possible) => possible.speed === vehicle.status.speed),
      speedChanges: possibles,
      targetIndex: vehicle.phasing.targetIndex,
      targets: [],
      weaponIndex: vehicle.phasing.weaponIndex,
      // BUGBUG: should keep weapon & target indices by character because often
      // some weapons will be used by a single crew member (e.g. gunner uses the turreted TWL
      // while driver handles dropped weapons) and maybe also leverage for sustained fire bonuses
    }

    if (vehicle.phasing.speedChangeIndex === -1) {
      throw new Error('wat happened?')
    }

    vehicle.phasing.controlChecksForSpeedChanges = vehicle.phasing.speedChanges.map((setting: any) => {
      return {
        speed: setting.speed,
        checks: Control.row({ speed: setting.speed }),
      }
    })
  }

  // controlled skid skids on next move
  static swerve({ vehicle, degrees }: { vehicle: any, degrees: number }) {
    const currentFacingDelta = degreesDifference({
      initial: vehicle.rect.facing,
      second: vehicle.phasing.rect.facing,
    })
    const desiredFacing = currentFacingDelta + degrees
    let resultRect = vehicle.phasing.rect.clone()

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
      resultRect = vehicle.rect.move({
        degrees: vehicle.rect.facing,
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

    vehicle.phasing.difficulty = Math.ceil(Math.abs(desiredFacing) / 15)
    if (vehicle.phasing.difficulty > 0) {
      vehicle.phasing.difficulty++
    }

    return resultRect
  }
}

export default PhasingMove
