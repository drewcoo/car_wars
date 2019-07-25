import React, {Component} from 'react';
import { Provider } from 'react-redux';
import { store } from './redux';
import './App.css';

import Maneuver from './components/actions/Maneuver';
import Speed from './components/actions/Speed';
import Target from './components/actions/Target';
import Weapon from './components/actions/Weapon';

import ArenaMap from './components/ArenaMap';
import CarInset from './components/CarInset';
import CarStats from './components/CarStats';
import KeystrokeInput from './components/KeystrokeInput';
import PlayerName from './components/PlayerName';


class App extends Component {
  componentDidMount() {
    console.log('mount');
    //var car = get_current_car();
    var element = document.getElementById('ghost');
    element.scrollIntoViewIfNeeded(); //scrollIntoView();//{ block: 'center', inline: 'center' });
    element.scrollIntoView({ block: 'center', inline: 'center' });
  }

  componentDidUpdate() {
    console.log("hello");
    //var car = get_current_car();
    var element = document.getElementById('ghost');
    element.scrollIntoViewIfNeeded(); //scrollIntoView();//{ block: 'center', inline: 'center' });
    element.scrollIntoView({ block: 'center', inline: 'center' });
  }

  render() {
    return (
  <Provider store={store}>
    <KeystrokeInput />
    <div>
      <div className='LeftColumn'>
        <div className='TitleRow'>
          <span className='Title'>turn using:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;x &lt;-- . --&gt; z</span>
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
          <CarStats  />
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
    );
  }
}


export default App;
