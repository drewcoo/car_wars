import { gql } from 'apollo-boost'

const ghostMoveDrift = gql`
  mutation($id: ID!, $direction: String!) {
    ghostMoveDrift(id: $id, direction: $direction)
  }
`
export default ghostMoveDrift
