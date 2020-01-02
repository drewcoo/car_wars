import React from 'react'
import { Provider } from 'react-redux'
import { store } from '../../redux'
import { useParams } from 'react-router-dom'

import KeystrokeInput from '../combat/controls/KeystrokeInput'
import Maneuver from '../combat/controls/ManeuverSelector'
import Speed from '../combat/controls/SpeedSelector'
import Target from '../combat/controls/TargetSelector'
import Weapon from '../combat/controls/WeaponSelector'
import ArenaMap from '../combat/ArenaMap'
import CarInset from '../combat/CarInset'
import CarStats from '../combat/CarStats'
import Phase from '../combat/timing/Phase'
import PlayerName from '../combat/PlayerName'
import Turn from '../combat/timing/Turn'

import '../../App.css'

const Arena = (props) => {
  var passedParams = useParams()

  return (
    <Provider store={ store } >
      <KeystrokeInput matchId={ passedParams.matchId } />
      <div>
        <div className='LeftColumn'>
          <div className='TitleRow'>
            <span>
              <Turn matchId={ passedParams.matchId } />
              <Phase matchId={ passedParams.matchId } />
            </span>
          </div>
          <div className='MapBorder'>
            <div className='ArenaMap'>
              <ArenaMap matchId={ passedParams.matchId } />
            </div>
          </div>
        </div>
        <div className="RightColumn">
          <span className='CurrentPlayer'>
            <PlayerName matchId={ passedParams.matchId } />
          </span>
          <div className='CarInset'>
            <CarInset matchId={ passedParams.matchId } />
          </div>
          <div className='CarStats'>
            <CarStats matchId={ passedParams.matchId } />
          </div>
          <div className='ActionControls'>
            <span className='Speed'><u>S</u>peed:&nbsp;&nbsp;<Speed matchId={ passedParams.matchId } /></span><br/>
            <span className='Maneuver'><u>M</u>aneuver:&nbsp;&nbsp;<Maneuver matchId={ passedParams.matchId } /></span><br/>
            <span className='Weapon'><u>W</u>eapon:&nbsp;&nbsp;<Weapon matchId={ passedParams.matchId } /></span><br/>
            <span className='Target'><u>T</u>arget:&nbsp;&nbsp;<Target matchId={ passedParams.matchId } /></span>
          </div>
        </div>
      </div>
    </Provider>
  )
}

export default Arena
