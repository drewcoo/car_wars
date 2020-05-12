import { gql } from 'apollo-boost'

const matches = gql`
  {
    matches {
      id
      status
    }
  }
`

export default matches
