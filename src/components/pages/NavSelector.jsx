import React from 'react'
import {
//  BrowserRouter as Router,
  Switch,
  Route,
  // Link,
  //  useRouteMatch,
  //  useParams,
  withRouter
} from 'react-router-dom'

import Home from './Home'
import Match from './matches/Play'
import MatchNew from './matches/New'
import Matches from './matches/List'
import '../../App.css'

class NavSelector extends React.Component {
  constructor (props) {
    super(props)
    this.state = { value: '' }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (event) {
    this.props.history.push(event.target.value)
    document.getElementById('navOptions').blur()
  }

  render () {
    return (
      <div>
        <div id='navOptions'>
          <select
            className='NavOptions'
            autoFocus
            id={ 'mainNav' }
            onChange={ this.handleChange }
          >
            <option value='/'>Car Wars</option>
            <option value='/match/new'>New Match</option>
            <option value='/matches'>List Matches</option>
        </select>
        </div>
        <Switch>
          <Route path="/match/new">
            <MatchNew />
          </Route>
          <Route path="/match/:matchId">
            <Match />
          </Route>
          <Route path="/matches">
            <Matches />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    )
  }
}

export default withRouter(NavSelector)
