import _ from 'lodash'
import uuid from 'uuid/v4'
import { DATA } from '../DATA'
import * as ArenaMap1 from '../maps/arenaMap1'

DATA.maps = []
const loadMap = mapName => {
  if (mapName !== 'ArenaMap1') {
    throw new Error(`${mapName} not found in map names`)
  }
  // I really need to learn some lodash
  // because I don't know where .default came from.
  const result = _.cloneDeep(ArenaMap1).default
  result.id = uuid()
  result.name = mapName
  return result
}

export const typeDef = `
  extend type Mutation {
    addMap(name: String!): Map
  }

  extend type Query {
    maps: [Map]
  }

  type MapSize {
    height: Int!
    width: Int!
  }

  type WallSegment {
    id: ID!
    rect: Rectangle!
  }

  type Map {
    id: ID!
    name: String
    size: MapSize
    startingPositions: [Rectangle]
    wallData: [WallSegment]
  }
`

export const resolvers = {
  Query: {
    maps: () => {
      return DATA.maps
    },
  },

  Mutation: {
    addMap: (parent, args, context) => {
      const newMap = loadMap(args.name)
      newMap.id = uuid()
      DATA.maps.push(newMap)
      return newMap
    },
  },
}
