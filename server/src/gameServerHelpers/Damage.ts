import _ from 'lodash'
import Dice from '../utils/Dice'
import Log from '../utils/Log'
import Character from './Character'
import Control from './Control'
import Vehicle from './Vehicle'
import Point from '../utils/geometry/Point'

class Damage {
  static damageAllTires({ car, damageDice }: { car: any; damageDice: string }): void {
    const points = {
      FL: car.rect.flPoint(),
      FR: car.rect.frPoint(),
      BL: car.rect.blPoint(),
      BR: car.rect.brPoint(),
    }
    car.design.components.tires.forEach((tire: any) => {
      const loc: any = tire.location
      const pts: any = points
      const tirePoint: any = pts[loc]
      car.phasing.damage.push({
        target: {
          location: tire.location,
          point: tirePoint,
          damageDice: damageDice,
        },
        message: 'tire damage',
      })
    })
  }

  //
  // Each enemy attack produces a separate hazard. If a vehicle is struck by three
  // weapons in one turn, each attack would
  // move the handling marker down and require a separate die roll on the Control
  // Table. Mines are “enemy fire.” Spikes,
  // debris, obstacles, etc., are not.
  //
  // Enemy fire does 1 to 5 hits of damage: D1.
  // Enemy fire does 6 to 9 hits of damage: D2.
  // Enemy fire does 10+ hits of damage: D3.
  // Driver injured or killed: D2.
  //
  //

  static dealDamage({ damageRecord }: { damageRecord: any }): any {
    const car = damageRecord.target.car
    const damage = (damageRecord.target.damage = Dice.roll(damageRecord.target.damageDice))
    const location = damageRecord.target.location

    Log.info(`${damageRecord.target.damageDice} dealt to car ${car.color} at ${location}`, car)
    if (damage < 1) {
      return
    }
    car.status.lastDamageBy.push(damageRecord.source.car.id) // CAR ID - later get character, too
    let hazard = 1
    if (damage >= 6) {
      hazard = 2
    }
    if (damage >= 10) {
      hazard = 3
    }
    // Hazard
    let damageToDeal = damage
    if (location.length === 1) {
      Log.info(`side: ${location}`, car)
      Log.info(`armor there: ${car.design.components.armor[location]}`, car)
      switch (location) {
        case 'F':
          damageToDeal = this.damageArmor({ car, damage, location })
          damageToDeal = this.damageWeapons({
            car,
            damage: damageToDeal,
            location,
          })
          // Should be able to choose order: [plant, crew, cargo]
          damageToDeal = this.damagePlant({ car, damage: damageToDeal })
          damageToDeal = this.damageCrew({ car, damage: damageToDeal, hazard })
          damageToDeal = this.damageWeapons({
            car,
            damage: damageToDeal,
            location: 'B',
          })
          damageToDeal = this.damageArmor({
            car,
            damage: damageToDeal,
            location: 'B',
          })
          break
        case 'B':
          damageToDeal = this.damageArmor({ car, damage, location })
          damageToDeal = this.damageWeapons({
            car,
            damage: damageToDeal,
            location,
          })
          // Should be able to choose order: [plant, crew, cargo]
          damageToDeal = this.damageCrew({ car, damage: damageToDeal, hazard })
          damageToDeal = this.damagePlant({ car, damage: damageToDeal })
          damageToDeal = this.damageWeapons({
            car,
            damage: damageToDeal,
            location: 'F',
          })
          damageToDeal = this.damageArmor({
            car,
            damage: damageToDeal,
            location: 'F',
          })
          break
        case 'R':
          damageToDeal = this.damageArmor({ car, damage, location })
          damageToDeal = this.damageWeapons({
            car,
            damage: damageToDeal,
            location,
          })
          damageToDeal = this.damageInterior({
            car,
            damage: damageToDeal,
            hazard,
          })
          damageToDeal = this.damageWeapons({
            car,
            damage: damageToDeal,
            location: 'L',
          })
          damageToDeal = this.damageArmor({
            car,
            damage: damageToDeal,
            location: 'L',
          })
          break
        case 'L':
          damageToDeal = this.damageArmor({ car, damage, location })
          damageToDeal = this.damageWeapons({
            car,
            damage: damageToDeal,
            location,
          })
          damageToDeal = this.damageInterior({
            car,
            damage: damageToDeal,
            hazard,
          })
          damageToDeal = this.damageWeapons({
            car,
            damage: damageToDeal,
            location: 'R',
          })
          damageToDeal = this.damageArmor({
            car,
            damage: damageToDeal,
            location: 'R',
          })
          break
        case 'U':
          // BUGBUG: do this
          damageToDeal = this.damageArmor({ car, damage, location })
          damageToDeal = this.damageInterior({
            car,
            damage: damageToDeal,
            hazard,
          })
          // TURRET? TOP WEAPONS?
          damageToDeal = this.damageArmor({
            car,
            damage: damageToDeal,
            location: 'T',
          })
          break
        case 'T':
          // BUGBUG: do this
          damageToDeal = this.damageArmor({ car, damage, location })
          // TURRET? TOP WEAPONS?
          damageToDeal = this.damageInterior({
            car,
            damage: damageToDeal,
            hazard,
          })
          damageToDeal = this.damageArmor({
            car,
            damage: damageToDeal,
            location: 'U',
          })
          break
        default:
          throw new Error(`unknown side: "${location}"`)
      }
    } else if (location.length === 2) {
      damageToDeal = this.damageTire({ car, damage, location, hazard })
    } else {
      throw new Error(`unknown target (name) type: "${location}"`)
    }
    Log.info(`hazard: ${hazard}`, car)
    Control.hazardCheck({ vehicle: car, difficulty: hazard })
    Log.info(`${damageToDeal} points of damage blow through!`, car)
    return damageRecord
  }

  // If the final damage that destroys the tire
  // comes from mines, grenades or enemy gunfire, then the entire wheel is considered lost.
  // A vehicle that loses all its wheels in
  // one position (usually just one wheel,
  // but 6-wheeled vehicles can have paired
  // rear wheels) has its HC reduced by 3
  // permanently, starting on the next turn. If
  // only the tire(s) are lost, HC drops by only
  // 2. This loss will affect the number of points
  // of handling status recovered each turn; see
  // below.
  // Any vehicle that loses wheels on two
  // corners (or any trike or cycle that loses
  // one wheel) goes to Crash Table 1. It can
  // no longer steer, accelerate, or brake

  //
  // Losing the first wheel or tire of a pair
  // is a D2 hazard. If a vehicle has more than
  // one wheel at that corner, all wheels must
  // be intact (though tires may be damaged or
  // lost), or handling class is reduced by 3.
  //
  // Losing the last wheel or tire on a corner drops the vehicle’s handling status to
  // −6 immediately. Handling class drops by
  // 2 if only the tire(s) are lost, or by 3 if the
  // whole wheel was lost. Treat losing the last
  // wheel or tire on a corner as a D6 hazard
  // for the crash table roll.
  //
  // Any vehicle that loses wheels on two
  // corners (or any trike or cycle that loses
  // one wheel) goes to Crash Table 1. It can
  // no longer steer, accelerate, or brake.
  //

  static damageTire({
    car,
    damage,
    location,
    hazard,
  }: {
    car: any
    damage: number
    location: string
    hazard: number
  }): number {
    Log.info(`${damage} damage to ${location} tire`, car)
    const tire = car.design.components.tires.find((tire: any) => {
      return tire.location === location
    })
    Log.info(`tire has ${tire.damagePoints} DP`, car)
    if (tire.damagePoints === 0) {
      if (tire.wheelExists) {
        tire.wheelExists = false
        car.design.handlingClass -= 1

        //
        //
        //
        // BUGBUG - is that it?
        // shoot a wheel with 0DP and just lose perm HC?
        // show anything else?
      }

      // This is when a car first loses two wheels.
      if (Vehicle.numberOfWheels({ vehicle: car }) === 2) {
        Control.maneuverCheck({ vehicle: car })
      }

      // nothing to damage
      hazard = 0
      return damage
    }
    // deal w/ handling on hit?
    let remaining = 0
    tire.damagePoints -= damage
    // no blowthrough?
    if (tire.damagePoints < 0) {
      remaining = -tire.damagePoints
      Log.info(`${remaining}`, car)
      tire.damagePoints = 0
    }
    if (tire.damagePoints === 0) {
      Log.info('blowout!', car)
      // assume 4 tires
      // BUGBUG: HANDLE 2 CORNERS GONE!!!

      // BUGBUG: NEED TO DENOTE TIRE OR WHEEL LOSS
      // Becuase it's possible to lose all tires but not wheels and still move around.
      // That would mean permanent HC -8 (2 per corner)
      //
      // maybe display wheel only in yellow and wheel gone in red?
      tire.wheelExists = false
      car.design.handlingClass -= 3 // p. 9
      //  car.status.handling = -3
      hazard += 3 // assume entire corner gone; assume car; 2 for the tire/3 for the wheel
    }
    return remaining
  }

  static damageArmor({ car, damage, location }: { car: any; damage: number; location: string }): number {
    Log.info(`${damage} damage to ${location} armor`, car)
    car.design.components.armor[location] -= damage
    let remaining = 0
    if (car.design.components.armor[location] < 0) {
      remaining = -car.design.components.armor[location]
      car.design.components.armor[location] = 0
    }
    return remaining
  }

  static damageWeapons({ car, damage, location }: { car: any; damage: number; location: string }): number {
    // randomly choose which weapon is hit
    const thisSideWeapons = car.design.components.weapons.filter((weapon: any) => weapon.location === location)

    if (thisSideWeapons.length < 1) {
      return damage
    }

    const hitWeapon = thisSideWeapons[Math.floor(Math.random() * thisSideWeapons.length)]

    Log.info(`${damage} damage to ${location} ${hitWeapon.abbreviation}`, car)

    hitWeapon.damagePoints -= damage
    let remaining = 0
    if (hitWeapon.damagePoints < 0) {
      remaining = -hitWeapon.damagePoints
      hitWeapon.damagePoints = 0
      Log.info('destroyed!', car)
    }
    return remaining
  }

  static damageInterior({ car, damage, hazard }: { car: any; damage: number; hazard: number }): number {
    if (damage < 1) {
      Log.info('0 damage to interior', car)
      return 0
    }
    // randomly choose plant, crew, or cargo
    // BUGBUG: Not handling cargo yet, so that passes through.
    let remaining = 0
    switch (Math.floor(Math.random() * 2)) {
      case 0:
        remaining = this.damagePlant({ car, damage })
        break
      case 1:
        remaining = this.damageCrew({ car, damage, hazard })
        break
    }
    return remaining
  }

  static damagePlant({ car, damage }: { car: any; damage: number }): number {
    Log.info(`${damage} damage to plant`, car)
    car.design.components.powerPlant.damagePoints -= damage
    let remaining = 0
    if (car.design.components.powerPlant.damagePoints <= 0) {
      remaining = -car.design.components.powerPlant.damagePoints
      car.design.components.powerPlant.damagePoints = 0
      Log.info('plant destroyed!', car)
    }
    return remaining
  }

  // BUGBUG: handle driver injury effects
  // BUGBUG: Also pp.29-30 has details about hitting random crew. Current
  // design doesn't support that.
  //
  //    role: String!
  //    damagePoints: Int!
  //    firedThisTurn: Boolean!
  //
  // if a vehicle’s driver is wounded or killed, it
  // is a D2 hazard. A wounded crew member’s
  // skills are at −2. When a vehicle’s driver is
  // unconscious, dead, or stunned, all Driver
  // skill and reflex bonuses are lost until the
  // driver recovers (if possible).
  //
  // If a motorcycle’s driver is killed or
  // knocked unconscious, the cycle goes to
  // Crash Table 1 immediately, adding 4 to its
  // roll. Any passengers must jump or suffer
  // the consequences of the roll. Any other
  // ground vehicle (including a cycle with a
  // sidecar) will continue in a straight line if
  // the driver is incapacitated. It decelerates
  // 5 mph each turn, moving in a straight line
  // until it stops or hits something.
  //
  //
  static damageCrew({ car, damage, hazard }: { car: any; damage: number; hazard: number }): number {
    if (damage < 1) {
      return 0
    }

    const randomCrewSlot = (car: any): any => {
      const crew = car.design.components.crew
      return crew[_.random(0, crew.length - 1)]
    }

    const crewSlot = randomCrewSlot(car)
    const character = Character.withId({ id: crewSlot.id })
    Log.info(`${damage} damage: ${character.role}`, character)
    character.damagePoints -= damage

    const isDriver = crewSlot.role === 'driver'
    if (character.damagePoints === 2) {
      // injured - all skills at -2
      if (isDriver) {
        hazard += 2
      }
      Log.info('injured', character)
    } else if (character.damagePoints === 1) {
      // unconscious - all skill and reflex bonuses gone
      if (isDriver) {
        hazard += 2
      }
      Log.info('unconscious', character)
      if (isDriver) {
        Log.info('steering out', car)
        car.status.maneuvers = ['none', 'straight']
      }
    } else if (character.damagePoints < 1) {
      // dead - all skill and reflex bonuses gone
      Log.info('killed', character)
      if (isDriver) {
        hazard += 2
        Log.info('steering out', car)
        car.status.maneuvers = ['none', 'straight']
      }
    }

    let remaining = 0
    if (character.damagePoints < 0) {
      remaining = -character.damagePoints
      character.damagePoints = 0
    }
    return remaining
  }
}
export default Damage
