import _ from 'lodash'
import uuid from 'uuid/v4'
import { PubSub } from 'apollo-server-express'
import { withFilter } from 'graphql-subscriptions'
import Movement from '../gameServerHelpers/Movement'
import Phase from '../gameServerHelpers/Phase'
import Car from './Car'
import Player from './Player'
import { DATA,  matchCars } from '../DATA'
import {INCH} from '../utils/constants'

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
    players: [Player!]
  }

  type Match {
    name: String
    id: ID!
    carIds: [ID]
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
  }
`

allTheNothings = {}

const addNothing = ({ matchId, msg }) => {
  const id = uuid()
  let previousId = ''
  if (allTheNothings[matchId] && allTheNothings[matchId].length > 0) {
    previousId = allTheNothings[matchId][allTheNothings[matchId].length - 1].id
  }
  let timestamp = `${Date.now()}`
  pubsub.publish(NOTHING_CHANNEL, { nothingChannel: { id, previousId, timestamp, matchId, msg }})
  if(!allTheNothings[matchId]) { allTheNothings[matchId] = [] }
  allTheNothings[matchId].push({ id, previousId, timestamp, msg })
  return timestamp
}

const NOTHING_CHANNEL = 'nothing_channel'

export const resolvers = {
  Query: {
    match: (parent, args, context) => {
      return DATA.matches.find(match => match.id === args.matchId)
    },
    matches: () =>  {
      return DATA.matches
    },
    nothings: (parent, args, context) => {
      if (!allTheNothings[args.matchId]) { return [] }
      return allTheNothings[args.matchId]
    }
  },
  Subscription: {
    nothingChannel: {
      subscribe: withFilter(() => pubsub.asyncIterator(NOTHING_CHANNEL), (payload, variables) => {
        if (variables.matchId === '*') return true
        return (payload.nothingChannel.matchId === variables.matchId)
      })
    }
  },
  Mutation: {
    sayNothing: (parent, args, context) => {
      return addNothing({ matchId: args.matchId, msg: args.msg })
    },
    addMatch: (parent, args, context) => {
      let newMatch = {
        id: uuid(),
        carIds: [],
        map: null,
        status: 'new',
        time: {
          phase: {
            number: 0,
            moving: null,
            subphase: '1_start',
            unmoved: [],
            canTarget: [],
            playersToAckDamage: [],
            playersToAckSpeedChange: []
          },
          turn: {
            number: 0
          }
        }
      }
      DATA.matches.push(newMatch)
      return newMatch
    },
    matchSetMap: (parent, args, context) => {
      let match = DATA.matches.find(el => el.id === args.matchId)
      if (!match) {
        throw new Error(`Match does not exist: ${args.matchId}`)
      }
      let originalMap = DATA.maps.find(el => el.name === args.mapName)
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
    matchAddCar: (parent, args, context) => {
      let match = DATA.matches.find(el => el.id === args.matchId)
      if (match === undefined) {
        throw new Error(`match not found: ${args.matchId}`)
      }
      if (match.carIds === undefined) {
        throw new Error('match.carIds undefined')
      }
      if (undefined === DATA.cars.find(el => el.id === args.carId))  {
        throw new Error(`Car does not exist: ${args.carId}`)
      }
      if (match.map !== null &&
          match.carIds.length >= match.map.startingPositions.length) {
            throw new Error(`Map only has ${match.map.startingPositions.length} starting positions`)
          }
      match.carIds.push(args.carId)
      DATA.cars.find(car => car.id === args.carId).currentMatch = args.matchId
      return match
    },
    startMatch: (parent, args, context) => {
      let match = DATA.matches.find(el => el.id === args.matchId)
      if (!match) { throw new Error(`Match does not exist: ${args.matchId}`) }
      if (match.status !== 'new') { throw new Error('Restart match?') }
      match.status = 'started'
      Phase.subphase1_start({ match })
      return match
    },
    finishMatch: (parent, args, context) => {
      let match = DATA.matches.find(el => el.id === args.matchId)
      if (!match) {
        throw new Error(`Match does not exist: ${args.matchId}`)
      }
      // for ameteur night:
      // - remove all characters from vehicles
      // - move all vehicles in current state to winner
      // generally:
      // - privateering
      // - prizes
      match.carIds.map(carId => {
        DATA.cars.find(car => car.id === carId).currentMatch = null
      })
      match.status = 'finished'
      return match
    },
    ackDamage: (parent, args, context) => {
      const match = DATA.matches.find(el => el.id === args.matchId)
      const ptadIndex = match.time.phase.playersToAckDamage.indexOf(args.playerId)
      if (ptadIndex === -1) { throw new Error(`player not waiting to ack damage: ${args.playerId}`)}
      match.time.phase.playersToAckDamage.splice(ptadIndex, 1)
      Phase.subphase5_damage({ match})
    },
    ackSpeedChange: (parent, args, context) => {
      const match = DATA.matches.find(el => el.id === args.matchId)
      const index = match.time.phase.playersToAckSpeedChange.indexOf(args.playerId)
      if (index === -1) { throw new Error(`player not waiting to ack speed change: ${args.playerId}`)}
      match.time.phase.playersToAckSpeedChange.splice(index, 1)
      Phase.subphase_2_1_revealSpeedChange({ match})
    }
  }
}
