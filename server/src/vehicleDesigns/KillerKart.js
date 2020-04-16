import { NULL_WEAPON, MG, HR, RL, L } from './Weapons'

export const Design = {
  name: 'Killer Kart',
  attributes: {
    size: 'subcompact',
    chassis: 'std',
    suspension: 'hvy',
    cost: 3848,
    weight: 2300,
    topSpeed: 135,
    acceleration: 10,
    handlingClass: 4
  },
  components: {
    armor: { type: 'standard', F: 5, R: 3, L: 3, B: 3, T: 2, U: 2 },
    crew: [{
      role: 'driver',
      damagePoints: 3,
      firedThisTurn: false
    }],
    powerPlant: {
      type: 'medium',
      damagePoints: 8
    },
    tires: [{
      damagePoints: 6,
      location: 'FL',
      type: 'HD',
      wheelExists: true
    },
    {
      damagePoints: 6,
      location: 'FR',
      type: 'HD',
      wheelExists: true
    },
    {
      damagePoints: 6,
      location: 'BL',
      type: 'HD',
      wheelExists: true
    },
    {
      damagePoints: 6,
      location: 'BR',
      type: 'HD',
      wheelExists: true
    }],
    weapons: [
      NULL_WEAPON(),
      MG('F'),
      RL('R'),
      HR('B'),
      L('L')
    ]
  }
}

export default Design
