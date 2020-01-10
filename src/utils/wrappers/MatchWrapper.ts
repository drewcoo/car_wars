import CarWrapper from './CarWrapper'
import PlayerWrapper from './PlayerWrapper'
//
// Hand it a store and a match id and it will give you helper functions
// for your data.
//
class MatchWrapper {
  data: any
  cars: any
  map: any
  matchId: string
  players: any
  status: string
  time: any

  constructor({match}: { match: any }) {
    this.data = match
    this.cars = this.data.cars
    this.map = this.data.map
    this.matchId = this.data.matchId
    this.players = this.data.players
    this.status = this.data.status
    this.time = this.data.time
  }

  currentPlayerId(): string {
    return this.currentCar().playerId
  }

  player({ id }: { id: string }): PlayerWrapper {
    return new PlayerWrapper({ match: new MatchWrapper({match: this.data }), player: this.players[id] })
  }

  currentPlayer(): PlayerWrapper {
    return this.player({ id: this.currentPlayerId() })
  }

  currentCarId(): string {
    if (this.time.phase.moving === null) { throw new Error('No current car!')}
    return this.time.phase.moving
  }

  car({ id }: { id: string }): CarWrapper {
    return new CarWrapper({ car: this.cars[id], match: new MatchWrapper({ match: this.data }) })
  }

  currentCar(): CarWrapper {
    console.log(this.currentCarId())
    return this.car({ id: this.currentCarId() })
  }
}

export default MatchWrapper
