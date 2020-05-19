import { gql } from 'apollo-boost'

const acceptMove = gql`
  mutation($id: ID!, $maneuver: String!, $howFar: Int!) {
    acceptMove(id: $id, maneuver: $maneuver, howFar: $howFar)
  }
`
export default acceptMove
