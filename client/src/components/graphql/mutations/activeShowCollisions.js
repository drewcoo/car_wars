import { gql } from 'apollo-boost'

const activeShowCollisions = gql`
  mutation($id: ID!) {
    activeShowCollisions(id: $id)
  }
`
export default activeShowCollisions
