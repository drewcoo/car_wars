import { gql } from 'apollo-boost'

const ghostMoveForward = gql`
  mutation($id: ID!) {
    ghostMoveForward(id: $id)
  }
`
export default ghostMoveForward
