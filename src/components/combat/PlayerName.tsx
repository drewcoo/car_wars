import * as React from 'react'
import {connect} from "react-redux"
import MatchWrapper from '../../utils/wrappers/MatchWrapper'

const mapStateToProps = (state: any) => {
  return({ matches: state.matches })
}

class PlayerName extends React.Component {
  props: any
  // props.matchId

  render() {
    const match = new MatchWrapper({ match: this.props.matches[this.props.matchId] })
    console.log()
    const colorStyle = {
      color: match.currentPlayer().color,
      padding: '10px'
    }

    return (
      <span style={ colorStyle }>
        { match.currentPlayer().name }
      </span>
    )
  }
}

export default connect(mapStateToProps)(PlayerName)
