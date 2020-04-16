import { FACE, INCH } from '../utils/constants'
import { degreesDifference } from '../utils/conversions'
import Log from '../utils/Log'
import VehicleStatusHelper from './VehicleStatusHelper'
import Control from './Control'

class PhasingMove {
  static hasMoved ({ car }) {
    return !car.rect.brPoint().equals(car.phasing.rect.brPoint()) ||
           car.rect.facing !== car.phasing.rect.facing
  }

  static possibleSpeedsWithoutUsingACar({ currentSpeed, topSpeed, acceleration, canAccelerate, canBrake }) {
    console.log('in possibleSpeedsWithoutUsingACar')
    console.log(`currentSpeed: ${currentSpeed}`)
    console.log(`topSpeed: ${topSpeed}`)
    console.log(`acceleration: ${acceleration}`)
    console.log(`canAccelerate: ${canAccelerate}`)
    console.log(`canBrake: ${canBrake}`)
    const acc = canAccelerate ? acceleration : 0
    // BUGBUG: Only does forward

    const possibleMax = currentSpeed + acc
    const max = (topSpeed >= possibleMax) ? possibleMax : topSpeed

    const possibleMin = canBrake ? currentSpeed - 45 : currentSpeed
    const min = possibleMin >= 0 ? possibleMin : 0

    const resultArray = []
    for (let i = min; i <= max; i += 5) { resultArray.push(i) }
    return resultArray
  }

  static possibleSpeeds ({ car }) {
    console.log('in possibleSpeeds')
    console.log(`currentSpeed: ${car.status.speed}`)
    console.log(`topSpeed: ${car.design.attributes.topSpeed}`)
    console.log(`acceleration: ${car.design.attributes.acceleration}`)
    console.log(`canAccelerate: ${VehicleStatusHelper.canAccelerate(car)}`)
    console.log(`canBrake: ${VehicleStatusHelper.canBrake(car)}`)
    return PhasingMove.possibleSpeedsWithoutUsingACar({
      currentSpeed: car.status.speed,
      topSpeed: car.design.attributes.topSpeed,
      acceleration: car.design.attributes.acceleration,
      canAccelerate: VehicleStatusHelper.canAccelerate(car),
      canBrake: VehicleStatusHelper.canBrake(car)
    })
  }

  static reset ({ car }) {
    const possibles = this.possibleSpeeds({ car })

console.log('RESET!')

    car.phasing = {
      rect: car.rect.clone(),
      damage: [{
          target: null,
          message: ''
      }],
      difficulty: 0,
      maneuverIndex: 0,
      speedChanges: possibles,
      speedChangeIndex: possibles.indexOf(car.status.speed),
      weaponIndex: car.phasing.weaponIndex,
      targets: [],
      targetIndex: 0, // BUGBUG: keep old targets? We want sustained fire . . .
      collisionDetected: false,
      collisions: []
    }
    console.log( car.phasing.speedChanges)
    car.phasing.controlChecksForSpeedChanges = car.phasing.speedChanges.map(spd => {
      console.log(Control.row({ speed: spd }))
      return { speed: spd, checks: Control.row({ speed: spd })}
    })
    console.log(car.phasing.controlChecksForSpeedChanges)
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
