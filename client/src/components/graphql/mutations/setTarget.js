import { gql } from 'apollo-boost'

const setTarget = gql`
  mutation($id: ID!, $targetIndex: Int!) {
    setTarget(id: $id, targetIndex: $targetIndex)
  }
`
export default setTarget
