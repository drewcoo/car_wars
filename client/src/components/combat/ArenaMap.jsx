import * as React from 'react'
import LocalMatchState from './lib/LocalMatchState'
import Car from './Car'
import MapBackground from './MapBackground'
import Walls from './Walls'
import ActiveCar from './ActiveCar'

class ArenaMap extends React.Component {
  render() {
    const lms = new LocalMatchState(this.props.matchData)
    return (
      <svg
        id='ArenaMap'
        width={ lms.mapSize().width }
        height={ lms.mapSize().height }
      >
        <MapBackground matchData={ this.props.matchData } />
        <Walls matchData={ this.props.matchData } />
        {
          Object.values(lms.cars()).map((car) => {
            return (
              <Car key={ car.id } matchData={ this.props.matchData } id={ car.id } />
            )
          })
        }
        {
          Object.values(lms.cars()).map((car) => {
            return(
              <Car key= { `shadow-${car.id}` } matchData={ this.props.matchData }
                id={ car.id }
                shadow={ true }
              />
            )
          })
        }
        <ActiveCar matchData={this.props.matchData} />
      </svg>
    )
  }
}

export default ArenaMap
