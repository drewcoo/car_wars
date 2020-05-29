import { gql } from 'apollo-boost'

const activeMovePivot = gql`
  mutation($id: ID!, $degrees: Int!) {
    activeMovePivot(id: $id, degrees: $degrees)
  }
`
export default activeMovePivot
