// import React, { Component } from 'react'
import React from 'react'
import { Provider } from 'react-redux'
import { store } from '../redux'

import KeystrokeInput from '../components/combat/controls/KeystrokeInput'
import Maneuver from '../components/combat/controls/ManeuverSelector'
import Speed from '../components/combat/controls/SpeedSelector'
import Target from '../components/combat/controls/TargetSelector'
import Weapon from '../components/combat/controls/WeaponSelector'

import ArenaMap from '../components/combat/ArenaMap'
import CarInset from '../components/combat/CarInset'
import CarStats from '../components/combat/CarStats'

import PlayerName from '../components/combat/PlayerName'
import Phase from '../components/combat/timing/Phase'
import Turn from '../components/combat/timing/Turn'

import '../App.css'

const Arena = () => {
  return (
    <Provider store={store}>
      <KeystrokeInput />
      <div>
        <div className='LeftColumn'>
          <div className='TitleRow'>
            <span className='Title'>Car Wars</span>
            <span>
              <Turn />
              <Phase />
            </span>
          </div>
          <div className='MapBorder'>
            <div className='ArenaMap'>
              <ArenaMap />
            </div>
          </div>
        </div>
        <div className="RightColumn">
          <span className='CurrentPlayer'>
            <PlayerName />
          </span>
          <div className='CarInset'>
            <CarInset />
          </div>
          <div className='CarStats'>
            <CarStats />
          </div>
          <div className='ActionControls'>
            <span className='Speed'><u>S</u>peed:&nbsp;&nbsp;<Speed /></span><br/>
            <span className='Maneuver'><u>M</u>aneuver:&nbsp;&nbsp;<Maneuver /></span><br/>
            <span className='Weapon'><u>W</u>eapon:&nbsp;&nbsp;<Weapon /></span><br/>
            <span className='Target'><u>T</u>arget:&nbsp;&nbsp;<Target /></span>
          </div>
        </div>
      </div>
    </Provider>
  )
}

export default Arena
