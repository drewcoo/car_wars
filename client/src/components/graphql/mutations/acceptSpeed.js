import { gql } from 'apollo-boost'

const acceptSpeed = gql`
  mutation($id: ID!, $bugMeNot: Boolean) {
    acceptSpeed(id: $id, bugMeNot: $bugMeNot)
  }
`
export default acceptSpeed
