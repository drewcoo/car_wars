import Rectangle from '../geometry/Rectangle'
//
// Hand it a store and a match id and it will give you helper functions
// for your match.
//
class MapWrapper {
  data: any

  name: string
  size: any
  startingPositions: any
  wallData: any
  constructor({ map }: { map: any }) {
    this.data = map

    this.name = this.data.name
    this.size = this.data.size
    this.startingPositions = this.data.startingPositions.map((pos: Rectangle) => new Rectangle(pos))
    this.wallData = this.data.wallData
    this.wallData.forEach((wall: any) => wall.rect = new Rectangle(wall.rect))
  }

  toObject(): any {
    return this.data
  }
}

export default MapWrapper
