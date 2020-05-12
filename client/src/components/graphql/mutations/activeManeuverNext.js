import { gql } from 'apollo-boost'

const activeManeuverNext = gql`
  mutation($id: ID!) {
    activeManeuverNext(id: $id)
  }
`
export default activeManeuverNext
