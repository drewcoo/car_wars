import { gql } from 'apollo-boost'

const ghostManeuverSet = gql`
  mutation($id: ID!, $maneuverIndex: Int!) {
    ghostManeuverSet(id: $id, maneuverIndex: $maneuverIndex)
  }
`
export default ghostManeuverSet
