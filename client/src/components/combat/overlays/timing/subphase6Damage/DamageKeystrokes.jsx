import * as React from 'react'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import { HotKeys } from 'react-hotkeys'
import LocalMatchState from '../../../lib/LocalMatchState'
import ViewElement from '../../../lib/ViewElement'
import ackDamage from '../../../../graphql/mutations/ackDamage'
import PropTypes from 'prop-types'

const ACK_DAMAGE = graphql(ackDamage, { name: 'ackDamage' })

class DamageKeystrokes extends React.Component {
  constructor(props) {
    super(props)
    this.state = { value: '' }
    this.keyMap = {
      ackDamage: ['enter', 'esc'],
      home: '.',
    }
  }

  async ackDamage({ matchId, playerId }) {
    this.props.ackDamage({ variables: { matchId, playerId } })
  }

  render() {
    const lms = new LocalMatchState(this.props.matchData)
    const playerId = lms.car({ id: this.props.carId }).playerId
    const handlers = {
      ackDamage: (event) => {
        this.ackDamage({
          matchId: this.props.matchData.match.id,
          playerId: playerId,
        })
        event.stopPropagation()
      },
      home: (event) => {
        const car = lms.car(this.props.carId)
        ViewElement(car.id)
      },
    }
    return <HotKeys attach={document} focused={true} handlers={handlers} keyMap={this.keyMap} />
  }
}

DamageKeystrokes.propTypes = {
  ackDamage: PropTypes.func,
  carId: PropTypes.string,
  matchData: PropTypes.object,
}

export default compose(ACK_DAMAGE)(DamageKeystrokes)
