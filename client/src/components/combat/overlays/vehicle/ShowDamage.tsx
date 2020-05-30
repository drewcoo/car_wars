import * as React from 'react'
import LocalMatchState from '../../lib/LocalMatchState'
import WeaponDamage from './damage/WeaponDamage'
import uuid from 'uuid/v4'
import TireDamage from './damage/TireDamage'
import Damage from '../../../../types/Damage'

interface Props {
  carId: string
  matchData: any
}

class ShowDamage extends React.Component<Props> {
  getCurrentDamage(): React.ReactNode {
    const car = new LocalMatchState(this.props.matchData).car({ id: this.props.carId })
    return car.phasing.damage
      .filter((damage: Damage): boolean => damage.target != null)
      .map((damage: Damage) => {
        if (damage.message === 'tire damage') {
          return <TireDamage key={uuid()} damage={damage} />
        }
        return <WeaponDamage key={uuid()} damage={damage} />
      })
  }

  render(): React.ReactNode {
    return <svg>{this.getCurrentDamage()}</svg>
  }
}

export default ShowDamage
