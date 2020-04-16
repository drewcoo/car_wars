import { gql } from 'apollo-boost'

const activeMoveHalfForward = gql`
  mutation($id: ID!) {
    activeMoveHalfForward(id: $id)
  }
`
export default activeMoveHalfForward
