import { gql } from 'apollo-boost'

const ackDamage = gql`
  mutation($matchId: ID!, $playerId: ID!) {
    ackDamage(matchId: $matchId, playerId: $playerId)
  }
`
export default ackDamage
