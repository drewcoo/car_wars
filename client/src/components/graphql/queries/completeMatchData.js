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
          rammed
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
              wheelExists
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
        log
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
            rammed
            type
          }
          damage {
            display {
              x
              y
            }
            message
          }
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
          controlChecksForSpeedChanges {
            speed
            checks
          }
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
          handling
          killed
          lastDamageBy
          maneuvers
          nextMove {
            fishtailDistance
            maneuver
            maneuverDistance
            maneuverDirection
            spinDirection
          }
          speed
          speedChangedThisTurn
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
