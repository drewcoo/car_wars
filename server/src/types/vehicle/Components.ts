export const typeDef = `
  type Components {
    armor: Armor!
    crew: [CrewMember!]
    powerPlant: PowerPlant!
    tires: [Tire!]
    weapons: [Weapon]
  }

  """
  child component types
  """

  type Armor {
    type: String
    F: Int!
    R: Int!
    L: Int!
    B: Int!
    T: Int!
    U: Int!
  }

  type CrewMember {
    id: ID
    role: String!
  }

  type PowerPlant {
    damagePoints: Int!
    maxDamagePoints: Int!
    type: String!
  }

  type Tire {
    damagePoints: Int!
    maxDamagePoints: Int!
    location: String!
    type: String!
    wheelExists: Boolean!
  }

  type Weapon {
    abbreviation: String!
    ammo: Int
    damage: String!
    damagePoints: Int!
    maxDamagePoints: Int!
    effect: String!
    firedThisTurn: Boolean!
    location: String!
    requiresPlant: Boolean!
    toHit: Int!
    type: String!
  }
`
