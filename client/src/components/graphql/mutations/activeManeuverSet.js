import { gql } from 'apollo-boost'

const activeManeuverSet = gql`
  mutation($id: ID!, $maneuverIndex: Int!) {
    activeManeuverSet(id: $id, maneuverIndex: $maneuverIndex)
  }
`
export default activeManeuverSet
