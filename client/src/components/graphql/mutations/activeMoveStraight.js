import { gql } from 'apollo-boost'

const activeMoveStraight = gql`
  mutation($id: ID!) {
    activeMoveStraight(id: $id)
  }
`
export default activeMoveStraight
