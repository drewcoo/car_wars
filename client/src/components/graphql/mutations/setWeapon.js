import { gql } from 'apollo-boost'

const setWeapon = gql`
  mutation($id: ID!, $weaponIndex: Int!) {
    setWeapon(id: $id, weaponIndex: $weaponIndex)
  }
`
export default setWeapon
