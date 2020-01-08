import MatchWrapper from './MatchWrapper'
//
// Hand it a store and a match id and it will give you helper functions
// for your match.
//
class PlayerWrapper {
  data: any
  match: MatchWrapper
  cars: any
  currentCarIndex: number
  color: string
  name: string
  constructor({ player, match }: { player: any, match: MatchWrapper }) {
    this.match = match
    this.data = player
    this.cars = this.data.cars
    this.currentCarIndex = this.data.currentCarIndex
    this.color = this.data.color
    this.name = this.data.name
  }
}

export default PlayerWrapper
