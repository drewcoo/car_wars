export const KillerKart = {
  attributes: {
    size: 'subcompact',
    chassis: 'std',
    suspension: 'hvy',
    cost: 3848,
    weight: 2300,
    top_speed: 135,
    acceleration: 10,
    handling_class: 4
  },
  components: {
    armor: { F: 5, R: 3, L: 3, B: 3, T: 2, U: 2 },
    crew: {
      driver: {
        damage_points: 3,
        fired_this_turn: false
      }
    },
    power_plant: {
      type: 'medium',
      damage_points: 8
    },
    tires: [{
      location: 'FL',
      type: 'HD',
      damage_points: 6
    },
    {
      location: 'FR',
      type: 'HD',
      damage_points: 6
    },
    {
      location: 'BL',
      type: 'HD',
      damage_points: 6
    },
    {
      location: 'BR',
      type: 'HD',
      damage_points: 6
    }],
    weapons: [{
      type: 'machine_gun',
      abbreviation: 'MG',
      location: 'F',
      ammo: 20,
      to_hit: 7,
      damage: '1d',
      damage_points: 3,
      effect: 'area',
      fired_this_turn: false
    },
    {
      type: 'none',
      abbreviation: 'n/a',
      location: 'none',
      ammo: 0,
      to_hit: 0,
      damage: '0d',
      damage_points: 0,
      effect: 'area',
      fired_this_turn: false
    },
    {
      type: 'machine_gun',
      abbreviation: 'MG',
      location: 'R',
      ammo: 20,
      to_hit: 7,
      damage: '1d',
      damage_points: 3,
      effect: 'area',
      fired_this_turn: false
    }
    ]
  }
}
