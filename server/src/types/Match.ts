import { PubSub } from 'apollo-server-express'
import { withFilter } from 'graphql-subscriptions'
import _ from 'lodash'
import { v4 as uuid } from 'uuid'
import { DATA } from '../DATA'
import Match from '../gameServerHelpers/Match'
import Time from '../gameServerHelpers/Time'
import Vehicle from '../gameServerHelpers/Vehicle'

DATA.matches = []

const pubsub = new PubSub()

export const typeDef = `
  extend type Mutation {
    
    addMatch: Match
    createCompleteMatch(mapName: String!, playerAndDesign: [CarInput!]): Match
    matchAddCar(matchId: ID!, carId: ID!): Match
    matchSetMap(matchId: ID! mapName: String!): Match
    startMatch(matchId: ID!): Match
    finishMatch(matchId: ID!): Match
    ackDamage(matchId: ID!, playerId: ID!): Int
    ackSpeedChange(matchId: ID!, playerId: ID!): Int
    sayNothing(matchId: ID!, msg: String!): String!
  }

  input CarInput{
    name: String!
    playerName: String!
    playerId: String
    playerColor: String!
    designName: String!
  }

  extend type Query {
    completeMatchData(matchId: ID!): AllData
    matches: [Match]
    match(matchId: ID!): Match
    nothings(matchId: ID!): [LittleNothing]
    setupOptions: SetupOptions
  }

  extend type Subscription {
    nothingChannel(matchId: ID!): LittleNothing
  }

  type LittleNothing {
    id: ID!
    previousId: ID!
    timestamp: String!
    matchId: ID!
    msg: String!
  }

  type AllData {
    match: Match
    cars: [Car!]
    characters: [Character!]
    players: [Player!]
  }

  type Match {
    name: String
    id: ID!
    carIds: [ID]
    characterIds: [ID]
    map: Map
    status: String
    time: MatchTime
  }

  type MatchTime {
    phase: Phase
    turn: Turn
  }

  type Phase {
    number: Int!
    subphase: String
    moving: ID
    unmoved: [ID]
    canTarget: [ID]
    playersToAckDamage: [ID]
    playersToAckSpeedChange: [ID]
  }
  
  type Turn {
    number: Int!
    movesByPhase: [[PerPhaseMoves]]
  }

  type PerPhaseMoves {
    absSpeed: Int
    movers: [Movers]
  }

  type Movers {
    id: String
    color: String
    distance: Float
    speed: Int
    reflexRoll: Int
    reflexTieBreaker: Int
  }

  type SetupOptions {
    designs: [Design]
  }
`

const allTheNothings: any = {}

const NOTHING_CHANNEL = 'nothing_channel'

const addNothing = ({ matchId, msg }: { matchId: string; msg: string }) => {
  const id = uuid()
  let previousId = ''
  if (allTheNothings[matchId] && allTheNothings[matchId].length > 0) {
    previousId = allTheNothings[matchId][allTheNothings[matchId].length - 1].id
  }
  const timestamp = `${Date.now()}`
  pubsub.publish(NOTHING_CHANNEL, {
    nothingChannel: { id, previousId, timestamp, matchId, msg },
  })
  if (!allTheNothings[matchId]) {
    allTheNothings[matchId] = []
  }
  allTheNothings[matchId].push({ id, previousId, timestamp, msg })
  return timestamp
}

export const resolvers = {
  Query: {
    match: (parent: any, args: any) => {
      return Match.withId({ id: args.matchId })
    },

    matches: () => {
      return DATA.matches
    },

    nothings: (parent: any, args: any) => {
      if (!allTheNothings[args.matchId]) {
        return []
      }
      return allTheNothings[args.matchId]
    },

    setupOptions: () => {
      return { designs: DATA.designs }
    },
  },

  Subscription: {
    nothingChannel: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(NOTHING_CHANNEL),
        (payload, variables) => {
          if (variables.matchId === '*') return true
          return payload.nothingChannel.matchId === variables.matchId
        },
      ),
    },
  },

  Mutation: {
    sayNothing: (parent: any, args: any) => {
      return addNothing({ matchId: args.matchId, msg: args.msg })
    },

    addMatch: (parent: any, args: any) => {
      const newMatch = {
        id: uuid(),
        carIds: [],
        characterIds: [],
        map: null,
        status: 'new',
        time: {
          phase: {
            number: 5,
            moving: null,
            subphase: '1_start',
            unmoved: [],
            canTarget: [],
            playersToAckDamage: [],
            playersToAckSpeedChange: [],
          },
          turn: {
            number: 0,
            movesByPhase: [[], [], [], [], []],
          },
        },
      }
      DATA.matches.push(newMatch)
      return newMatch
    },

    matchSetMap: (parent: any, args: any) => {
      const match = Match.withId({ id: args.matchId })
      if (!match) {
        throw new Error(`Match does not exist: ${args.matchId}`)
      }
      const originalMap = DATA.maps.find((element: any) => element.name === args.mapName)
      if (!originalMap) {
        throw new Error(`Map does not exist: ${args.mapName}`)
      }
      if (match.carIds !== undefined) {
        if (match.carIds.length > originalMap.startingPositions.length) {
          throw new Error(`Map only supports ${originalMap.startingPositions.length} starting positions`)
        }
      }
      match.map = _.cloneDeep(originalMap)
      return match
    },

    matchAddCar: (parent: any, args: any) => {
      const match = Match.withId({ id: args.matchId })
      if (match === undefined) {
        throw new Error(`match not found: ${args.matchId}`)
      }
      if (match.carIds === undefined) {
        throw new Error('match.carIds undefined')
      }
      const car = Vehicle.withId({ id: args.carId })
      if (undefined === car) {
        throw new Error(`Car does not exist: ${args.carId}`)
      }
      if (match.map !== null && match.carIds.length >= match.map.startingPositions.length) {
        throw new Error(`Map only has ${match.map.startingPositions.length} starting positions`)
      }

      match.carIds.push(args.carId)

      // add crew in cars
      car.design.components.crew.forEach((crewMember: any) => {
        match.characterIds.push(crewMember.id)
      })

      Vehicle.withId({ id: args.carId }).currentMatch = args.matchId
      return match
    },

    startMatch: (parent: any, args: any) => {
      const match = Match.withId({ id: args.matchId })
      if (!match) {
        throw new Error(`Match does not exist: ${args.matchId}`)
      }
      if (match.status !== 'new') {
        throw new Error('Restart match?')
      }
      Time.matchStart({ match })
      return match
    },

    finishMatch: (parent: any, args: any) => {
      const match = Match.withId({ id: args.matchId })
      if (!match) {
        throw new Error(`Match does not exist: ${args.matchId}`)
      }
      // for ameteur night:
      // - remove all characters from vehicles
      // - move all vehicles in current state to winner
      // generally:
      // - privateering
      // - prizes
      match.carIds.map((carId: string) => {
        Vehicle.withId({ id: carId }).currentMatch = null
      })
      match.status = 'finished'
      return match
    },

    ackDamage: (parent: any, args: any) => {
      const match = Match.withId({ id: args.matchId })
      _.pull(match.time.phase.playersToAckDamage, args.playerId)
      Time.subphase6Damage({ match })
    },

    ackSpeedChange: (parent: any, args: any) => {
      const match = Match.withId({ id: args.matchId })
      const index = match.time.phase.playersToAckSpeedChange.indexOf(args.playerId)
      match.time.phase.playersToAckSpeedChange.splice(index, 1)
      Time.subphase3RevealSpeedChange({ match })
    },
  },
}
