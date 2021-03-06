import { v4 as uuid } from 'uuid'
import { DATA } from '../DATA'

DATA.players = []

export const typeDef = `
  extend type Mutation {
    addCar(carId: ID!, playerId: ID!): Player
    createPlayer(name: String!, color: String!, id: ID): Player
  }
  extend type Query {
    players: [Player]
    player(id: ID!): Player
  }
  type Player {
    id: ID!
    name: String!
    carIds: [ID]
    color: String!
  }
`

export const resolvers = {
  Query: {
    player: (parent: any, args: any) => {
      return DATA.players.find((el: any) => el.id === args.id)
    },
    players: () => {
      return DATA.players
    },
  },

  Mutation: {
    addCar: (parent: any, args: any) => {
      const player: any = DATA.players.find((player: any) => player.id === args.playerId)
      player.carIds.push(args.carId)
      return player
    },

    createPlayer: (parent: any, args: any) => {
      const newPlayer = {
        id: args.id || uuid(),
        name: args.name,
        carIds: [],
        color: args.color,
      }
      DATA.players.push(newPlayer)
      return newPlayer
    },
  },
}
