export const KillerKart = {
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
    armor: { F: 5, R: 3, L: 3, B: 3, T: 2, U: 2 },
    crew: {
      driver: {
        damagePoints: 3,
        fired_this_turn: false
      }
    },
    power_plant: {
      type: 'medium',
      damagePoints: 8
    },
    tires: [{
      location: 'FL',
      type: 'HD',
      damagePoints: 6
    },
    {
      location: 'FR',
      type: 'HD',
      damagePoints: 6
    },
    {
      location: 'BL',
      type: 'HD',
      damagePoints: 6
    },
    {
      location: 'BR',
      type: 'HD',
      damagePoints: 6
    }],
    weapons: [{
      type: 'machine_gun',
      abbreviation: 'MG',
      location: 'F',
      ammo: 20,
      toHit: 7,
      damage: '1d',
      damagePoints: 3,
      effect: 'area',
      fired_this_turn: false
    },
    {
      type: 'none',
      abbreviation: 'n/a',
      location: 'none',
      ammo: 0,
      toHit: 0,
      damage: '0d',
      damagePoints: 0,
      effect: 'area',
      fired_this_turn: false
    },
    {
      type: 'machine_gun',
      abbreviation: 'MG',
      location: 'R',
      ammo: 20,
      toHit: 7,
      damage: '1d',
      damagePoints: 3,
      effect: 'area',
      fired_this_turn: false
    }
    ]
  }
}
