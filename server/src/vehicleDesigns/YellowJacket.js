import { NULL_WEAPON, L } from './Weapons'

export const Design = {
  name: 'Yellow Jacket',
  attributes: {
    size: 'subcompact',
    chassis: 'hvy',
    suspension: 'hvy',
    cost: 9998,
    weight: 2400,
    topSpeed: 90,
    acceleration: 5,
    handlingClass: 4,
  },
  components: {
    armor: { F: 5, R: 4, L: 4, B: 5, T: 0, U: 0 },
    crew: {
      role: 'driver',
      firedThisTurn: false,
    },
    powerPlant: {
      type: 'small',
      damagePoints: 5,
    },
    tires: [
      {
        location: 'FL',
        type: 'HD',
        damagePoints: 6,
        wheelExists: true,
      },
      {
        location: 'FR',
        type: 'HD',
        damagePoints: 6,
        wheelExists: true,
      },
      {
        location: 'BL',
        type: 'HD',
        damagePoints: 6,
        wheelExists: true,
      },
      {
        location: 'BR',
        type: 'HD',
        damagePoints: 6,
        wheelExists: true,
      },
    ],
    weapons: [NULL_WEAPON(), L('F')],
  },
}

export default Design
