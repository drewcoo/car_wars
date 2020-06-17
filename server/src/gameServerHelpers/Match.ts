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
  movesThisTurn: any
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
  static cars({ match }: { match: any }) {
    return match.carIds.map((carId: string) => {
      const car: any = DATA.cars.find((car: any) => car.id === carId)
      car.rect = new Rectangle(car.rect)
      car.phasing.rect = new Rectangle(car.phasing.rect)
      return car
    })
  }

  static characters({ match }: { match: any }) {
    return match.characterIds.map((characterId: string) =>
      DATA.characters.find((character: any) => character.id === characterId),
    )
  }

  static map({ match }: { match: any }) {
    return match.map
  }

  static withId({ id }: { id: string }) {
    return DATA.matches.find((element: any) => element.id === id)
  }

  static withVehicle({ vehicle }: { vehicle: any }) {
    return DATA.matches.find((element: any) => element.id === vehicle.currentMatch)
  }
}

export default Match
