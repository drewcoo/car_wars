import { gql } from 'apollo-boost'

const finishFiring = gql`
  mutation($id: ID!) {
    finishFiring(id: $id)
  }
`
export default finishFiring
