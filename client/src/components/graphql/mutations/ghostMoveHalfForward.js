import { gql } from 'apollo-boost'

const ghostMoveHalfForward = gql`
  mutation($id: ID!) {
    ghostMoveHalfForward(id: $id)
  }
`
export default ghostMoveHalfForward
