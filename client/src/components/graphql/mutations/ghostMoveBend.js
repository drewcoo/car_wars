import { gql } from 'apollo-boost'

const ghostMoveBend = gql`
  mutation($id: ID!, $degrees: Int!) {
    ghostMoveBend(id: $id, degrees: $degrees)
  }
`
export default ghostMoveBend
