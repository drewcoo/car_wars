import Log from '../utils/Log'
import Control from './Control'
import Match from './Match'

class Collisions {
  static clear({ match }: { match: any }) {
    Match.cars({ match }).forEach((car: any) => {
      // This is ugly.
      car.phasing.collisionDetected = false
      car.collisionDetected = false
      car.phasing.collisions = []
      car.collisions = []
    })
  }

  static damageModifierFromWeight(weight: number) {
    // p.17
    // pedestrians have DM of 1/5
    if (weight <= 2000) {
      return 1 / 3
    }
    if (weight <= 4000) {
      return 2 / 3
    }
    return Math.ceil(weight / 4000) - 1
  }

  static detect({ cars, map, thisCar }: { cars: any; map: any; thisCar: any }) {
    const walls = map.wallData
    const match = Match.withVehicle({ vehicle: thisCar })
    // clear old collision data just in case
    Collisions.clear({ match })
    Collisions.detectWithCars({ cars, thisCar })
    Collisions.detectWithWalls({ walls, thisCar })
  }

  // BUGBUG: Assumes straight movement; not reverse.
  static detectWithCars({ cars, thisCar }: { cars: any; thisCar: any }) {
    cars.forEach((car: any) => {
      if (car.id === thisCar.id) {
        return
      }

      const rammer: any = { rammed: car.id }
      const rammed: any = { rammedBy: thisCar.id }
      const skew = thisCar.phasing.rect.intersects(car.rect)

      if (skew) {
        car.collisionDetected = true
        thisCar.phasing.collisionDetected = true
        let collisionSpeed
        let damageToEach

        const arcOfRammedVehicle = car.rect.arcForPoint(thisCar.rect.fSide().middle())

        if (
          (arcOfRammedVehicle === 'F' && car.status.speed >= 0) ||
          (arcOfRammedVehicle === 'R' && car.status.speed < 0)
        ) {
          // BUGBUG: handle reverse speeds
          rammer.type = rammed.type = 'head-on'
          collisionSpeed = thisCar.status.speed + car.status.speed
          damageToEach = Collisions.ramDamageBySpeed(collisionSpeed)
          rammer.damage = rammed.damage = damageToEach
          rammer.damageModifier = Collisions.damageModifierFromWeight(thisCar.design.attributes.weight)
          rammed.damageModifier = Collisions.damageModifierFromWeight(car.design.attributes.weight)
          rammer.handlingStatus = Control.normalizeHandlingStatus(
            car.status.handling - this.handlingChange({ speed: car.status.speed }),
          )
          rammed.newSpeed = 0
          if (thisCar.status.speed <= car.status.speed) {
            rammed.newSpeed = car.status.speed - thisCar.status.speed
          } else {
            rammer.newSpeed = thisCar.status.speed - car.status.speed
          }
          Log.info('head-on collision', thisCar)
          Log.info(
            `handling: ${thisCar.status.handling}; change: ${this.handlingChange({
              speed: rammer.newSpeed,
            })}`,
            thisCar,
          )
        } else if (
          (arcOfRammedVehicle === 'B' && car.status.speed >= 0) ||
          (arcOfRammedVehicle === 'F' && car.status.speed < 0)
        ) {
          // BUGBUG: handle reverse speeds
          rammer.type = rammed.type = 'rear-end'

          collisionSpeed = thisCar.status.speed - car.status.speed
          damageToEach = Collisions.ramDamageBySpeed(collisionSpeed)
          rammer.damage = rammed.damage = damageToEach
          rammer.damageModifier = Collisions.damageModifierFromWeight(thisCar.design.attributes.weight)
          rammed.damageModifier = Collisions.damageModifierFromWeight(car.design.attributes.weight)

          const tmp =
            this.temporarySpeed({
              thisDM: rammer.damageModifier,
              otherDM: rammed.damageModifier,
              speed: thisCar.status.speed,
            }) +
            this.temporarySpeed({
              thisDM: rammed.damageModifier,
              otherDM: rammer.damageModifier,
              speed: car.status.speed,
            }) /
              2
          rammer.newSpeed = rammed.newSpeed = Math.floor(tmp / 5) * 5

          Log.info('rear end collision', thisCar)
          Log.info(
            `handling: ${thisCar.status.handling}; change: ${this.handlingChange({
              speed: rammer.newSpeed,
            })}`,
            thisCar,
          )
          rammer.handlingStatus = Control.normalizeHandlingStatus(
            thisCar.status.handling - this.handlingChange({ speed: rammer.newSpeed }),
          )
          rammed.handlingStatus = Control.normalizeHandlingStatus(
            car.status.handling - this.handlingChange({ speed: rammed.newSpeed }),
          )
        } else {
          if (Collisions.isSideswipe({ rammer: thisCar, rammed: car })) {
            const facingDelta = Math.abs(car.rect.facing - thisCar.phasing.rect.facing)

            let netSpeed = 0
            if (facingDelta >= 0 && facingDelta <= 45) {
              rammer.type = rammed.type = 'same-direction-sideswipe'
              netSpeed = Math.abs(car.status.speed - thisCar.status.speed)
            } else {
              rammer.type = rammed.type = 'different-direction-sideswipe'
              netSpeed = Math.abs(car.status.speed + thisCar.status.speed)
            }
            collisionSpeed = Math.ceil(netSpeed / 4 / 5) * 5

            rammer.damage = rammed.damage = Collisions.ramDamageBySpeed(collisionSpeed)
            rammer.damageModifier = Collisions.damageModifierFromWeight(thisCar.design.attributes.weight)
            rammed.damageModifier = Collisions.damageModifierFromWeight(car.design.attributes.weight)

            rammer.handlingStatus = Control.normalizeHandlingStatus(
              thisCar.status.handling - this.handlingChange({ speed: collisionSpeed }),
            )
            rammed.handlingStatus = Control.normalizeHandlingStatus(
              car.status.handling - this.handlingChange({ speed: collisionSpeed }),
            )

            rammer.newSpeed = thisCar.status.speed
            rammed.newSpeed = car.status.speed
          } else {
            rammer.type = rammed.type = 't-bone'
            collisionSpeed = thisCar.status.speed
            rammer.damage = rammed.damage = Collisions.ramDamageBySpeed(collisionSpeed)
            rammer.damageModifier = Collisions.damageModifierFromWeight(thisCar.design.attributes.weight)
            rammed.damageModifier = Collisions.damageModifierFromWeight(car.design.attributes.weight)

            rammer.newSpeed = this.temporarySpeed({
              thisDM: rammer.damageModifier,
              otherDM: rammed.damageModifier,
              speed: thisCar.status.speed,
            })

            rammed.newSpeed = car.status.speed

            rammer.handlingStatus = Control.normalizeHandlingStatus(
              thisCar.status.handling - this.handlingChange({ speed: rammer.newSpeed }),
            )
            rammed.handlingStatus = Control.normalizeHandlingStatus(
              car.status.handling - this.handlingChange({ speed: rammed.newSpeed }),
            )
          }
        }

        // possibly more than one collision - chain reaction?
        thisCar.phasing.collisions.push(rammer)
        car.phasing.collisions.push(rammed)
      }
    })
  }

  // BUGBUG: Assumes straight movement; not reverse.
  static detectWithWalls({ thisCar, walls }: { thisCar: any; walls: any }) {
    // shortcut - premature optimization?
    if (thisCar.phasing.collisionDetected) {
      return
    }

    for (const wall of walls) {
      const skew = thisCar.phasing.rect.intersects(wall.rect)

      if (skew) {
        thisCar.phasing.collisionDetected = true
        Log.info(`detect ${thisCar.color} car collisions with walls`, thisCar)
        const collisionInfo = {
          damage: '', // 0,
          damageModifier: 0,
          handlingStatus: 0,
          newSpeed: 0,
          rammed: wall.id,
          type: 'unknown',
        }

        // all wall collisiions are sideswipe or head-on
        if (Collisions.isSideswipe({ rammer: thisCar, rammed: wall })) {
          // TODO : determine same/opposite dir sideswipe based on facings.
          collisionInfo.type = 'sideswipe'
          const netSpeed = Math.abs(thisCar.status.speed)
          const collisionSpeed = Math.ceil(netSpeed / 4 / 5) * 5
          collisionInfo.damage = Collisions.ramDamageBySpeed(collisionSpeed)
          collisionInfo.damageModifier = Collisions.damageModifierFromWeight(thisCar.design.attributes.weight)
          collisionInfo.handlingStatus = Control.normalizeHandlingStatus(
            thisCar.status.handling - this.handlingChange({ speed: collisionSpeed }),
          )
          collisionInfo.newSpeed = thisCar.status.speed
        } else {
          collisionInfo.type = 'head-on'
          const collisionSpeed = thisCar.status.speed
          const damage = Collisions.ramDamageBySpeed(collisionSpeed)
          collisionInfo.damage = damage
          collisionInfo.damageModifier = Collisions.damageModifierFromWeight(thisCar.design.attributes.weight)
          collisionInfo.handlingStatus = Control.normalizeHandlingStatus(-Math.floor(thisCar.status.speed / 10))
          collisionInfo.newSpeed = 0
        }

        thisCar.phasing.collisions.push(collisionInfo)
      }
    }
  }

  static handlingChange({ speed }: { speed: number }) {
    let result = Math.floor(Math.abs(speed) / 10)
    if (result === 0) {
      result = 1
    }
    return result
  }

  static isSideswipe({ rammer, rammed }: { rammer: any; rammed: any }) {
    let delta = Math.abs(((rammer.phasing.rect.facing + 360) % 360) - ((rammed.rect.facing + 360) % 360))
    // first mod to one side
    delta %= 180
    // then anything > 45 deg from the middle is a sideswipe.
    //
    // BUGBUG: At exactly 45 degrees from perpendicular this could be a sideswipe
    // or not. pp 18-19 don't specify which to choose. I chose to treat the
    // boundary cases a non-sideswipes.
    return delta < 45 || delta > 135
  }

  static ramDamageBySpeed(speed: number): string {
    if (speed < 0) {
      throw new Error(`speed < 0! "${speed}"`)
    }
    if (speed % 5 !== 0) {
      throw new Error(`speed not multiple of 5: "${speed}"`)
    }
    switch (speed) {
      case 0:
        return '0d'
      case 5:
        return '1d-4'
      case 10:
        return '1d-2'
      case 15:
        return '1d-1'
      case 20:
      case 25:
        return '1d'
      default:
        return `${speed / 5 - 5}d`
    }
  }

  static resolve({ vehicle, collision }: { vehicle: any; collision: any }) {
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
    // have a game object class
    // let this be a collision of objects.
    // deal.
    /*
    if (collision.rammed.id.match(/vehicle|wall/)) {
      throw new Error(`unknown rammed thing: "${collision}"`)
    }
    */
  }

  static temporarySpeed({ thisDM, otherDM, speed }: { thisDM: any; otherDM: any; speed: number }) {
    if (thisDM <= 0) {
      throw new Error(`invalid DM: ${thisDM}`)
    }
    if (otherDM <= 0) {
      throw new Error(`invalid DM: ${otherDM}`)
    }
    const table =
      // prettier-ignore
      [
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
                [1, 1, 1, 1, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 3 / 4, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2],
            ]
    const row = thisDM >= 1 ? thisDM + 1 : thisDM * 3 - 1
    const column = otherDM >= 1 ? otherDM + 1 : otherDM * 3 - 1
    const unroundedResult = table[row][column] * speed
    return Math.ceil(unroundedResult / 5) * 5 // round up to nearest 5MPH
  }
}

export default Collisions
