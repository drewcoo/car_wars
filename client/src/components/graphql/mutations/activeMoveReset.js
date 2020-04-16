import { gql } from 'apollo-boost'

const activeMoveReset = gql`
  mutation($id: ID!) {
    activeMoveReset(id: $id)
  }
`
export default activeMoveReset
