import * as React from 'react'
import LocalMatchState from './lib/LocalMatchState'
import Car from './Car'
import MapBackground from './MapBackground'
import Walls from './Walls'
import ActiveCar from './ActiveCar'
import ViewElement from './lib/ViewElement'
import PropTypes from 'prop-types'

class ArenaMap extends React.Component {
  componentDidMount() {
    const lms = new LocalMatchState(this.props.matchData)
    if (lms.activeCar()) {
      ViewElement(lms.activeCar().id)
    } else {
      const pid = localStorage.getItem('playerId')
      if (
        pid &&
        lms
          .cars()
          .map((elem) => elem.playerId)
          .includes(pid)
      ) {
        ViewElement(lms.player({ id: localStorage.getItem('playerId') }).carIds[0])
      }
    }
  }

  render() {
    const lms = new LocalMatchState(this.props.matchData)
    return (
      <svg id="ArenaMap" width={lms.mapSize().width} height={lms.mapSize().height}>
        <MapBackground matchData={this.props.matchData} />
        <Walls matchData={this.props.matchData} />
        {Object.values(lms.cars()).map((car) => {
          return <Car key={car.id} matchData={this.props.matchData} id={car.id} client={this.props.client} />
        })}
        {Object.values(lms.cars()).map((car) => {
          return <Car key={`shadow-${car.id}`} matchData={this.props.matchData} id={car.id} shadow={true} />
        })}
        <ActiveCar matchData={this.props.matchData} />
      </svg>
    )
  }
}

ArenaMap.propTypes = {
  client: PropTypes.object,
  matchData: PropTypes.object,
}

export default ArenaMap
