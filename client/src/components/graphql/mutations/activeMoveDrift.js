import { gql } from 'apollo-boost'

const activeMoveDrift = gql`
  mutation($id: ID!, $direction: String!) {
    activeMoveDrift(id: $id, direction: $direction)
  }
`
export default activeMoveDrift
