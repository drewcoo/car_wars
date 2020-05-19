import { makeExecutableSchema } from 'graphql-tools'
import resolvers from './resolvers'
import { typeDef as Car } from './types/Car'
import { typeDef as Character } from './types/Character'
import { typeDef as Geometry } from './types/Geometry'
import { typeDef as Map } from './types/Map'
import { typeDef as Match } from './types/Match'
import { typeDef as Player } from './types/Player'

const typeDefs = [
  `
    type Query {
        points: [Point]
        rectangles: [Rectangle]
    }
    type Mutation {
      addPoint(point: InputPoint!): Point
    }
    type Subscription {
      placeholder: Int
    }
`,
]

typeDefs.push(Car)
typeDefs.push(Character)
typeDefs.push(Geometry)
typeDefs.push(Map)
typeDefs.push(Match)
typeDefs.push(Player)

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  // the following stops this warning:
  // Type "PointOrSegment" is missing a "__resolveType" resolver.
  // Pass false into "resolverValidationOptions.requireResolversForResolveType"
  // to disable this warning.
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
  playground: {
    endpoint: '/graphql',
    settings: {
      'editor.theme': 'light',
    },
  },
})

export default schema
