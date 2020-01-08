import * as React from 'react'
import {connect} from "react-redux"
import MatchWrapper from '../../../utils/wrappers/MatchWrapper'
import '../../../App.css'

const mapStateToProps = (state) => {
  return({ matches: state.matches })
}

class Phase extends React.Component {
  // props.matchId

  render() {
    const phase = new MatchWrapper(this.props.matches[this.props.matchId]).time.phase

    return (
      <span id='phase' className='Timekeeping'>Phase: { phase.number }</span>
    )
  }
}

export default connect(mapStateToProps)(Phase)
