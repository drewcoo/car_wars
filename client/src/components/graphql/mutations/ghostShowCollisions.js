import { gql } from 'apollo-boost'

const ghostShowCollisions = gql`
  mutation($id: ID!) {
    ghostShowCollisions(id: $id)
  }
`
export default ghostShowCollisions
