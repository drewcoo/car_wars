import { FACE, INCH } from '../../utils/constants'

class PhasingMove {
  static nothing ({ car }) {
    console.log('nothing here')
    console.log(car.id)
  }

  static hasMoved ({ car }) {
    return !car.rect.brPoint().equals(car.phasing.rect.brPoint()) ||
           car.rect.facing !== car.phasing.rect.facing
  }

  static possibleSpeeds ({ car }) {
    const currentSpeed = car.status.speed
    console.log(car)
    console.log(car.status.speed)
    const top = car.design.attributes.topSpeed
    const acc = car.design.attributes.acceleration
    const possibleMax = currentSpeed + acc
    const max = (top >= possibleMax) ? possibleMax : top

    const possibleMin = currentSpeed - 45
    const min = possibleMin >= 0 ? possibleMin : 0
    console.log(`min: ${min}; max: ${max}`)

    let resultArray = []
    for (let i = min; i <= max; i += 5) { resultArray.push(i) }
    return resultArray
  }

  static reset ({ car }) {
    car.status.speed = car.phasing.speedChanges[car.phasing.speedChangeIndex]
    const possibles = this.possibleSpeeds({ car })

    car.phasing = {
      rect: car.rect.clone(),
      damageMarkerLocation: null,
      damageMessage: '',
      difficulty: 0,
      // focus: true, do something with next player/next car instead.
      maneuverIndex: 0,
      // Maybe - something in fire
      // movedAndFired: false,
      speedChanges: possibles, // .phasing.speedChanges,
      speedChangeIndex: possibles.indexOf(car.status.speed),
      weaponIndex: car.phasing.weaponIndex,
      targets: [],
      targetIndex: 0, // BUGBUG: keep old targets? We want sustained fire . . .
      collisionDetected: false,
      collisions: []
    }
  }

  static forward ({ car, distance = INCH }) {
    return car.rect.move({ distance, degrees: car.rect.facing })
  }

  static bend ({ car, degrees }) {
    const currentFacingDelta = car.phasing.rect.facing - car.rect.facing
    const desiredFacing = currentFacingDelta + degrees
    // Can't turn more than 90 deg.
    if (Math.abs(desiredFacing) > 90) { return car.phasing.rect }

    const facingRight = currentFacingDelta > 0
    const facingLeft = currentFacingDelta < 0
    const turningRight = degrees > 0

    let resultRect = PhasingMove.forward({ car })

    if (turningRight) {
      if (!facingLeft) {
        resultRect = resultRect.rightCornerTurn(desiredFacing)
      } else /* facing left */ {
        resultRect = resultRect.leftCornerTurn(desiredFacing)
      }
    } else /* turning left */ {
      if (!facingRight) {
        resultRect = resultRect.leftCornerTurn(desiredFacing)
      } else /* facing right */ {
        resultRect = resultRect.rightCornerTurn(desiredFacing)
      }
    }

    car.phasing.difficulty = Math.ceil(Math.abs(resultRect.facing - car.rect.facing) / 15)

    return resultRect
  }

  static swerve ({ car, degrees }) {
    //  |
    //  |
    //  |
    //  |
    // \|/
    //  V
    // TODO: make this use first the new drift and then the new bend usage
    // Each possibility tries to make a complete move - that way we can ghost collisions
    const currentFacing = car.phasing.rect.facing - car.rect.facing
    const desiredFacing = currentFacing + degrees

    let resultRect = car.phasing.rect.clone()

    // Can't turn more than 90 deg.
    if (Math.abs(desiredFacing) > 90) { return resultRect }

    const facingLeft = currentFacing < 0
    const facingRight = currentFacing > 0
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
      resultRect.__brPoint = resultRect.brPoint().clone()
      resultRect = car.rect.move({
        degrees: car.rect.facing,
        distance: INCH
      })
    } else if (turningRight) {
      if (facingRight) {
        resultRect = resultRect.rightCornerTurn(degrees)
      } else if (facingLeft) {
        resultRect = resultRect.leftCornerTurn(degrees)
      } else /* facing forward */ {
        drift('left')
        resultRect = resultRect.rightCornerTurn(degrees)
      }
    } else if (turningLeft) {
      if (facingLeft) {
        resultRect = resultRect.leftCornerTurn(degrees)
      } else if (facingRight) {
        resultRect = resultRect.rightCornerTurn(degrees)
      } else /* facing forward */ {
        drift('right')
        resultRect = resultRect.leftCornerTurn(degrees)
      }
    }

    car.phasing.difficulty = Math.ceil(Math.abs(desiredFacing) / 15)
    if (car.phasing.difficulty > 0) { car.phasing.difficulty++ }

    return resultRect
  }

  static drift ({ car, distance }) {
    const fwdNull = PhasingMove.forward({ car })
    // const fwdNull = car.rect.move({ degrees: car.rect.facing + FACE.FRONT, distance: INCH });
    const result = car.phasing.rect.move({ degrees: car.rect.facing + FACE.RIGHT, distance })
    result.facing = car.rect.facing
    const currentDist = Math.floor(fwdNull.brPoint().distanceTo(result.brPoint()))

    // Drifts are max 1/2".
    if (currentDist > INCH / 2) { return car.phasing.rect }

    // Set maneuver difficulty. Resolve that when the move is accepted.
    if (currentDist === 0) {
      car.phasing.difficulty = 0
    } else if (currentDist > INCH / 4) {
      car.phasing.difficulty = 3
    } else {
      car.phasing.difficulty = 1
    }

    return result
  }
}

export default PhasingMove
