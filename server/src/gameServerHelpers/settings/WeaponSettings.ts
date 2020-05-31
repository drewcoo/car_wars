import Dice from '../../utils/Dice'
import Point from '../../utils/geometry/Point'
import Log from '../../utils/Log'
import Character from '../Character'
import Match from '../Match'
import Targets from '../Targets'
import Time from '../Time'
import Vehicle from '../Vehicle'

class WeaponSettings {
  static setTarget({ vehicle, targetIndex }: { vehicle: any, targetIndex: number }) {
    if (targetIndex < 0 || targetIndex >= vehicle.phasing.targets.length) {
      throw new Error(`Target index out of range: ${targetIndex}`)
    }
    vehicle.phasing.targetIndex = targetIndex
    return targetIndex
  }

  static setWeapon({ vehicle, weaponIndex }: { vehicle: any, weaponIndex: number }) {
    if (weaponIndex < 0 || weaponIndex >= vehicle.design.components.weapons.length) {
      throw new Error(`Weapon index out of range: ${weaponIndex}`)
    }

    vehicle.phasing.weaponIndex = weaponIndex
    vehicle.phasing.targets = [] // default targ list ==== empty
    vehicle.phasing.targetIndex = 0

    const crewMemberCanFire = vehicle.design.components.crew.find((crewSlot: any) => {
      ///********************* */
      const crewMember: any = Character.withId({ id: crewSlot.id })


      return crewMember.damagePoints > 1 && !crewMember.firedThisTurn
    })
    const weapon = vehicle.design.components.weapons[vehicle.phasing.weaponIndex]
    const weaponCanFire = WeaponSettings.canFire({
      weapon,
      plant: vehicle.design.components.powerPlant,
    })
    if (crewMemberCanFire && weaponCanFire) {
      const match: any = Match.withId({ id: vehicle.currentMatch })
      const cars = Match.cars({ match })
      const map = match.map
      const targets = new Targets({ car: vehicle, cars, map })
      vehicle.phasing.targets = targets.targetsInArc()
      vehicle.phasing.targetIndex = 0 // BUGBUG: set to last target fired at?
    }
    return weaponIndex
  }

  static finishFiring({ vehicle, match }: { vehicle: any, match: any }) {
    const carIdIndex = match.time.phase.canTarget.indexOf(vehicle.id)
    if (carIdIndex !== -1) {
      match.time.phase.canTarget.splice(carIdIndex, 1)
    }
    

    Time.subphase5FireWeapons({ match })
  }

  static fireWeapon({ vehicle, target }: { vehicle: any, target: any }) {
    Log.info('fire!', vehicle)
    if (!WeaponSettings.passFiringChecks({ vehicle })) {
      Log.info('cannot fire', vehicle)
      return
    }

    // assumes one character per car
    const match: any = Match.withId({ id: vehicle.currentMatch })
    const carIdIndex = match.time.phase.canTarget.indexOf(vehicle.id)
    if (carIdIndex === -1) {
      throw new Error(`car not able to fire: ${vehicle.id} ${vehicle.color}`)
    }
    match.time.phase.canTarget.splice(carIdIndex, 1)

    const weapon = WeaponSettings.itself({ vehicle })

    const toHit = Dice.roll('2d')

    // BUGBUG - where are the modifiers???
    // Calculate server side for here and also for Reticle.jsx

    Log.info(`toHit: ${weapon.toHit} - roll is ${toHit} damage: ${weapon.damage}`, vehicle)

    const damageDice = toHit >= weapon.toHit ? weapon.damage : '0d'
    if (weapon !== null) weapon.ammo--
    Vehicle.driver({ vehicle }).firedThisTurn = true
    weapon.firedThisTurn = true

    const targetVehicle: any = Vehicle.withId({ id: target.id })
    targetVehicle.phasing.damage.push({
      source: {
        character: 'TODO - character ID',
        car: vehicle,
        point: vehicle.phasing.rect.side(weapon.location).middle(),
        weapon: weapon.type,
      },
      target: {
        car: targetVehicle,
        damageDice: damageDice,
        location: target.name,
        point: new Point({
          x: target.x,
          y: target.y,
        }),
      },
      message: '',
    })

    Time.subphase5FireWeapons({ match })
  }
      

  ///////////////////////////////
  static canFire({ weapon, plant }: { weapon: any, plant: any }) {
    const plantDisabled = plant.damagePoints < 1
    return !(
      weapon.location === 'none' ||
      weapon.ammo === 0 ||
      weapon.damagePoints === 0 ||
      weapon.firedThisTurn ||
      (weapon.requiresPlant && plantDisabled)
    )
  }

  static itself({ vehicle }: { vehicle: any }) {
    return vehicle.design.components.weapons[vehicle.phasing.weaponIndex]
  }

  static passFiringChecks({ vehicle }: { vehicle: any }) {
    const weapon = vehicle.design.components.weapons[vehicle.phasing.weaponIndex]
    const crewMemberId = vehicle.design.components.crew.find((member: any) => member.role === 'driver').id
    const crewMember: any = Character.withId({ id: crewMemberId })
    let result = WeaponSettings.canFire({
      weapon,
      plant: vehicle.design.components.powerPlant,
    })

    result = result && !(crewMember.firedThisTurn || crewMember.damagePoints < 1)

    // also check the target?
    return result
  }
}

export default WeaponSettings