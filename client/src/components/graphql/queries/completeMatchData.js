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
        status
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
            movesByPhase {
              absSpeed
              movers {
                id
                color
                distance
                speed
                reflexRoll
                reflexTieBreaker
              }
            }
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
              maxDamagePoints
              type
            }
            tires {
              damagePoints
              maxDamagePoints
              location
              type
              wheelExists
            }
            weapons {
              abbreviation
              ammo
              damage
              damagePoints
              maxDamagePoints
              effect
              firedThisTurn
              location
              requiresPlant
              toHit
              type
            }
          }
          imageFile
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
          direction {
            forward
            canChange {
              turn
              phase
            }
          }
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
        maxDamagePoints
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
        reflexTieBreaker
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
