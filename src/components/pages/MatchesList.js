import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { store } from '../../redux'
import '../../App.css'

class MatchesList extends React.Component {
  constructor (props) {
    super(props)
    this.state = { value: '' }
  }

  listMatches () {
    var result = []
    Object.keys(store.getState().matches).forEach(elem => {
      result.push(
        <li>
          <Link to={`/arena/${elem}`} style={ this.colorStyle() }>
            { elem }
          </Link>
        </li>
      )
    })
    return (
      <ul>{ result }</ul>
    )
  }

  colorStyle (myColor = 'white') {
    return {
      background: 'black',
      color: myColor,
      fontSize: '40px',
      fontFamily: 'fantasy',
      fontVariant: 'small-caps'
    }
  }

  render () {
    return (
      <div style={ this.colorStyle() }>
        { this.listMatches() }
      </div>
    )
  }
}

export default withRouter(MatchesList)
