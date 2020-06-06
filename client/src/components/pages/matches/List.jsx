import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { graphql } from 'react-apollo'
import '../../../App.css'
import matches from '../../graphql/queries/matches'

const MATCH_QUERY = graphql(matches)

class List extends React.Component {
  constructor(props) {
    super(props)
    this.state = { value: '' }
  }

  listList() {
    if (!this.props.data) {
      throw new Error('no data')
    }
    const { loading, matches, error } = this.props.data
    if (loading) return <div>loading </div>
    if (error) return <div>{error} </div>

    return (
      <ul>
        {matches.map((m) => {
          return (
            <span key={m.id}>
              {m.status}
              {': '}
              <Link style={this.colorStyle()} to={`/match/${m.id}`}>
                {m.id}
              </Link>
              <br />
            </span>
          )
        })}
      </ul>
    )
  }

  colorStyle(myColor = 'white') {
    return {
      background: 'black',
      color: myColor,
      fontSize: '40px',
      fontFamily: 'fantasy',
      fontVariant: 'small-caps',
    }
  }

  render() {
    if (document.getElementById('navOptions')) {
      document.getElementById('navOptions').style.display = ''
    }
    return <div style={this.colorStyle()}>{this.listList()}</div>
  }
}

export default withRouter(MATCH_QUERY(List))
