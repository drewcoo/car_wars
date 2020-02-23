import { gql } from 'apollo-boost'

const ghostMoveReset = gql`
  mutation($id: ID!) {
    ghostMoveReset(id: $id)
  }
`
export default ghostMoveReset
