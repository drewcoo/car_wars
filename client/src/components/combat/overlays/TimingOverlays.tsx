import * as React from 'react'
import LocalMatchState from '../lib/LocalMatchState'
import SpeedModal from './timing/subphase2SetSpeeds/SpeedModal'
import ManeuverModal from './timing/subphase4Maneuver/ManeuverModal'
import FireModal from './timing/subphase5FireWeapons/FireModal'
import DamageModal from './timing/subphase6Damage/DamageModal'
import MatchOverModal from './MatchOverModal'
import RevealSpeedChangeModal from './timing/subphase3RevealSpeedChange/RevealSpeedChangeModal'
import uuid from 'uuid/v4'

import Reticle from './vehicle/Reticle'
import ShowDamage from './vehicle/ShowDamage'
import SpeedChange from './vehicle/SpeedChange'

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  matchData: any
  id: string
}

class TimingOverlays extends React.Component<Props> {
  constructor(props: Props) {
    super(props) // matchData and carId
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e: any): void {
    // e.stopPropagation()
  }

  render(): React.ReactNode {
    const lms = new LocalMatchState(this.props.matchData)
    const car = lms.car({ id: this.props.id })
    const subphase = this.props.matchData.match.time.phase.subphase

    switch (subphase) {
      case '0_increment_time':
        console.log(this.props.matchData)
        return <MatchOverModal />
      case '1_start':
        break
      case '2_set_speeds':
        // after this, show new speeds/changes?
        return (
          <SpeedModal key={uuid()} client={this.props.client} matchData={this.props.matchData} carId={this.props.id} />
        )

      case '3_reveal_speed_change':
        return (
          <>
            <ShowDamage key={`damCar-${this.props.id}`} matchData={this.props.matchData} carId={this.props.id} />
            <Reticle carId={this.props.id} matchData={this.props.matchData} />
            <RevealSpeedChangeModal
              key={uuid()}
              client={this.props.client}
              matchData={this.props.matchData}
              carId={this.props.id}
            />
            <SpeedChange matchData={this.props.matchData} carId={this.props.id} />
          </>
        )
      case '4_maneuver':
        return (
          <ManeuverModal
            key={uuid()}
            client={this.props.client}
            matchData={this.props.matchData}
            carId={this.props.id}
          />
        )
      case '5_fire_weapons':
        return (
          <FireModal key={uuid()} client={this.props.client} matchData={this.props.matchData} carId={this.props.id} />
        )
      case '6_damage':
        if (!car) {
          return <></>
        }
        // either make this a timeout or modals all around if there were shots fired
        // show weapons fire animations plus damage/miss stickers
        return (
          <>
            <ShowDamage key={`damCar-${this.props.id}`} matchData={this.props.matchData} carId={this.props.id} />
            <DamageModal
              key={uuid()}
              client={this.props.client}
              matchData={this.props.matchData}
              carId={this.props.id}
            />

            <SpeedChange matchData={this.props.matchData} carId={this.props.id} />
          </>
        )
      case '7_end':
        break
      default:
        throw new Error(`unknown subphase: ${subphase}`)
    }
  }
}

export default TimingOverlays
