import * as React from 'react'
import LocalMatchState from '../lib/LocalMatchState'
import SpeedModal from './timing/subphase2SetSpeeds/SpeedModal'
import ManeuverModal from './timing/subphase4Maneuver/ManeuverModal'
import FireModal from './timing/subphase5FireWeapons/FireModal'
import DamageModal from './timing/subphase6Damage/DamageModal'
import RevealSpeedChangeModal from './timing/subphase3RevealSpeedChange/RevealSpeedChangeModal'
import uuid from 'uuid/v4'

import Reticle from './vehicle/Reticle'
import Damage from './vehicle/Damage'
import SpeedChange from './vehicle/SpeedChange'

class TimingOverlays extends React.Component {
  props: any
  lms: any

  constructor(props: any) {
    super(props) // matchData and carId
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e: any) {
    // e.stopPropagation()
  }

  render() {
    const lms = new LocalMatchState(this.props.matchData)
    const car = lms.car({ id: this.props.id })
    const subphase = this.props.matchData.match.time.phase.subphase

    switch (subphase) {
      case '1_start':
        break
      case '2_set_speeds':
        // after this, show new speeds/changes?
        return (
          <SpeedModal
            key={uuid()}
            client={this.props.client}
            matchData={this.props.matchData}
            carId={this.props.id} />
        )
      case '3_reveal_speed_change':
        return (
          <>
            <Damage
              key={`damCar-${this.props.carId}`}
              client={this.props.client}
              matchData={this.props.matchData}
              carId={this.props.id} />
            <Reticle
              client={this.props.client}
              matchData={this.props.matchData} />
            <RevealSpeedChangeModal
              key={uuid()}
              client={this.props.client}
              matchData={this.props.matchData}
              carId={this.props.id} />
            <SpeedChange
              matchData={this.props.matchData}
              carId={this.props.id} />
          </>
        )
      case '4_maneuver':
        return (
          <ManeuverModal
            key={uuid()}
            client={this.props.client}
            matchData={this.props.matchData}
            carId={this.props.id} />
        )
      case '4_fire_weapons':
        return (
          <FireModal
            key={uuid()}
            client={this.props.client}
            matchData={this.props.matchData}
            carId={this.props.id} />
        )
      case '6_damage':
        if (!car) { return (<></>) }
        // either make this a timeout or modals all around if there were shots fired
        // show weapons fire animations plus damage/miss stickers
        return (
          <>
            <Damage
              key={`damCar-${this.props.carId}`}
              client={this.props.client}
              matchData={this.props.matchData}
              carId={this.props.id} />
            <DamageModal
              key={uuid()}
              client={this.props.client}
              matchData={this.props.matchData}
              carId={this.props.id} />
            <Reticle
              client={this.props.client}
              matchData={this.props.matchData} />
            <SpeedChange
              matchData={this.props.matchData}
              carId={this.props.id} />
          </>
        )
      case '6_end':
        break
      default:
        throw new Error(`unknown subphase: ${subphase}`)
    }
  }
}

export default TimingOverlays
