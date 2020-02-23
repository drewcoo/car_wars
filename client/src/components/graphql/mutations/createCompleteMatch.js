import { gql } from 'apollo-boost'

const createCompleteMatch = gql`
mutation($carData: [CarInput!], $mapName: String!) {
  createCompleteMatch(mapName: $mapName, playerAndDesign: $carData) {
    id
    carIds
    map {
      id
    }
    status
    time {
      phase { number }
      turn { number }
    }
  }
}`

export default createCompleteMatch
