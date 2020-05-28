import { v4 as uuid } from 'uuid'
import { DATA } from '../DATA'

DATA.characters = []

export const typeDef = `
  extend type Mutation {
    improveSkill(id: ID!, name: String!, points: Int!): Character
    createCharacter(id: ID, name: String!, playerId: ID!): Character
  }
  
  extend type Query {
    characters: [Character]
    character(id: ID!): Character
  }

  type Character {
    damagePoints: Int!
    maxDamagePoints: Int!
    equipment: [PersonalEquipment]
    firedThisTurn: Boolean
    id: ID!
    inVehicleId: ID
    log: [String]
    name: String!
    matchId: ID
    playerId: ID!
    prestige: Int!
    reflexRoll: Int
    reflexTieBreaker: Int
    skills: [Skill]
    wealth: Float!
  }

  type PersonalEquipment {
    name: String!
    weight: Int!
  }

  type Skill {
    name: String!
    points: Int!
  }
`

export const resolvers = {
  Query: {
    character: (parent: any, args: any) /*: Character*/ => {
      return DATA.characters.find((element: any) => element.id === args.id)
    },
    characters: () /*: Character[]*/ => {
      return DATA.characters
    },
  },

  Mutation: {
    createCharacter: (parent: any, args: any) /*: Character*/ => {
      const newCharacter = {
        damagePoints: 3,
        maxDamagePoints: 3,
        firedThisTurn: false,
        equipment: [],
        id: args.id || uuid(),
        inVehicleId: null,
        log: [],
        matchId: args.matchId,
        name: args.name,
        playerId: args.playerId,
        prestige: 0,
        reflexRoll: null, // roll at beginning of combat
        reflexTieBreaker: null, // also at beginning of combat
        skills: [
          // { name: 'areaKnowledge', points: 10}, // home town (p. 38)
          { name: 'climbing', points: 10 },
          { name: 'computerTech', points: 0 },
          { name: 'cyclist', points: 0 },
          { name: 'driver', points: 0 },
          { name: 'fastTalk', points: 0 },
          { name: 'general', points: 30 }, // points to be spent on gaining skills
          { name: 'gunner', points: 0 },
          { name: 'handgunner', points: 0 },
          { name: 'luck', points: 0 },
          { name: 'martialArts', points: 0 },
          { name: 'mechanic', points: 0 },
          { name: 'paramedic', points: 0 },
          { name: 'running', points: 10 },
          { name: 'security', points: 0 },
          { name: 'streetwise', points: 0 },
        ],
        wealth: 0,
      }

      DATA.characters.push(newCharacter)
      return newCharacter
    },

    improveSkill: (parent: any, args: any) /*: Character*/ => {
      const character = DATA.characters.find((element: any) => element.id === args.id)
      const skill = character.skills.find((element: any) => element.name === args.name)
      if (!skill) {
        throw new Error(`improveSkill: skill not found: ${args.skill}`)
      }
      let general = character.skills.find((element: any) => element.name === 'general')
      if (general < args.points) {
        throw new Error(`improveSkill: only ${general} general points, not ${args.points}`)
      }
      general += args.points
      return character
    },
  },
}
