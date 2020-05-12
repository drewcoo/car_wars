import { gql } from 'apollo-boost'

const activeMoveSwerve = gql`
  mutation($id: ID!, $degrees: Int!) {
    activeMoveSwerve(id: $id, degrees: $degrees)
  }
`
export default activeMoveSwerve
