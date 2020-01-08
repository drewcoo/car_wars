class Collisions {
  static clear ({ cars }) {
    for (const car of cars) {
      // This is ugly.
      car.phasing.collisionDetected = false
      car.collisionDetected = false
      car.phasing.collisions = []
      car.collisions = []
    }
  }

  static damageModifierFromWeight (weight) {
    // p.17
    // pedestrians have DM of 1/5
    if (weight <= 2000) { return 1 / 3 }
    if (weight <= 4000) { return 2 / 3 }
    return Math.ceiling(weight / 4000) + 1
  }

  static temporarySpeed ({ thisDM, otherDM, speed }) {
    // p. 21
    const table = [
      [1 / 2, 1 / 4, 1 / 4, 1 / 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [3 / 4, 1 / 2, 1 / 2, 1 / 4, 1 / 4, 1 / 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [3 / 4, 1 / 2, 1 / 2, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [3 / 4, 3 / 4, 3 / 4, 1 / 2, 1 / 2, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 0, 0, 0, 0, 0, 0, 0],
      [1, 3 / 4, 3 / 4, 1 / 2, 1 / 2, 1 / 2, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4],
      [1, 3 / 4, 3 / 4, 3 / 4, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4],
      [1, 1, 3 / 4, 3 / 4, 3 / 4, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4],
      [1, 1, 3 / 4, 3 / 4, 3 / 4, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4],
      [1, 1, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4],
      [1, 1, 1, 3 / 4, 3 / 4, 3 / 4, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4],
      [1, 1, 1, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4, 1 / 4],
      [1, 1, 1, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 4, 1 / 4, 1 / 4, 1 / 4],
      [1, 1, 1, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 4, 1 / 4],
      [1, 1, 1, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 4],
      [1, 1, 1, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2],
      [1, 1, 1, 1, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2],
      [1, 1, 1, 1, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2],
      [1, 1, 1, 1, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2],
      [1, 1, 1, 1, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2],
      [1, 1, 1, 1, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2],
      [1, 1, 1, 1, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2],
      [1, 1, 1, 1, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2]
    ]
    const row = (thisDM >= 1) ? (thisDM + 1) : (thisDM * 3 - 1)
    const column = (otherDM >= 1) ? (otherDM + 1) : (otherDM * 3 - 1)
    return table[row][column] * speed
  }

  static ramDamageBySpeed (speed) {
    if (speed < 0) { throw new Error(`speed < 0! "${speed}"`) }
    if (speed % 5 !== 0) { throw new Error(`speed not multiple of 5: "${speed}"`) }
    switch (speed) {
      case 0:
        return '0d'
      case 5:
        return '1d-4'
      case 10:
        return '1d−2'
      case 15:
        return '1d−1'
      case 20:
      case 25:
        return '1d'
      default:
        return `${speed / 5 - 5}d`
    }
  }

  //
  // START HERE!!
  //
  // BUGBUG: Assumes forward movement; not reverse.
  static detectWithCars ({ cars, thisCar }) {
    cars.forEach(function (car) {
      if (car.id === thisCar.id) { return }

      var rammer = { rammed: { id: car.id } }
      var rammed = { rammedBy: thisCar.id }

      // var skew = thisCar.phasing.rect.intersectRectangle( car.rect);
      var skew = thisCar.phasing.rect.intersects(car.rect)

      if (skew) {
        car.collisionDetected = true
        thisCar.phasing.collisionDetected = true
        var collisionSpeed = 'NOT SET'
        var damageToEach = 'NOT SET'

        var arcOfRammedVehicle = car.rect.arcForPoint(thisCar.rect.fSide().middle()) // thisCar.phasing.rect.center());
        console.log(`striker is in ${arcOfRammedVehicle} arc of rammed.`)

        if ((arcOfRammedVehicle === 'F' && car.status.speed >= 0) ||
            (arcOfRammedVehicle === 'R' && car.status.speed < 0)) {
          // BUGBUG: handle reverse speeds

          rammer.type = rammed.type = 'head-on'
          collisionSpeed = thisCar.status.speed + car.status.speed
          damageToEach = Collisions.ramDamageBySpeed(collisionSpeed)
          rammer.damage = rammed.damage = damageToEach
          rammer.damageModifier = Collisions.damageModifierFromWeight(thisCar.design.attributes.weight)
          rammed.damageModifier = Collisions.damageModifierFromWeight(car.design.attributes.weight)

          if (thisCar.status.speed <= car.status.speed) {
            rammer.handlingStatus = rammed.handlingStatus = -Math.floor(thisCar.status.speed / 10)
            rammer.newSpeed = 0
            rammed.newSpeed = car.status.speed - thisCar.status.speed
          } else {
            rammer.handlingStatus = rammed.handlingStatus = -Math.floor(car.status.speed / 10)
            rammed.newSpeed = 0
            rammer.newSpeed = thisCar.status.speed - car.status.speed
          }
        } else if ((arcOfRammedVehicle === 'B' && car.status.speed >= 0) ||
                   (arcOfRammedVehicle === 'F' && car.status.speed < 0)) {
          // BUGBUG: handle reverse speeds
          rammer.type = rammed.type = 'rear-end'

          collisionSpeed = thisCar.status.speed - car.status.speed
          damageToEach = Collisions.ramDamageBySpeed(collisionSpeed)
          rammer.damage = rammed.damage = damageToEach
          rammer.damageModifier = Collisions.damageModifierFromWeight(thisCar.design.attributes.weight)
          rammed.damageModifier = Collisions.damageModifierFromWeight(car.design.attributes.weight)

          /// //////////////////////////////
        } else {
          if (Collisions.isSideswipe({ car: thisCar, other: car, skew })) {
            console.log(`thisCar.phasing.rect.facing : ${thisCar.phasing.rect.facing}`)
            console.log(`thisCar.rect.facing: ${thisCar.rect.facing}`)
            console.log(`car.rect.facing: ${car.rect.facing}`)
            console.log(`Math.abs(car.rect.facing - thisCar.phasing.rect.facing): ${Math.abs(car.rect.facing - thisCar.phasing.rect.facing)}`)

            var facingDelta = Math.abs(car.rect.facing - thisCar.phasing.rect.facing)

            rammed.type = (facingDelta >= 0 && facingDelta <= 45) ? 'same-direction-sideswipe' : 'different-direction-sideswipe'
            rammer.type = rammed.type
            /// //////////////////////////////////
          } else {
            rammer.type = rammed.type = 't-bone'
          }
        }

        // possibly more than one collision - chain reaction?
        thisCar.phasing.collisions.push(rammer)
        car.phasing.collisions.push(rammed)
        console.log(JSON.stringify(thisCar.phasing.collisions))
        console.log(JSON.stringify(car.phasing.collisions))
        console.log(`Moving car completes move?  ${rammer.newSpeed <= 0 ? 'No.' : 'Yes.'}`)
      }
    })
  }

  static isSideswipe ({ car, other, skew }) {
    var delta = Math.abs((car.phasing.rect.facing + 360) % 360 - (other.rect.facing + 360) % 360)
    // first mod to one side
    delta %= 180
    // then anything > 45 deg from the middle is a sideswipe.
    //
    // BUGBUG: At exactly 45 degrees from perpendicular this could be a sideswipe
    // or not. pp 18-19 don't specify which to choose. I chose to treat the
    // boundary cases a non-sideswipes.
    return (delta < 45 || delta > 135)
  }

  // BUGBUG: Assumes forward movement; not reverse.
  static detectWithWalls ({ thisCar, walls }) {
    // shortcut - premature optimization?
    if (thisCar.phasing.collisionDetected) { return }

    for (const wall of walls) {
      // var skew = thisCar.phasing.rect.intersectRectangle(wall.rect);
      var skew = thisCar.phasing.rect.intersects(wall.rect)

      if (skew) {
        thisCar.phasing.collisionDetected = true

        var type = 'unknown'
        if (Collisions.isSideswipe({ car: thisCar, other: wall, skew })) {
          // TODO : determine same/opposite dir sideswipe based on facings.
          type = 'sideswipe'
        } else {
          // TODO: determine head-on, rear-end, or t-bone based on
          // which arc the car hit
          type = 'notSideswipe'
        }
        console.log(type)

        // TODO: Movement, damage, HC mods

        thisCar.phasing.collisions.push({ type: type, rammed: wall })
      }
    }
  }

  static detect ({ cars, map, thisCar }) {
    const walls = map.wallData
    // clear old collision data just in case
    Collisions.clear({ cars })
    Collisions.detectWithCars({ cars, thisCar })
    Collisions.detectWithWalls({ walls, thisCar })
  }

  static resolve ({ car, collision }) {
    if (collision.rammed.id.match(/car|wall/)) {
      console.log(`hit: ${collision.rammed.id}`)
      console.log(`type: ${collision.type}`)
    } else {
      throw new Error(`unknown rammed thing: "${collision}"`)
    }
  }

  //
  //  (T-Bone, Head-On, Rear-End or Sideswipe)
  //
  // head-on - collide from the other vehicle's front arc
  //
  // rear end - collide from the other vehicle's back arc
  //
  // sideswipe - collide into a vehicles's side, from its side arc, but
  // in the direction of (or opposite of) it's front and back arcs
  // Can be same dir or opposite dir.
  //
  // t-bone - collie into a vehicle's side, from any direction opposite its
  // side arc
  //
  // all wall collisiions are sideswipe or head-on
  //
  /*
  Need to figure out mechanics for these:

   p.19: "The driver of the conforming vehicle selects an appropriate pivot corner from the choices shown in
Figure 10."

  p. 20: "If a collision occurs and it is on the border of two types of collisions, the defender
decides what type of collision it is."

  Also, beware this:
  p.20: "Note that subsequent phases in which
the vehicles are still in contact are not new
collisions"
  */
  //

  //
  //
}

export default Collisions
