import { typeDef as ComponentTypes } from './Components'

export const typeDef = `
  type Design {
    name: String!
    attributes: DesignAttributes!
    components: Components!
    imageFile: String!
  }

  ${ComponentTypes}

  type DesignAttributes {
    size: String!
    chassis: String!
    suspension: String!
    cost: Int!
    weight: Int!
    topSpeed: Int!
    acceleration: Int!
    handlingClass: Int!
  }
`
