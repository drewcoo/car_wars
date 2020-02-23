import { gql } from 'apollo-boost'

const ghostManeuverPrevious = gql`
  mutation($id: ID!) {
    ghostManeuverPrevious(id: $id)
  }
`
export default ghostManeuverPrevious
