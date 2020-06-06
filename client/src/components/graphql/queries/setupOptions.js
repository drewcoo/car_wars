import { gql } from 'apollo-boost'

const setupOptions = gql`
  query {
    setupOptions {
      designs {
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
    }
  }
`

export default setupOptions
