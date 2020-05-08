import * as React from 'react'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import { HotKeys } from 'react-hotkeys'
import LocalMatchState from '../../lib/LocalMatchState'
import ViewElement from '../../lib/ViewElement'
import ackSpeedChange from '../../../graphql/mutations/ackSpeedChange'

const ACK_SPEED_CHANGE = graphql(ackSpeedChange, { name: 'ackSpeedChange' })

class DamageKeystrokes extends React.Component {
  constructor (props) {
    super(props)
    this.state = { value: '' }
    this.keyMap = {
      ack: ['enter', 'esc'],
      home: '.'
    }
  }

  async ack ({ matchId, playerId }) {
    this.props.ackSpeedChange({ variables: { matchId, playerId } })
  }

  render () {
    const lms = new LocalMatchState(this.props.matchData)
    const playerId = lms.car({ id: this.props.carId }).playerId
    const handlers = {
      ack: (event) => {
        this.ack({
          matchId: this.props.matchData.match.id,
          playerId: playerId
        })
      },
      home: (event) => {
        const car = lms.car(this.props.carId)
        ViewElement(car.id)
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
  ACK_SPEED_CHANGE
)(DamageKeystrokes)
