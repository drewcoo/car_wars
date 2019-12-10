import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { store } from './redux'
import './App.css'

import KeystrokeInput from './components/controls/KeystrokeInput'
import Maneuver from './components/controls/ManeuverSelector'
import Speed from './components/controls/SpeedSelector'
import Target from './components/controls/TargetSelector'
import Weapon from './components/controls/WeaponSelector'

import ArenaMap from './components/ArenaMap'
import CarInset from './components/CarInset'
import CarStats from './components/CarStats'

import PlayerName from './components/PlayerName'
import Phase from './components/timing/Phase'
import Turn from './components/timing/Turn'

class App extends Component {
  componentDidMount () {
    console.log('mount')
    // var car = getCurrentCar();
    var element = document.getElementById('ghost')
    element.scrollIntoViewIfNeeded() // scrollIntoView();//{ block: 'center', inline: 'center' });
    element.scrollIntoView({ block: 'center', inline: 'center' })
  }

  componentDidUpdate () {
    console.log('hello')
    // var car = getCurrentCar();
    var element = document.getElementById('ghost')
    element.scrollIntoViewIfNeeded() // scrollIntoView();//{ block: 'center', inline: 'center' });
    element.scrollIntoView({ block: 'center', inline: 'center' })
  }

  render () {
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
              <span className='Speed'><u>S</u>peed:&nbsp;&nbsp; <Speed /></span><br/>
              <span className='Maneuver'><u>M</u>aneuver:&nbsp;&nbsp;<Maneuver /></span><br/>
              <span className='Weapon'><u>W</u>eapon:&nbsp;&nbsp; <Weapon /></span><br/>
              <span className='Target'><u>T</u>arget:&nbsp;&nbsp; <Target /></span>
            </div>
          </div>
        </div>
      </Provider>
    )
  }
}

export default App
