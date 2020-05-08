import { FACE, INCH } from '../utils/constants'
import { degreesDifference } from '../utils/conversions'
import Log from '../utils/Log'
import Control from './Control'
import VehicleStatusHelper from './VehicleStatusHelper'

class PhasingMove {
  static hasMoved ({ car }) {
    return !car.rect.brPoint().equals(car.phasing.rect.brPoint()) ||
           car.rect.facing !== car.phasing.rect.facing
  }

  static possibleSpeeds ({ car }) {
    const setSpeeds = ({ currentSpeed, topSpeed, acceleration, canAccelerate, canBrake  }) => {
      const acc = canAccelerate ? acceleration : 0
      // BUGBUG: Only does forward
      const possibleMax = currentSpeed + acc
      const max = (topSpeed >= possibleMax) ? possibleMax : topSpeed
      // no more than 45 slower without special equipment
      const possibleMin = canBrake ? currentSpeed - 45 : currentSpeed
      const min = possibleMin >= 0 ? possibleMin : 0
      const result = []
      for (let i = min; i <= max; i += 5) { result.push({ speed: i, difficulty: 0, damageDice: '' }) }
      return result
    }

    const result = setSpeeds({
      currentSpeed: car.status.speed,
      topSpeed: car.design.attributes.topSpeed,
      acceleration: car.design.attributes.acceleration,
      canAccelerate: VehicleStatusHelper.canAccelerate(car),
      canBrake: VehicleStatusHelper.canBrake(car)
    })

    let index = result.findIndex(change => change.speed === car.status.speed) -3

    // unclear how to handle > 45mph deceleration - see p.9
    let difficulties = [
      { dIndex: -3, difficulty: 1, damageDice: '' },
      { dIndex: -4, difficulty: 2, damageDice: '' },
      { dIndex: -5, difficulty: 3, damageDice: '' },
      { dIndex: -6, difficulty: 5, damageDice: '' },
      { dIndex: -7, difficulty: 7, damageDice: '0d+2' },
      { dIndex: -8, difficulty: 9, damageDice: '1d' },
      { dIndex: -9, difficulty: 11, damageDice: '1d+3' }
    ]

    while (index >= 0) {
      let change = difficulties.shift()
      result[index].difficulty = change.difficulty
      result[index].damageDice = change.damageDice
      index--
    }

    return result
  }

  static reset ({ car }) {
    const possibles = this.possibleSpeeds({ car })
    car.phasing = {
      rect: car.rect.clone(),
      damage: [],
      difficulty: 0,
      maneuverIndex: 0,
      speedChanges: possibles,
      speedChangeIndex: possibles.findIndex(possible => possible.speed === car.status.speed),
      weaponIndex: car.phasing.weaponIndex,
      targets: [],
      targetIndex: 0, // BUGBUG: keep old targets? We want sustained fire . . .
      collisionDetected: false,
      collisions: []
    }

    if (car.phasing.speedChangeIndex === -1) {
      throw new Error('wat happened?')
    } 

    car.phasing.controlChecksForSpeedChanges = car.phasing.speedChanges.map(setting => {
      return { speed: setting.speed, checks: Control.row({ speed: setting.speed })}
    })
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
  static center ({ car }) {
    car.phasing.rect = car.rect.clone()
    return car
  }

  // BUGBUG: Move the phasing rect instead.
  static forward ({ car, distance = INCH }) {
    return car.phasing.rect.move({ distance, degrees: car.phasing.rect.facing })
  }

  static fishtail ({ car, direction, degrees }) {
    Log.info(`fishtail ${direction} ${degrees} degrees!`)
    Log.info(`previous facing: ${car.rect.facing}`)
    if (direction === 'left') {
      car.phasing.rect = car.phasing.rect.leftFrontCornerPivot(degrees)
    } else if (direction === 'right'){
      car.phasing.rect = car.phasing.rect.rightFrontCornerPivot(-degrees)
    } else {
      throw new Error(`unknown direction: ${direction}`)
    }
    Log.info(`new facing: ${car.rect.facing}`)
    return direction
  }

  static skid ({ car, distance, degrees = null, controlled = false }) {
    let thisTotalMove = 1
    if (Movement.distanceThisPhase({ speed: car.status.speed, phase: match.time.phase.number }) === 0.5) {
      thisTotalMove = 0.5
    }

    if (degrees === null) { degrees = car.rect.facing }
    car.phasing.rect = car.phasing.rect.move({ degrees, distance })

    if (controlled) { car.phasing.difficulty += Math.round(distance * 4 / INCH) }

    car.phasing.rect = car.phasing.rect.move({ degrees, distance, slide: true })
    car.phasing.rect = car.phasing.rect.move({ degrees, distance: thisTotalMove - distance, slide: true })
  }

  // controlled skid skids on next move
  static bend ({ car, degrees }) {
    const currentFacingDelta = degreesDifference({
      initial: car.rect.facing,
      second: car.phasing.rect.facing
    })
    const desiredFacing = currentFacingDelta + degrees

    // Can't turn more than 90 deg.
    if (Math.abs(desiredFacing) > 90) { return car.phasing.rect }

    const facingRight = currentFacingDelta > 0
    const facingLeft = currentFacingDelta < 0
    const turningRight = degrees > 0

    PhasingMove.center({ car })
    let resultRect = PhasingMove.forward({ car })

    if (turningRight) {
      if (!facingLeft) {
        resultRect = resultRect.rightBackCornerPivot(desiredFacing)
      } else /* facing left */ {
        resultRect = resultRect.leftBackCornerPivot(desiredFacing)
      }
    } else /* turning left */ {
      if (!facingRight) {
        resultRect = resultRect.leftBackCornerPivot(desiredFacing)
      } else /* facing right */ {
        resultRect = resultRect.rightBackCornerPivot(desiredFacing)
      }
    }

    car.phasing.difficulty = Math.ceil(Math.abs(resultRect.facing - car.rect.facing) / 15)

    return resultRect
  }

  // controlled skid skids on next move
  static swerve ({ car, degrees }) {
    //  |
    //  |
    //  |
    //  |
    // \|/
    //  V
    // TODO: make this use first the new drift and then the new bend usage
    // Each possibility tries to make a complete move - that way we can active collisions

    // BUGBUG: I have absolutely no idea why this needs different special
    // handling than bend. Changing facing should be the same, I'd think.
    // Maybe I could solve this for everything by creating a degree class or
    // degree comparison functions.

    const currentFacingDelta = degreesDifference({
      initial: car.rect.facing,
      second: car.phasing.rect.facing
    })
    const desiredFacing = currentFacingDelta + degrees
    let resultRect = car.phasing.rect.clone()

    // Can't turn more than 90 deg.
    if (Math.abs(desiredFacing) > 90) { return resultRect }

    const facingLeft = currentFacingDelta < 0
    const facingRight = currentFacingDelta > 0
    const turningToFront = desiredFacing === 0
    const turningLeft = degrees < 0
    const turningRight = degrees > 0

    const drift = (direction = 'right') => {
      resultRect = resultRect.move({
        degrees: (resultRect.facing + FACE.RIGHT),
        distance: ((direction === 'right') ? INCH / 4 : -INCH / 4)
      })
      resultRect.facing += FACE.LEFT
    }

    if (turningToFront) {
      resultRect._brPoint = resultRect.brPoint().clone()
      resultRect = car.rect.move({
        degrees: car.rect.facing,
        distance: INCH
      })
    } else if (turningRight) {
      if (facingRight) {
        resultRect = resultRect.rightBackCornerPivot(degrees)
      } else if (facingLeft) {
        resultRect = resultRect.leftBackCornerPivot(degrees)
      } else /* facing forward */ {
        drift('left')
        resultRect = resultRect.rightBackCornerPivot(degrees)
      }
    } else if (turningLeft) {
      if (facingLeft) {
        resultRect = resultRect.leftBackCornerPivot(degrees)
      } else if (facingRight) {
        resultRect = resultRect.rightBackCornerPivot(degrees)
      } else /* facing forward */ {
        drift('right')
        resultRect = resultRect.leftBackCornerPivot(degrees)
      }
    }

    car.phasing.difficulty = Math.ceil(Math.abs(desiredFacing) / 15)
    if (car.phasing.difficulty > 0) { car.phasing.difficulty++ }

    return resultRect
  }

  static drift ({ car, distance }) {
    const targetPoint = car.phasing.rect.brPoint().move({ degrees: car.rect.facing + FACE.RIGHT, distance })
    const nullBrPoint = car.rect.brPoint().move({ degrees: car.rect.facing, distance: INCH })
    const currentDist = Math.floor(targetPoint.distanceTo(nullBrPoint))

    // Drifts are max 1/2".
    if (currentDist > INCH / 2) { return car.phasing.rect }

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
}

export default PhasingMove
