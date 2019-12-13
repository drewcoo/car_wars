import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
//  Link
//  useRouteMatch,
//  useParams
} from 'react-router-dom'

import Arena from './Arena'
import Home from './Home'
import Start from './Start'

const NavSelector = (props) => {
  const optionStyle = {
    background: 'black',
    color: 'white',
    fontSize: '40px',
    fontFamily: 'fantasy',
    fontVariant: 'small-caps'
  }

  const onChange = (event) => {
    document.location.href = event.target.value
  }

  return (
    <Router>
      <div>
        <select id={ 'mainNav' }
          style={ optionStyle }
          onChange={ onChange }
        >
          <option value='/'>Home</option>
          <option value='/arena'>The Arena</option>
          <option value='/start'>Start a Battle</option>
        </select>
      </div>
      <Switch>
        <Route path="/arena">
          <Arena />
        </Route>
        <Route path="/start">
          <Start />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  )
}

export default NavSelector
