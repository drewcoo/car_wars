import * as React from 'react'
import GenericComponent from './GenericComponent'
import LocalMatchState from '../../../../../lib/LocalMatchState'
import Dimensions from '../../../../../../../utils/Dimensions'
import Point from '../../../../../../../utils/geometry/Point'

interface Props {
  carId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  matchData: any
  carDimensions: Dimensions
}

interface CharacterData {
  damagePoints: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  equipment: any
  firedThisTurn: boolean
  id: string
  inVehicleId: string
  log: [string]
  name: string
  matchId: string
  playerId: string
  prestige: number
  reflexRoll: number
  reflexTieBreaker: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  skills: any
  wealth: number
}

class Driver extends React.Component<Props> {
  render(): React.ReactNode {
    const lms = new LocalMatchState(this.props.matchData)
    const car = lms.car({ id: this.props.carId })
    const driver = lms.driver({ car })

    return (
      <GenericComponent
        name={'driver'}
        dp={driver.damagePoints}
        maxDp={driver.maxDamagePoints}
        carDimensions={this.props.carDimensions}
        point={new Point({ x: 0, y: 0.15 * this.props.carDimensions.height })}
      />
    )
  }
}

export default Driver
