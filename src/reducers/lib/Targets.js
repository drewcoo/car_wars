import Segment from '../../utils/Segment'
import Point from '../../utils/Point'
import Weapon from './Weapon'
/*
Target = {
  carId: number,
  locationName: string,
  point: Point,
  segment: Segment,
  // ??? hitModifier(s):,
}
*/

class Targets {
  constructor ({ car, cars, map }) {
    this.car = car
    this.cars = cars
    this.walls = map.wallData
  }

  refresh () {
    console.log(this.car)
    console.log(this.car.id)
    console.log(this.car.design.name)
    const weapon = this.car.design.components.weapons[this.car.phasing.weaponIndex]
    const plantDisabled = this.car.design.components.power_plant.dp < 1
    const canFire = Weapon.canFire({ weapon, plantDisabled })
    this.car.phasing.targets = canFire ? this.targetsInArc() : []
    this.car.phasing.targetIndex = 0
  }

  /*
  console.log('fetch targets')
  var targets = new Targets({ car, cars: state, map: map })
  var data = targets.targetsInArc()
  console.log(`targets in arc: ${data[0]}`)
  car.phasing.targets = data || null
  car.phasing.targetIndex = 0
  */

  targetablePoints (target) {
    // var turretLoc = new Segement([target.rect.brPoint(), target.rect.flPoint()]).middle();
    return [
      { carId: target.id, name: 'FR', location: target.rect.frPoint(), displayPoint: target.rect.frPoint() },
      { carId: target.id, name: 'FL', location: target.rect.flPoint(), displayPoint: target.rect.flPoint() },
      { carId: target.id, name: 'BR', location: target.rect.brPoint(), displayPoint: target.rect.brPoint() },
      { carId: target.id, name: 'BL', location: target.rect.blPoint(), displayPoint: target.rect.blPoint() }
    //  { carId: target.id, name: 'turret', location: turretLoc, displayPoint: turretLoc },
    ]
  }

  targetableSides (target) {
    return [
      { carId: target.id, name: 'F', location: target.rect.fSide(), displayPoint: target.rect.fSide().middle() },
      { carId: target.id, name: 'B', location: target.rect.bSide(), displayPoint: target.rect.bSide().middle() },
      { carId: target.id, name: 'L', location: target.rect.lSide(), displayPoint: target.rect.lSide().middle() },
      { carId: target.id, name: 'R', location: target.rect.rSide(), displayPoint: target.rect.rSide().middle() }
    ]
  }

  allTargetableLocations () {
    return this.cars.filter(element => {
      return this.car.id !== element.id
    }).map(element => {
      return this.targetableLocations(element)
    }).flat()
  }
  /// ///////////////////

  // VVV
  allOtherCarRects () {
    return this.cars.filter(element => {
      return this.car.id !== element.id
    }).map(element => {
      return element.rect
    })
  }

  allWallRects () {
    return this.walls.map(element => {
      return element.rect
    })
  }

  allRects () {
    return this.allWallRects().concat(this.allOtherCarRects())
  }

  rectPointsInArc (rect) {
    var firingArc = this.car.design.components.weapons[this.car.phasing.weaponIndex].location
    return rect.points().filter(point => {
      // return this.car.phasing.rect.pointIsInArc({ point: point, arcName: firingArc })
      return (this.car.phasing.rect.arcForPoint(point) === firingArc)
    })
  }

  // FUTURE COMMENT!
  // NOTE: Also use this.car.phasing.rect.arcForPoint(point) to see if the side
  // targeted can target me back - to-hit mod
  // And while we're there, we should add targeted loc plus a hash of modifiers
  // to the targets we return.

  shotBlockedByWall ({ sourcePoint, targetPoint }) {
    var lineToTarget = new Segment([sourcePoint, targetPoint])
    return this.allWallRects().some(function (wallRect) {
      var sides = wallRect.sides()
      return Object.keys(sides).some(function (sideKey) {
        console.log('shot blocked by wall')
        return lineToTarget.intersects(sides[sideKey])
      })
    })
  }

  shotBlockedByCar ({ sourcePoint, targetPoint }) {
    var lineToTarget = new Segment([sourcePoint, targetPoint])
    var allCarRects = this.cars.map(element => { return element.rect })
    return allCarRects.some(function (carRect) {
      return Object.keys(carRect.sides()).some(function (sideKey) {
        console.log('shot blocked by car')
        return lineToTarget.intersects(carRect.side(sideKey))
      })
    })
  }

  shotBlocked ({ sourcePoint, targetPoint, ignore = null }) {
    var lineToTarget = new Segment([sourcePoint, targetPoint])
    return this.allRects().some(function (rect) {
      return Object.keys(rect.sides()).some(function (sideKey) {
        if (ignore !== null && ignore.equals(rect.side(sideKey))) {
          console.log('ignored')
          return false
        }
        if (rect.side(sideKey).intersects(targetPoint)) {
          return false
        }
        return lineToTarget.intersects(rect.side(sideKey))
      })
    })
  }

  /*
targetPointsInArc() {
  //var car = getCurrentCar();
  var weaponLoc = this.car.design.components.weapons[this.car.phasing.weaponIndex].location;
  var sourcePoint = this.car.phasing.rect.side(weaponLoc).middle();

  // .flatMap instead??  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap
  var possible_targets = this.allOtherCarRects().map(rect => {
    return rect.points().filter(point => {
      return (
        //this.car.phasing.rect.pointIsInArc({ point: point, arcName: weaponLoc }) &&
        this.car.phasing.rect.arcForPoint(point) === weaponLoc &&
        !this.shotBlocked({sourcePoint: sourcePoint, targetPoint: point})
      )
    });
  }).flat(); //.reverse();
  return possible_targets;
}
*/

  targetPointsInArc () {
    var weaponLoc = this.car.design.components.weapons[this.car.phasing.weaponIndex].location
    var sourcePoint = this.car.phasing.rect.side(weaponLoc).middle()

    var otherCars = this.cars.filter(element => {
      return this.car.id !== element.id
    })

    var allPoints = otherCars.map(otherCar => {
      return this.targetablePoints(otherCar)
    }).flat()

    console.log(allPoints)

    return allPoints.filter(point => {
      console.log(`${point.location} in arc: ${this.car.phasing.rect.pointIsInArc({ point: point.location, arcName: weaponLoc })}`)
      console.log(`blocked? ${this.shotBlocked({ sourcePoint: sourcePoint, targetPoint: point.location })}`)
      return (
        this.car.phasing.rect.pointIsInArc({ point: point.location, arcName: weaponLoc }) &&
        !this.shotBlocked({ sourcePoint: sourcePoint, targetPoint: point.location })
      )
    })
    /*
    var results = allPoints.filter(point => {
      return (
        this.car.phasing.rect.pointIsInArc({ point: point.location, arcName: weaponLoc }) &&
        !this.shotBlocked({sourcePoint: sourcePoint, targetPoint: point.location})
      )
    });

    return results;
    */
  }

  targetSidesInArc () {
    // var car = getCurrentCar();
    var weaponLoc = this.car.design.components.weapons[this.car.phasing.weaponIndex].location
    var sourcePoint = this.car.phasing.rect.side(weaponLoc).middle()

    console.log(`source point: ${sourcePoint}`)

    var otherCars = this.cars.filter(element => {
      return this.car.id !== element.id
    })

    var allSides = otherCars.map(otherCar => {
      return this.targetableSides(otherCar)
    }).flat()

    // BUGBUG: This is cheating so that I don't need to map out a bunch of
    // triangles in the arc, figuring out what parts are occluded.
    // The cheat is to sample. Pick a higher sample rate to do better
    // and maybe take longer.
    return allSides.filter(side => {
      var slices = 32
      var hits = 0
      for (var i = 1; i < slices; i++) {
        var tryPoint = new Point({
          x: side.location.points[0].x + (side.location.points[1].x - side.location.points[0].x) * (i / slices),
          y: side.location.points[0].y + (side.location.points[1].y - side.location.points[0].y) * (i / slices)
        })
        // if (this.car.phasing.rect.pointIsInArc({ point: tryPoint, arcName: weaponLoc }) &&
        if (this.car.phasing.rect.arcForPoint(tryPoint) === weaponLoc &&
            !this.shotBlocked({ sourcePoint: sourcePoint, targetPoint: tryPoint /* ignore: side.location */ })) {
          hits++
          console.log(`${side.name} point: ${tryPoint}`)
          // Because we don't count end points as intersections.
          // BUGBUG: FIX inersect code to handle corners/ends of segments
          if (hits > 1) { return true }
        }
      }
      return null
    })
  }

  targetsInArc () {
    var weaponLoc = this.car.design.components.weapons[this.car.phasing.weaponIndex].location
    if (weaponLoc === 'none') {
      return []
    }
    var source = this.car.phasing.rect.side(weaponLoc).middle()
    return this.targetPointsInArc().concat(this.targetSidesInArc()).sort(
      (a, b) => source.distanceTo(a.displayPoint) - source.distanceTo(b.displayPoint)
    )
  }
}
export default Targets

/// ////////////////////////////////////
/*

TargetLocation:
carId
name
isSide // point if false
nearestPoint
displayPoint
*/
