import { gql } from 'apollo-boost'

const completeMatchData = gql`
  query($matchId: ID!) {
    completeMatchData(matchId: $matchId) {
      match {
        id
        carIds
        characterIds
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
            subphase
            unmoved
            canTarget
            playersToAckDamage
            playersToAckSpeedChange
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
              id
              role
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
            source {
              point {
                x
                y
              }
              character
              weapon
            }
            target {
              point {
                x
                y
              }
              location
              damage
              damageDice
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
          showSpeedChangeModal
          speedChangeIndex
          speedChanges {
            speed
            difficulty
            damageDice
          }
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
          speedInitThisTurn
          speedSetThisTurn
        }
      }
      characters {
        damagePoints
        equipment {
          name
          weight
        }
        firedThisTurn
        id
        inVehicleId
        log
        name
        matchId
        playerId
        prestige
        reflexRoll
        skills {
          name
          points
        }
        wealth
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
