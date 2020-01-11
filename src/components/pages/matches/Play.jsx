import React from 'react'
import { Provider } from 'react-redux'
import { store } from '../../../redux'
import { withRouter } from 'react-router'

import KeystrokeInput from '../../combat/controls/KeystrokeInput'
import Maneuver from '../../combat/controls/ManeuverSelector'
import Modal from '../../combat/controls/Modal'
import Speed from '../../combat/controls/SpeedSelector'
import Target from '../../combat/controls/TargetSelector'
import Weapon from '../../combat/controls/WeaponSelector'
import ArenaMap from '../../combat/ArenaMap'
import CarInset from '../../combat/CarInset'
import CarStats from '../../combat/CarStats'
import Phase from '../../combat/timing/Phase'
import PlayerName from '../../combat/PlayerName'
import Turn from '../../combat/timing/Turn'

import '../../../App.css'

class Match extends React.Component {
  render() {
    const matchId = this.props.match.params.matchId

    return (
      <Provider store={ store } >
        <KeystrokeInput matchId={ matchId } />
        <div>
          <div className='LeftColumn'>
            <div className='TitleRow'>
              <span>
                <Turn matchId={ matchId } />
                <Phase matchId={ matchId } />
              </span>
            </div>
            <div className='MapBorder'>
              <div className='ArenaMap'>
                <ArenaMap matchId={ matchId } />
              </div>
            </div>
          </div>
          <div className="RightColumn">
            <span className='CurrentPlayer'>
              <PlayerName matchId={ matchId } />
            </span>
            <div className='CarInset'>
              <CarInset matchId={ matchId } />
            </div>
            <div className='CarStats'>
              <CarStats matchId={ matchId } />
            </div>
            <div className='ActionControls'>
              <span className='Speed'><u>S</u>peed:&nbsp;&nbsp;<Speed matchId={ matchId } /></span><br/>
              <span className='Maneuver'><u>M</u>aneuver:&nbsp;&nbsp;<Maneuver matchId={ matchId } /></span><br/>
              <span className='Weapon'><u>W</u>eapon:&nbsp;&nbsp;<Weapon matchId={ matchId } /></span><br/>
              <span className='Target'><u>T</u>arget:&nbsp;&nbsp;<Target matchId={ matchId } /></span>
            </div>
          </div>
        </div>
        <Modal matchId={ matchId } />
      </Provider>
    )
  }
}

export default withRouter(Match)
