import { gql } from 'apollo-boost'

const fireWeapon = gql`
  mutation($id: ID!, $targetId: ID!, $targetName: String!, $targetX: Float!, $targetY: Float!) {
    fireWeapon(id: $id, targetId: $targetId, targetName: $targetName, targetX: $targetX, targetY: $targetY)
  }
`
export default fireWeapon
