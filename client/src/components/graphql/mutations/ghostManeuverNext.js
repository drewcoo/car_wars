import { gql } from 'apollo-boost'

const ghostManeuverNext = gql`
  mutation($id: ID!) {
    ghostManeuverNext(id: $id)
  }
`
export default ghostManeuverNext
