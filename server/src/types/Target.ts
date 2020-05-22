// name is a subset of string
export const typeDef = `
  type Target {
    carId: ID!
    displayPoint: Point!
    location: Segment | Point
    name: String
  }
`
