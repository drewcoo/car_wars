import { gql } from 'apollo-boost'

const activeMoveHalfStraight = gql`
  mutation($id: ID!) {
    activeMoveHalfStraight(id: $id)
  }
`
export default activeMoveHalfStraight
