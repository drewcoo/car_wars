import React from 'react'
import { withRouter } from 'react-router'
import { Query } from 'react-apollo'
import SwitchUser from '../../combat/controls/SwitchUser'
import LocalMatchState from '../../combat/lib/LocalMatchState'
import Session from '../../combat/lib/Session'
import ArenaMap from '../../combat/ArenaMap'
import Phase from '../../combat/timing/Phase'
import Turn from '../../combat/timing/Turn'
import completeMatchData from '../../graphql/queries/completeMatchData'
import '../../../App.css'

const MATCH_DATA = completeMatchData

class Match extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      playerId: localStorage.getItem('playerId')
    }
    this.onUserIdChange = this.onUserIdChange.bind(this)
  }

  onUserIdChange (playerId) {
    localStorage.setItem('playerId', playerId)
    this.setState({ playerId: playerId })
  }

  render () {
    console.log(this.state.playerId)

    const matchId = this.props.match.params.matchId

    return (
      <Query pollInterval={250} query={MATCH_DATA} variables={{ matchId }}>
        {({ loading, error, data }) => {
          if (loading) {
            console.log('loading')
            return 'Loading...'
          }
          if (error) {
            console.log('error')
            console.log(error)
            return `Error! ${error.message}`
          }

          if (document.getElementById('navOptions')) {
            document.getElementById('navOptions').style.display = 'none'
          }

          const matchData = data.completeMatchData
          matchData.location = this.props.location

          if (Session.godMode(matchData)) {
            if (
              !localStorage.getItem('playerId') ||
              !matchData.players.find(
                (obj) => obj.id === localStorage.getItem('playerId')
              )
            ) {
              console.log(
                `RESETTING TO ${matchData.players[0].color} PLAYER: ${matchData.players[0].id}`
              )
              localStorage.setItem('playerId', matchData.players[0].id)
            }
          }

          if (this.state.playerId) {
            matchData.playerSession = this.state.playerId
          } else if (matchData.match.time.phase.moving) {
            matchData.playerSession = new LocalMatchState(
              matchData
            ).activePlayerId()
          } else {
            // can get here if not a player
            // as a lurker you can still watch and even click on things to inspect
          }

          return (
            <div>
              <div className="TitleRow">
                <span>
                  <SwitchUser
                    matchData={matchData}
                    onUserIdChange={this.onUserIdChange}
                  />
                  <Turn client={this.props.client} matchData={matchData} />
                  <Phase client={this.props.client} matchData={matchData} />
                </span>
              </div>
              <div className="MapBorder">
                <div className="ArenaMap">
                  <svg
                    width={matchData.match.map.size.width}
                    height={matchData.match.map.size.height}
                  >
                    <ArenaMap
                      client={this.props.client}
                      matchData={matchData}
                    />
                  </svg>
                </div>
              </div>
            </div>
          )
        }}
      </Query>
    )
  }
}

export default withRouter(Match)
