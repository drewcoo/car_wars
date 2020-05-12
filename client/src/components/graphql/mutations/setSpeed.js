import { gql } from 'apollo-boost'

const setSpeed = gql`
  mutation($id: ID!, $speed: Int!) {
    setSpeed(id: $id, speed: $speed)
  }
`
export default setSpeed
