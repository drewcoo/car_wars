import { gql } from 'apollo-boost'

const ackSpeedChange = gql`
  mutation($matchId: ID!, $playerId: ID!) {
    ackSpeedChange(matchId: $matchId, playerId: $playerId)
  }
`
export default ackSpeedChange
