import * as React from 'react'
import {connect} from "react-redux"
import MatchWrapper from '../../utils/wrappers/MatchWrapper'

const mapStateToProps = (state: any) => {
  return({ matches: state.matches })
}

class CarStats extends React.Component {
  props: any
  // props.matchId

  render() {
    const match = new MatchWrapper({ match: this.props.matches[this.props.matchId] })
    const car = match.currentCar()
    const warnStyle: { color: string, visibility: 'hidden' | 'visible'} = {
      color: 'yellow',
      visibility: (car.phasing.difficulty === 0) ? 'hidden' : 'visible'
    }

    return (
      <div>
        <span>{ car.design.attributes.size }</span><br/>
        <span>{ car.design.attributes.chassis } chassis</span><br/>
        <span>{ car.design.attributes.suspension } suspension</span><br/>
        <span>${ car.design.attributes.cost }</span><br/>
        <span>{ car.design.attributes.weight } lbs</span><br/><br/>
        <span>top speed: { car.design.attributes.topSpeed }</span><br/>
        <span>acc: { car.design.attributes.acceleration }</span><br/>
        <span>hc: { car.design.attributes.handlingClass }</span><br/><br/>
        <span>handling: { car.status.handling }</span><br/>
        <span style={ warnStyle }>D{ car.phasing.difficulty } maneuver</span><br/><br/>
        <span>SPEED: { car.status.speed }</span>
      </div>
    )
  }
}

export default connect(mapStateToProps)(CarStats)
