class Weapon {
  static canFire({ weapon, plantDisabled }) {
    return !(
      // weapon unable to fire
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
      // crew member unable to fire
      crewMember.firedThisTurn ||
      crewMember.damagePoints < 1
    )

// also check the target?

    return result
  }

  static dealDamage ({ damage, car, location }) {
    console.log(`${damage} dealt to car ${car.id} at ${location}`)
    if (location.length === 1) {
      console.log(`side: ${location}`)
      console.log(`armor there: ${car.design.components.armor[location]}`)
      var damageToDeal = damage
      switch (location) {
        case 'F':
          damageToDeal = this.damageArmor({ car, damage, location })
          damageToDeal = this.damageWeapons({ car, damage: damageToDeal, location })
          damageToDeal = this.damagePlant({ car, damage: damageToDeal })
          damageToDeal = this.damageCrew({ car, damage: damageToDeal })
          damageToDeal = this.damageWeapons({ car, damage: damageToDeal, location: 'B' })
          damageToDeal = this.damageArmor({ car, damage: damageToDeal, location: 'B' })
          break
        case 'B':
          damageToDeal = this.damageArmor({ car, damage, location })
          damageToDeal = this.damageWeapons({ car, damage: damageToDeal, location })
          damageToDeal = this.damagePlant({ car, damage: damageToDeal })
          damageToDeal = this.damageCrew({ car, damage: damageToDeal })
          damageToDeal = this.damageWeapons({ car, damage: damageToDeal, location: 'F' })
          damageToDeal = this.damageArmor({ car, damage: damageToDeal, location: 'F' })
          break
        case 'R':
          damageToDeal = this.damageArmor({ car, damage, location })
          damageToDeal = this.damageWeapons({ car, damage: damageToDeal, location })
          // BUGBUG: assumes no cargo
          if (Math.floor(Math.random() * 2)) {
            damageToDeal = this.damagePlant({ car, damage: damageToDeal })
          } else {
            damageToDeal = this.damageCrew({ car, damage: damageToDeal })
          }
          damageToDeal = this.damageWeapons({ car, damage: damageToDeal, location: 'L' })
          damageToDeal = this.damageArmor({ car, damage: damageToDeal, location: 'L' })
          break
        case 'L':
          damageToDeal = this.damageArmor({ car, damage, location })
          damageToDeal = this.damageWeapons({ car, damage: damageToDeal, location })
          // BUGBUG: assumes no cargo
          if (Math.floor(Math.random() * 2)) {
            damageToDeal = this.damagePlant({ car, damage: damageToDeal })
          } else {
            damageToDeal = this.damageCrew({ car, damage: damageToDeal })
          }
          damageToDeal = this.damageWeapons({ car, damage: damageToDeal, location: 'R' })
          damageToDeal = this.damageArmor({ car, damage: damageToDeal, location: 'R' })
          break
        case 'U':
        case 'T':
        default:
          throw new Error(`unknown side: "${location}"`)
      }
    } else if (location.length === 2) {
      this.damageTire({ car, damage, location })
    } else {
      throw new Error(`unknown target (name) type: "${location}"`)
    }
    console.log(`${damageToDeal} points of damage blow through!`)
  }

  static damageTire ({ car, damage, location }) {
    var tire = car.design.components.tires.find(function (tire) { return tire.location === location })
    // deal w/ handling on hit?
    tire.damagePoints -= damage
    // no blowthrough?
    if (tire.damagePoints < 0) { tire.damagePoints = 0 }
  }

  static damageArmor ({ car, damage, location }) {
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

    hitWeapon.damagePoints -= damage
    let remaining = 0
    if (hitWeapon.damagePoints < 0) {
      remaining = -hitWeapon.damagePoints
      hitWeapon.damagePoints = 0
    }
    return remaining
  }

  static damagePlant ({ car, damage }) {
    car.design.components.powerPlant.damagePoints -= damage
    var remaining = 0
    if (car.design.components.powerPlant.damagePoints < 0) {
      remaining = -car.design.components.powerPlant.damagePoints
      car.design.components.powerPlant.damagePoints = 0
    }
    return remaining
  }

  // BUGBUG: handle driver injury effects
  // BUGBUG: Also pp.29-30 has details about hitting random crew. Current
  // design doesn't support that.
  static damageCrew ({ car, damage }) {
    if (damage < 1) { return 0 }
    const randomCrewMember = (car) => {
      const keys = Array.from(Object.keys(car.design.components.crew))
      return keys[Math.floor(Math.random() * keys.length)]
    }

    const crewMember = car.design.components.crew[randomCrewMember(car)]
    console.log(`${damage} damage to crew member: ${crewMember.role}`)
    crewMember.damagePoints -= damage

    if (crewMember.damagePoints === 2) {
      // injured
      // - all skills at -2
      // assume driver for now
      // - D2 hazard
    } else if (crewMember.damagePoints === 1) {
      // unconscious
      // - all skill and reflex bonuses gone
      // assume driver for now
      // - no turning
      // - D2 hazard
      if (crewMember.role === 'driver') {
        console.log('driver incapacitated - steering out')
        car.status.maneuvers = ['none', 'forward']
      }
    } else if (crewMember.damagePoints < 1) {
      // dead
      // - all skill and reflex bonuses gone
      // assume driver for now
      // - no turning
      // - D2 hazard
      if (crewMember.role === 'driver') {
        console.log('driver killed - steering out')
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