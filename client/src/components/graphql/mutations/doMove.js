import { gql } from 'apollo-boost'

const doMove = gql`
  mutation(
    $id: ID!,
    $maneuver: String!,
    $howFar: Int!
  ) {
    doMove(
      id: $id,
      maneuver: $maneuver,
      howFar: $howFar
    )
  }
`
export default doMove
