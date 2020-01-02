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

import Arena from './Arena'
import Home from './Home'
import MatchesNew from './MatchesNew'
import MatchesList from './MatchesList'

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
            <option value='/new_match'>New Match</option>
            <option value='/list_match'>List Matches</option>
          </select>
        </div>
        <Switch>
          <Route path="/arena/:matchId">
            <Arena />
          </Route>
          <Route path="/new_match">
            <MatchesNew />
          </Route>
          <Route path="/list_match">
            <MatchesList />
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
