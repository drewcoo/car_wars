import * as React from 'react'
import {connect} from "react-redux"
import MatchWrapper from '../../utils/wrappers/MatchWrapper'
import Car from './Car'
import FiringArc from './FiringArc'

const mapStateToProps = (state: any) => {
  return({ matches: state.matches })
}

class GhostCar extends React.Component {
  props: any
  // props.matchId

  render() {
    const match = new MatchWrapper({ match: this.props.matches[this.props.matchId] })
    return (
      <g>
        <FiringArc matchId={ this.props.matchId } />
        <Car
          matchId={ this.props.matchId }
          id={ match.currentCarId() }
          key='ghost'
          ghost={ true }
        />
      </g>
    )
  }
}

export default connect(mapStateToProps)(GhostCar)
