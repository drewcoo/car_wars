import { gql } from 'apollo-boost'

const activeManeuverPrevious = gql`
  mutation($id: ID!) {
    activeManeuverPrevious(id: $id)
  }
`
export default activeManeuverPrevious
