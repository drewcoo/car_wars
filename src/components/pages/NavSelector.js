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

class NavSelector extends React.Component {
  constructor (props) {
    super(props)
    this.state = { value: '' }
    this.handleChange = this.handleChange.bind(this)
  }

  optionStyle () {
    return {
      background: 'black',
      color: 'white',
      fontSize: '40px',
      fontFamily: 'fantasy',
      fontVariant: 'small-caps'
    }
  }

  handleChange (event) {
    this.props.history.push(event.target.value)
  }

  render () {
    return (
      <div>
        <div>
          <span className='Title'>Car Wars</span>
          <select id={ 'mainNav' }
            style={ this.optionStyle() }
            onChange={ this.handleChange }
          >
            <option></option>
            <option value='/about'>About</option>
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
          <Route path="/about">
            <Home />
          </Route>
        </Switch>
      </div>
    )
  }
}

export default withRouter(NavSelector)
