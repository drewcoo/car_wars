import * as React from 'react'
import {connect} from "react-redux"
import MatchWrapper from '../../utils/wrappers/MatchWrapper'

import Car from './Car'
import Damage from './Damage'
import GhostCar from './GhostCar'
import MapBackground from './MapBackground'
import Reticle from './Reticle'
import Walls from './Walls'

const mapStateToProps = (state) => {
  return({ matches: state.matches })
}

class ArenaMap extends React.Component {
  // props.matchId

  render() {
    const match = new MatchWrapper(this.props.matches[this.props.matchId])
    const size = match.map.size
    const players = match.time.moveMe.players

    return (
      <svg id='ArenaMap' width={ size.width } height={ size.height } >
        <MapBackground matchId={ this.props.matchId } />
        <Walls matchId={ this.props.matchId } />
        {
          players.all.map((player) => (
            player.cars.map((car) => (
              <Car key={ car.id } matchId={ this.props.matchId } id={ car.id } />
            ))
          ))
        }
        <GhostCar matchId={ this.props.matchId } />
        <Reticle matchId={ this.props.matchId } />
        <Damage matchId={ this.props.matchId } />
      </svg>
    )
  }
}

export default connect(mapStateToProps)(ArenaMap)
