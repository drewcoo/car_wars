import * as React from 'react'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import { HotKeys } from 'react-hotkeys'
import LocalMatchState from '../../lib/LocalMatchState'
import ackDamage from '../../../graphql/mutations/ackDamage'

const ACK_DAMAGE = graphql(ackDamage, { name: 'ackDamage' })

class DamageKeystrokes extends React.Component {
  constructor (props) {
    super(props)
    this.state = { value: '' }
    this.keyMap = {
      ackDamage: 'enter'
    }
  }

  async ackDamage ({ matchId, playerId }) {
    this.props.ackDamage({ variables: { matchId, playerId } })
  }

  render () {
    const lms = new LocalMatchState(this.props.matchData)
    const playerId = lms.car({ id: this.props.carId }).playerId
    const handlers = {
      ackDamage: (event) => {
        this.ackDamage({
          matchId: this.props.matchData.match.id,
          playerId: playerId
        })
      }
    }
    return (
      <HotKeys
        attach={document}
        focused={true}
        handlers={handlers}
        keyMap={this.keyMap}
      />
    )
  }
}

export default compose(
  ACK_DAMAGE
)(DamageKeystrokes)
