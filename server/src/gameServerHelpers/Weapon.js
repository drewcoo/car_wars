import Control from './Control'
import Log from '../utils/Log'
import VehicleStatusHelper from './VehicleStatusHelper'

class Weapon {
  static canFire({ weapon, plantDisabled }) {
    return !(
      weapon.location === 'none' ||
      weapon.ammo === 0 ||
      weapon.damagePoints === 0 ||
      weapon.firedThisTurn ||
      (weapon.requiresPlant && plantDisabled)
    )
  }

  static itself({ car }) {
    return car.design.components.weapons[car.phasing.weaponIndex]
  }

  static passFiringChecks({ car }) {
    const weapon = car.design.components.weapons[car.phasing.weaponIndex]
    const crewMember = car.design.components.crew.find(member => member.role === 'driver')
    const plantDisabled = car.design.components.powerPlant.damagePoints < 1

    let result = Weapon.canFire({ weapon, plantDisabled })

    result = result && !(
      crewMember.firedThisTurn ||
      crewMember.damagePoints < 1
    )

// also check the target?

    return result
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

  static dealDamage ({ damage, by, car, location }) {
    Log.info(`${damage} dealt to car ${car.color} at ${location}`, car)
    if (damage < 1) { return }
    car.status.lastDamageBy.push(by.id) // CAR ID - later get character, too
    let hazard = 1
    if (damage >= 6) { hazard = 2 }
    if (damage >= 10) { hazard = 3 }
    // Hazard
    var damageToDeal = damage
    if (location.length === 1) {
      Log.info(`side: ${location}`, car)
      Log.info(`armor there: ${car.design.components.armor[location]}`, car)
      switch (location) {
        case 'F':
          damageToDeal = this.damageArmor({ car, damage, location })
          damageToDeal = this.damageWeapons({ car, damage: damageToDeal, location })
          // Should be able to choose order: [plant, crew, cargo]
          damageToDeal = this.damagePlant({ car, damage: damageToDeal })
          damageToDeal = this.damageCrew({ car, damage: damageToDeal, hazard })
          damageToDeal = this.damageWeapons({ car, damage: damageToDeal, location: 'B' })
          damageToDeal = this.damageArmor({ car, damage: damageToDeal, location: 'B' })
          break
        case 'B':
          damageToDeal = this.damageArmor({ car, damage, location })
          damageToDeal = this.damageWeapons({ car, damage: damageToDeal, location })
          // Should be able to choose order: [plant, crew, cargo]
          damageToDeal = this.damageCrew({ car, damage: damageToDeal, hazard })
          damageToDeal = this.damagePlant({ car, damage: damageToDeal })
          damageToDeal = this.damageWeapons({ car, damage: damageToDeal, location: 'F' })
          damageToDeal = this.damageArmor({ car, damage: damageToDeal, location: 'F' })
          break
        case 'R':
          damageToDeal = this.damageArmor({ car, damage, location })
          damageToDeal = this.damageWeapons({ car, damage: damageToDeal, location })
          damageToDeal = this.damageInterior({ car, damage: damageToDeal, hazard })
          damageToDeal = this.damageWeapons({ car, damage: damageToDeal, location: 'L' })
          damageToDeal = this.damageArmor({ car, damage: damageToDeal, location: 'L' })
          break
        case 'L':
          damageToDeal = this.damageArmor({ car, damage, location })
          damageToDeal = this.damageWeapons({ car, damage: damageToDeal, location })
          damageToDeal = this.damageInterior({ car, damage: damageToDeal, hazard })
          damageToDeal = this.damageWeapons({ car, damage: damageToDeal, location: 'R' })
          damageToDeal = this.damageArmor({ car, damage: damageToDeal, location: 'R' })
          break
        case 'U':
          // BUGBUG: do this
          damageToDeal = this.damageArmor({ car, damage, location })
          damageToDeal = this.damageInterior({ car, damage: damageToDeal, hazard })
          // TURRET? TOP WEAPONS?
          damageToDeal = this.damageArmor({ car, damage: damageToDeal, location: 'T' })
        case 'T':
          // BUGBUG: do this
          damageToDeal = this.damageArmor({ car, damage, location })
          // TURRET? TOP WEAPONS?
          damageToDeal = this.damageInterior({ car, damage: damageToDeal, hazard })
          damageToDeal = this.damageArmor({ car, damage: damageToDeal, location: 'U' })
        default:
          throw new Error(`unknown side: "${location}"`)
      }
    } else if (location.length === 2) {
      damageToDeal = this.damageTire({ car, damage, location, hazard })
    } else {
      throw new Error(`unknown target (name) type: "${location}"`)
    }
    Log.info(`hazard: ${hazard}`, car)
    Control.hazardCheck({ car, hazard })
    Log.info(`${damageToDeal} points of damage blow through!`, car)
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

  static damageTire ({ car, damage, location, hazard }) {
    Log.info(`${damage} damage to ${location} tire`, car)
    var tire = car.design.components.tires.find(function (tire) { return tire.location === location })
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
      if (VehicleStatusHelper.numberOfWheels() === 2) {
        Control.maneuverCheck({ car })
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
      Log.info(remaining, car)
      tire.damagePoints = 0
    }
    if (tire.damagePoints === 0) {
      Log.info(`blowout!`, car)
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

  static damageArmor ({ car, damage, location }) {
    Log.info(`${damage} damage to ${location} armor`, car)
    car.design.components.armor[location] -= damage
    var remaining = 0
    if (car.design.components.armor[location] < 0) {
      remaining = -car.design.components.armor[location]
      car.design.components.armor[location] = 0
    }
    return remaining
  }

  static damageWeapons ({ car, damage, location }) {
    // randomly choose which weapon is hit
    const thisSideWeapons = car.design.components.weapons
      .filter(weapon => weapon.location === location)

    if (thisSideWeapons.length < 1) { return damage }

    const hitWeapon = thisSideWeapons[Math.floor(Math.random() * thisSideWeapons.length)]

    Log.info(`${damage} damage to ${location} ${hitWeapon.abbreviation}`, car)

    hitWeapon.damagePoints -= damage
    let remaining = 0
    if (hitWeapon.damagePoints < 0) {
      remaining = -hitWeapon.damagePoints
      hitWeapon.damagePoints = 0
      Log.info(`destroyed!`, car)
    }
    return remaining
  }

  static damageInterior ({ car, damage, hazard }) {
    if (damage < 1) {
      Log.info('0 damage to interior', car)
      return 0
    }
    // randomly choose plant, crew, or cargo
    // BUGBUG: Not handling cargo yet, so that passes through.
    let remaining = 0
    switch(Math.floor(Math.random() * 2)) {
      case 0:
        remaining = this.damagePlant({ car, damage })
        break
      case 1:
        remaining = this.damageCrew({ car, damage, hazard })
        break
    }
    return remaining
  }

  static damagePlant ({ car, damage }) {
    Log.info(`${damage} damage to plant`, car)
    car.design.components.powerPlant.damagePoints -= damage
    var remaining = 0
    if (car.design.components.powerPlant.damagePoints <= 0) {
      remaining = -car.design.components.powerPlant.damagePoints
      car.design.components.powerPlant.damagePoints = 0
      Log.info(`plant destroyed!`, car)
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
  static damageCrew ({ car, damage, hazard }) {
    if (damage < 1) { return 0 }

    const randomCrewMember = (car) => {
      const keys = Array.from(Object.keys(car.design.components.crew))
      return keys[Math.floor(Math.random() * keys.length)]
    }

    const crewMember = car.design.components.crew[randomCrewMember(car)]
    Log.info(`${damage} damage to crew member: ${crewMember.role}`, car)
    crewMember.damagePoints -= damage

    if (crewMember.damagePoints === 2) {
      // assume driver for now
      // injured
      // - all skills at -2
      hazard += 2
    } else if (crewMember.damagePoints === 1) {
      // unconscious
      // - all skill and reflex bonuses gone
      // assume driver for now
      // - no turning
      hazard += 2
      if (crewMember.role === 'driver') {
        Log.info('driver incapacitated - steering out', car)
        car.status.maneuvers = ['none', 'forward']
      }
    } else if (crewMember.damagePoints < 1) {
      // dead
      // - all skill and reflex bonuses gone
      // assume driver for now
      // - no turning
      hazard += 2
      if (crewMember.role === 'driver') {
        Log.info('driver killed - steering out', car)
        car.status.maneuvers = ['none', 'forward']
      }
    }

    var remaining = 0
    if (crewMember.damagePoints < 0) {
      remaining = -crewMember.damagePoints
      crewMember.damagePoints = 0
    }
    return remaining
  }
}
export default Weapon
