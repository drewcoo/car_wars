export const NULL_WEAPON = () => {
  return {
    type: 'none',
    abbreviation: 'n/a',
    location: 'none',
    ammo: 0,
    toHit: 0,
    damage: '0d',
    damagePoints: 0,
    effect: 'area',
    firedThisTurn: false
  }
}

export const MG = (location) => {
  return {
    type: 'machineGun',
    abbreviation: 'MG',
    location: location,
    ammo: 20,
    toHit: 7,
    damage: '1d',
    damagePoints: 3,
    effect: 'area',
    firedThisTurn: false
  }
}

export const HR = (location) => {
  return {
    type: 'heavyRocket',
    abbreviation: 'HR',
    location: location,
    ammo: 1,
    toHit: 9,
    damage: '3d',
    damagePoints: 2,
    effect: 'burst',
    firedThisTurn: false
  }
}

export const RL = (location) => {
  return {
    type: 'rocketLauncher',
    abbreviation: 'RL',
    location: location,
    ammo: 10,
    toHit: 8,
    damage: '2d',
    damagePoints: 2,
    effect: 'burst',
    firedThisTurn: false
  }
}

export const L = (location) => {
  return {
    type: 'laser',
    abbreviation: 'L',
    location: location,
    ammo: null, // bugbug - negligible drain on plant. Cannot fire if no plant.
    toHit: 6,
    damage: '3d',
    damagePoints: 2,
    effect: 'area',
    firedThisTurn: false
  }
}