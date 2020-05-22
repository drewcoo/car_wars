import Segment from '../utils/geometry/Segment'
import Point from '../utils/geometry/Point'
import Weapon from './Weapon'

class Targets {
  constructor({ car, cars, map }) {
    this.car = car
    this.cars = cars
    this.walls = map.wallData
  }

  refresh() {
    const weapon = this.car.design.components.weapons[this.car.phasing.weaponIndex]
    const canFire = Weapon.canFire({
      weapon,
      plant: this.car.design.components.powerPlant,
    })
    this.car.phasing.targets = canFire ? this.targetsInArc() : []
    this.car.phasing.targetIndex = 0
  }

  targetablePoints(target) {
    // var turretLoc = new Segement([target.rect.brPoint(), target.rect.flPoint()]).middle();
    return [
      {
        carId: target.id,
        name: 'FR',
        location: target.rect.frPoint(),
        displayPoint: target.rect.frPoint(),
      },
      {
        carId: target.id,
        name: 'FL',
        location: target.rect.flPoint(),
        displayPoint: target.rect.flPoint(),
      },
      {
        carId: target.id,
        name: 'BR',
        location: target.rect.brPoint(),
        displayPoint: target.rect.brPoint(),
      },
      {
        carId: target.id,
        name: 'BL',
        location: target.rect.blPoint(),
        displayPoint: target.rect.blPoint(),
      },
      //  { carId: target.id, name: 'turret', location: turretLoc, displayPoint: turretLoc },
    ]
  }

  targetableSides(target) {
    return [
      {
        carId: target.id,
        name: 'F',
        location: target.rect.fSide(),
        displayPoint: target.rect.fSide().middle(),
      },
      {
        carId: target.id,
        name: 'B',
        location: target.rect.bSide(),
        displayPoint: target.rect.bSide().middle(),
      },
      {
        carId: target.id,
        name: 'L',
        location: target.rect.lSide(),
        displayPoint: target.rect.lSide().middle(),
      },
      {
        carId: target.id,
        name: 'R',
        location: target.rect.rSide(),
        displayPoint: target.rect.rSide().middle(),
      },
    ]
  }

  allTargetableLocations() {
    return this.cars
      .filter(element => this.car.id !== element.id)
      .map(element => this.targetableLocations(element))
      .flat()
  }

  allOtherCarRects() {
    return this.cars.filter(element => this.car.id !== element.id).map(element => element.rect)
  }

  allWallRects() {
    return this.walls.map(element => element.rect)
  }

  allRects() {
    return this.allWallRects().concat(this.allOtherCarRects())
  }

  rectPointsInArc(rect) {
    const firingArc = this.car.design.components.weapons[this.car.phasing.weaponIndex].location
    return rect.points().filter(point => {
      return this.car.phasing.rect.arcForPoint(point) === firingArc
    })
  }

  // FUTURE COMMENT!
  // NOTE: Also use this.car.phasing.rect.arcForPoint(point) to see if the side
  // targeted can target me back - to-hit mod
  // And while we're there, we should add targeted loc plus a hash of modifiers
  // to the targets we return.

  shotBlocked({ sourcePoint, targetPoint, ignore = null }) {
    const lineToTarget = new Segment([sourcePoint, targetPoint])
    return this.allRects().some(rect => {
      return Object.keys(rect.sides()).some(sideKey => {
        if (ignore !== null && ignore.equals(rect.side(sideKey))) {
          return false
        }
        if (rect.side(sideKey).intersects(targetPoint)) {
          return false
        }
        return lineToTarget.intersects(rect.side(sideKey))
      })
    })
  }

  targetPointsInArc() {
    const weaponLoc = this.car.design.components.weapons[this.car.phasing.weaponIndex].location
    const sourcePoint = this.car.phasing.rect.side(weaponLoc).middle()
    const otherCars = this.cars.filter(element => this.car.id !== element.id)
    const allPoints = otherCars.map(car => this.targetablePoints(car)).flat()

    return allPoints.filter(point => {
      return (
        this.car.phasing.rect.pointIsInArc({
          point: point.location,
          arcName: weaponLoc,
        }) &&
        !this.shotBlocked({
          sourcePoint: sourcePoint,
          targetPoint: point.location,
        })
      )
    })
  }

  targetSidesInArc() {
    const weaponLoc = this.car.design.components.weapons[this.car.phasing.weaponIndex].location
    const sourcePoint = this.car.phasing.rect.side(weaponLoc).middle()
    const otherCars = this.cars.filter(element => this.car.id !== element.id)
    const allSides = otherCars.map(car => this.targetableSides(car)).flat()

    // BUGBUG: This is cheating so that I don't need to map out a bunch of
    // triangles in the arc, figuring out what parts are occluded.
    // The cheat is to sample. Pick a higher sample rate to do better
    // and maybe take longer.
    return allSides.filter(side => {
      const slices = 32
      let hits = 0
      for (let i = 1; i < slices; i++) {
        const tryPoint = new Point({
          x: side.location.points[0].x + (side.location.points[1].x - side.location.points[0].x) * (i / slices),
          y: side.location.points[0].y + (side.location.points[1].y - side.location.points[0].y) * (i / slices),
        })
        if (
          this.car.phasing.rect.arcForPoint(tryPoint) === weaponLoc &&
          !this.shotBlocked({
            sourcePoint: sourcePoint,
            targetPoint: tryPoint /* ignore: side.location */,
          })
        ) {
          hits++
          // Because we don't count end points as intersections.
          // BUGBUG: FIX inersect code to handle corners/ends of segments
          if (hits > 1) {
            return true
          }
        }
      }
      return null
    })
  }

  targetsInArc() {
    const weaponLoc = this.car.design.components.weapons[this.car.phasing.weaponIndex].location
    if (weaponLoc === 'none') {
      return []
    }
    const source = this.car.phasing.rect.side(weaponLoc).middle()
    return this.targetPointsInArc()
      .concat(this.targetSidesInArc())
      .sort((a, b) => source.distanceTo(a.displayPoint) - source.distanceTo(b.displayPoint))
  }
}
export default Targets