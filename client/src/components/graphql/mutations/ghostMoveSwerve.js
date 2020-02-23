import { gql } from 'apollo-boost'

const ghostMoveSwerve = gql`
  mutation($id: ID!, $degrees: Int!) {
    ghostMoveSwerve(id: $id, degrees: $degrees)
  }
`
export default ghostMoveSwerve
