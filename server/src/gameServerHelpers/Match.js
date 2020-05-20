import { DATA } from '../DATA'
import Rectangle from '../utils/geometry/Rectangle'
import Vehicle from './Vehicle'
//import Log from '../utils/Log'

/*
interface MapSize {
  height: number
  width: number
}

interface WallSegment {
  id: string
  rect: Rectangle
}

interface Map {
  id: string
  name: string
  size: MapSize
  startingPositions: Rectangle[]
  wallData: WallSegment[]
}

interface Phase {
  number: number
  subphase: string
  moving: string
  unmoved: string[]
  canTarget: string[]
  playersToAckDamage: string[]
  playersToAckSpeedChange: string[]
}

interface Turn {
  number: number
}

interface MatchTime {
  phase: Phase
  turn: Turn
}

interface Match {
  name: string
  id: string
  carIds: string[]
  characterIds: string[]
  map: Map
  status: string
  time: MatchTime
}
*/

class Match {
  static cars({ match, _data = DATA }) {
    return match.carIds.map((carId) => {
      const car = _data.cars.find((car) => car.id === carId)
      car.rect = new Rectangle(car.rect)
      car.phasing.rect = new Rectangle(car.phasing.rect)
      return car
    })
  }

  static characters({ match, _data = DATA }) {
    return match.characterIds.map((characterId) => _data.characters.find((character) => character.id === characterId))
  }

  static withId({ id }) {
    return DATA.matches.find((element) => element.id === id)
  }

  static withVehicle({ vehicle }) {
    return DATA.matches.find((element) => element.id === vehicle.currentMatch)
  }
}

export default Match
