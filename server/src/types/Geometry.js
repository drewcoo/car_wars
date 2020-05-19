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

export const resolvers = {
  Query: {
    points: () => {
      return points
    },
    rectangles: () => {
      return rectangles
    },
  },

  Mutation: {
    addPoint: (parent, args, context) => {
      const val = { x: args.x, y: args.y }
      const result = { x: args.point.x, y: args.point.y }
      points.push(result)
      return result
    },
  },
}
