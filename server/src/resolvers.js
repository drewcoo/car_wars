import * as Promise from 'bluebird'
import { resolvers as Car } from './types/Car'
import { resolvers as Character } from './types/Character'
import { resolvers as Geometry } from './types/Geometry'
import { resolvers as Map } from './types/Map'
import { resolvers as Match } from './types/Match'
import { resolvers as Player } from './types/Player'

const mungeResolvers = (target, source) => {
  for (const [key, value] of Object.entries(source.Query)) {
    target.Query[key] = value
  }
  for (const [key, value] of Object.entries(source.Mutation)) {
    target.Mutation[key] = value
  }
  if (source.Subscription) {
    for (const [key, value] of Object.entries(source.Subscription)) {
      target.Subscription[key] = value
    }
  }
}

const resolvers = { Query: {}, Mutation: {}, Subscription: {} }
mungeResolvers(resolvers, Car)
mungeResolvers(resolvers, Character)
mungeResolvers(resolvers, Player)
mungeResolvers(resolvers, Geometry)
mungeResolvers(resolvers, Map)
mungeResolvers(resolvers, Match)

resolvers.Mutation.createCompleteMatch = async (parent, args, context) => {
  const match = await resolvers.Mutation.addMatch(null)
  const map = await resolvers.Mutation.addMap(null, { name: args.mapName })
  await resolvers.Mutation.matchSetMap(null, {
    matchId: match.id,
    mapName: args.mapName,
  })
  let index = 0
  for (const elem of args.playerAndDesign) {
    const player = await resolvers.Mutation.createPlayer(null, {
      name: elem.playerName,
      color: elem.playerColor,
      id: elem.playerId,
    })
    const character = await resolvers.Mutation.createCharacter(null, {
      id: elem.characterId,
      name: `${elem.playerName} driver`,
      matchId: match.id,
      playerId: elem.playerId,
    })
    const car = await resolvers.Mutation.createCar(null, {
      name: elem.name,
      playerId: player.id,
      designName: elem.designName,
      crew: [{ role: 'driver', id: character.id }],
    })
    await resolvers.Mutation.addCar(null, {
      carId: car.id,
      playerId: player.id,
    })
    await resolvers.Mutation.setCarPosition(null, {
      id: car.id,
      rect: map.startingPositions[index++],
    })
    const garbage = await resolvers.Mutation.matchAddCar(null, {
      matchId: match.id,
      carId: car.id,
    })
  }
  const newMatch = await resolvers.Query.match(null, { matchId: match.id })
  const started = await resolvers.Mutation.startMatch(null, {
    matchId: match.id,
  })
  return started
}

resolvers.Query.completeMatchData = async (parent, args, context) => {
  const match = await resolvers.Query.match(null, { matchId: args.matchId })
  const cars = await Promise.map(match.carIds, (carId) => {
    return resolvers.Query.car(null, { id: carId })
  })
  const characters = await Promise.map(match.characterIds, (characterId) => {
    return resolvers.Query.character(null, { id: characterId })
  })
  const players = await Promise.map(cars, (car) => {
    return resolvers.Query.player(null, { id: car.playerId })
  })
  // write every time we're queried
  process.stdout.write('.')
  return {
    match: match,
    cars: cars,
    players: players,
    characters: characters,
  }
}

export default resolvers
