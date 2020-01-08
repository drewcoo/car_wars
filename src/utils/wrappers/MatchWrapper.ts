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
  time: any

  constructor(match: any) {
    this.data = match
    this.cars = this.data.cars
    this.map = this.data.map
    this.time = this.data.time
  }

  players(): any {
    return this.time.moveMe.players
  }

  currentPlayerId(): string {
    return this.players().currentIndex
  }

  player({ id }: { id: string }): PlayerWrapper {
    return new PlayerWrapper({ match: new MatchWrapper(this.data), player: this.players().all[id] })
  }

  currentPlayer(): PlayerWrapper {
    return this.player({ id: this.currentPlayerId() })
  }

  currentCarId(): string {
    return this.currentPlayer().cars[this.currentPlayer().currentCarIndex].id
  }

  car({ id }: { id: string }): CarWrapper {
    let car_data = this.cars.find(function (elem: any) { return elem.id === id })
    return new CarWrapper({ car: car_data, match: new MatchWrapper(this.data) })
  }

  currentCar(): CarWrapper {
    return this.car({ id: this.currentCarId() })
  }
}

export default MatchWrapper
