import DamageSource from './DamageSource'
import DamageTarget from './DamageTarget'

type Damage = {
  source: DamageSource
  target: DamageTarget
  message: string
}

export default Damage
