class Weapon {
  type: string
  abbreviation: string
  location: string
  ammo: number
  toHit: number
  damage: string
  damagePoints: number
  effect: string
  firedThisTurn: boolean
  requiresPlant: boolean
  constructor ({
    type = 'none',
    abbreviation = 'n/a',
    location = 'none',
    ammo = 0,
    toHit = 0,
    damage = '0d',
    damagePoints = 0,
    effect = 'area',
    firedThisTurn = false,
    requiresPlant = false }:
    { type: string, abbreviation: string, location: string, ammo: number, toHit: number, damage: string, damagePoints: number,
      effect: string, firedThisTurn: boolean, requiresPlant: boolean}) {
    this.type = type
    this.abbreviation = abbreviation
    this.location = location
    this.ammo = ammo
    this.toHit = toHit
    this.damage = damage
    this.damagePoints = damagePoints
    this.effect = effect
    this.firedThisTurn = firedThisTurn
    this.requiresPlant = requiresPlant
  }

  static canFire ({ weapon, plantDisabled }: { weapon: Weapon, plantDisabled: boolean }) {
    return !(
      weapon.location === 'none' ||
      weapon.ammo === 0 ||
      weapon.damagePoints === 0 ||
      weapon.firedThisTurn ||
      (weapon.requiresPlant && plantDisabled)
    )
  }
}
export default Weapon
