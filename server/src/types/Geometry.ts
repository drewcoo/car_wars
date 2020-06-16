// segment should be exactly two points

export const typeDef = `
  input InputPoint {
    x: Int!
    y: Int!
  }

  type Point {
    x: Float!
    y: Float!
  }

  input InputRectangle {
    facing: Float!
    length: Float!
    width: Float!
    _brPoint: InputPoint!
  }

  type Rectangle {
    facing: Float!
    length: Float!
    width: Float!
    _brPoint: Point!
  }

  type Segment {
    points: [Point]
  }
`