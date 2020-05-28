import * as React from 'react'
import '../../../App.css'
import '../overlays/timing/moveOrder/moveOrder'

import LocalMatchState from '../lib/LocalMatchState'
import MoveOrder from '../overlays/timing/moveOrder/moveOrder'

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  matchData: any
}

class Phase extends React.Component<Props> {
  render(): React.ReactNode {
    return (
      <span id="phase" className="Timekeeping">
        Phase: {new LocalMatchState(this.props.matchData).time().phase.number}
        &nbsp;&nbsp;&nbsp;&nbsp;
        <MoveOrder matchData={this.props.matchData} />
      </span>
    )
  }
}

export default Phase
