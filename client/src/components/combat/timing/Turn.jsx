import * as React from 'react'
import '../../../App.css'
import LocalMatchState from '../lib/LocalMatchState'

class Turn extends React.Component {
  constructor(props) {
    super(props)
    this.props = props
  }

  render() {
    return (
      <span id='turn' className='Timekeeping'>
        Turn: { new LocalMatchState(this.props.matchData).time().turn.number }
      </span>
    )
  }
}

export default Turn
