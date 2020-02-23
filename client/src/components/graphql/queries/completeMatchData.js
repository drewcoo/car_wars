import { gql } from 'apollo-boost'

const completeMatchData = gql`
  query($matchId: ID!) {
    completeMatchData (matchId: $matchId) {
      match {
        id
        carIds
        map {
          id
          name
          size {
            height
            width
          }
          wallData {
            id
            rect {
              facing
              length
              width
              _brPoint {
                x
                y
              }
            }
          }
        }
        time {
          phase {
            number
            moving
            unmoved
          }
          turn {
            number
          }
        }
      }
      cars {
        id
        currentMatch
        collisionDetected
        collisions {
          damage
          damageModifier
          handlingStatus
          newSpeed
          rammed {
            id
          }
          type
        }
        color
        design {
          name
          attributes {
            size
            chassis
            suspension
            cost
            weight
            topSpeed
            acceleration
            handlingClass
          }
          components {
            armor {
              type
              F
              R
              L
              B
              T
              U
            }
            crew {
              role
              damagePoints
              firedThisTurn
            }
            powerPlant {
              damagePoints
              type
            }
            tires {
              damagePoints
              location
              type
            }
            weapons {
              abbreviation
              ammo
              damage
              damagePoints
              effect
              firedThisTurn
              location
              requiresPlant
              toHit
              type
            }
          }
        }
        modals {
          text
        }
        name
        phasing {
          collisionDetected
          collisions {
            damage
            damageModifier
            handlingStatus
            newSpeed
            rammed {
              id
            }
            type
          }
          damageMarkerLocation {
            x
            y
          }
          damageMessage
          difficulty
          maneuverIndex
          rect {
            facing
            length
            width
            _brPoint {
              x
              y
            }
          }
          speedChangeIndex
          speedChanges
          targetIndex
          targets {
            carId
            name
            displayPoint {
              x
              y
            }
          }
          weaponIndex
        }
        playerId
        rect {
          facing
          length
          width
          _brPoint {
            x
            y
          }
        }
        status {
          changedSpeed
          handling
          maneuvers
          speed
        }
      }
      players {
        id
        name
        carIds
        color
      }
    }
  }
`

export default completeMatchData
