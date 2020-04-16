import { gql } from 'apollo-boost'

const activeMoveBend = gql`
  mutation($id: ID!, $degrees: Int!) {
    activeMoveBend(id: $id, degrees: $degrees)
  }
`
export default activeMoveBend
