import * as React from 'react'
import LocalMatchState from './lib/LocalMatchState'

class VehicleName extends React.Component {
  props: any
  lms: any
  render() {
    const lms = new LocalMatchState(this.props.matchData)
    const vehicle = lms.activeCar()
    if (!vehicle) { return (<></>) }
    const player = lms.activePlayer()

    const colorStyle = {
      color: player.color,
      paddingRight: '1em'
    }

    return (
      <>
        <span style={ colorStyle }>{ player.name }</span>
        <span style={ colorStyle }>{ vehicle.name }</span>
      </>
    )
  }
}

export default VehicleName
