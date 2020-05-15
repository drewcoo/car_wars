import * as React from 'react'
import '../../../App.css'

import LocalMatchState from '../lib/LocalMatchState'

class Phase extends React.Component {
  render() {
    return (
      <span id='phase' className='Timekeeping'>
        Phase: {new LocalMatchState(this.props.matchData).time().phase.number }
      </span>
    )
  }
}

export default Phase
