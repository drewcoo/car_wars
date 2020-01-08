import * as React from 'react'
import {connect} from "react-redux"
import MatchWrapper from '../../../utils/wrappers/MatchWrapper'
import '../../../App.css'

const mapStateToProps = (state) => {
  return({ matches: state.matches })
}

class Turn extends React.Component {
  // props.matchId

  render() {
    const turn = new MatchWrapper(this.props.matches[this.props.matchId]).time.turn

    return (
      <span id='turn' className='Timekeeping'>Turn: { turn.number }</span>
    )
  }
}

export default connect(mapStateToProps)(Turn)
