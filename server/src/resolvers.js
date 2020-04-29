import uuid from 'uuid/v4'
import * as Promise from 'bluebird'

import { resolvers as Geometry } from './types/Geometry'
import { resolvers as Player } from './types/Player'
import { resolvers as Car } from './types/Car'
import { resolvers as Map } from './types/Map'
import { resolvers as Match } from './types/Match'

const mungeResolvers = (target, source) => {
  for (let [key, value] of Object.entries(source.Query)) {
    target.Query[key] = value
  }
  for (let [key, value] of Object.entries(source.Mutation)) {
    target.Mutation[key] = value
  }
  if(source.Subscription) {
    for (let [key, value] of Object.entries(source.Subscription)) {
      target.Subscription[key] = value
    }
  }
}

const resolvers = { Query: {}, Mutation: {}, Subscription: {} }
mungeResolvers(resolvers, Car)
mungeResolvers(resolvers, Player)
mungeResolvers(resolvers, Geometry)
mungeResolvers(resolvers, Map)
mungeResolvers(resolvers, Match)

resolvers.Mutation.createCompleteMatch = async (parent, args, context) => {
  let match = await resolvers.Mutation.addMatch(null)
  let map = await resolvers.Mutation.addMap(null, {name: args.mapName})
  await resolvers.Mutation.matchSetMap(null, {matchId: match.id, mapName: args.mapName})
  let index = 0
  for (elem of args.playerAndDesign) {
    let player = await resolvers.Mutation.createPlayer(null, {name: elem.playerName, color: elem.playerColor, id: elem.playerId})
    let car = await resolvers.Mutation.createCar(null, { name: elem.name, playerId: player.id, designName: elem.designName})
    await resolvers.Mutation.addCar(null, { carId: car.id, playerId: player.id })
    await resolvers.Mutation.setCarPosition(null, { id: car.id, rect: map.startingPositions[index++] })
    let garbage = await resolvers.Mutation.matchAddCar(null, {matchId: match.id, carId: car.id})
  }
  let newMatch = await resolvers.Query.match(null, {matchId: match.id})    
  let started = await resolvers.Mutation.startMatch(null, { matchId: match.id })
  return started
}

resolvers.Query.completeMatchData = async(parent, args, context) => {
  let match = await resolvers.Query.match(null, { matchId: args.matchId })
  match['id'] = match.id
  let cars = await Promise.map(match.carIds, carId => {
    return resolvers.Query.car(null, { id: carId })
  })
  let players = await Promise.map(cars, car => {
    return resolvers.Query.player(null, { id: car.playerId })
  })
  return {
    match: match,
    cars: cars,
    players: players
  }
}

export default resolvers
