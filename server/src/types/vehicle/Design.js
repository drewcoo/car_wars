import { typeDef as ComponentTypes } from './Components'

export const typeDef = `
  type Design {
    name: String!
    attributes: DesignAttributes!
    components: Components!
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
