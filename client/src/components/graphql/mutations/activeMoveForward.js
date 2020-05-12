import { gql } from 'apollo-boost'

const activeMoveForward = gql`
  mutation($id: ID!) {
    activeMoveForward(id: $id)
  }
`
export default activeMoveForward
