import React from 'react'
import { withRouter } from 'react-router'
import { Query } from 'react-apollo'
import KeystrokeInput from '../../combat/controls/KeystrokeInput'
import Maneuver from '../../combat/controls/ManeuverSelector'
import Speed from '../../combat/controls/SpeedSelector'
import SwitchUser from '../../combat/controls/SwitchUser'
import Target from '../../combat/controls/TargetSelector'
import Weapon from '../../combat/controls/WeaponSelector'
import LocalMatchState from '../../combat/lib/LocalMatchState'
import ArenaMap from '../../combat/ArenaMap'
import CarInset from '../../combat/CarInset'
import CarStats from '../../combat/CarStats'
import Phase from '../../combat/timing/Phase'
import VehicleName from '../../combat/VehicleName'
import Turn from '../../combat/timing/Turn'
import completeMatchData from '../../graphql/queries/completeMatchData'
import '../../../App.css'

const MATCH_DATA = completeMatchData

class Match extends React.Component {
  constructor (props) {
    super(props)
    this.state = { userId: null }
    this.onUserIdChange = this.onUserIdChange.bind(this)
  }

  onUserIdChange(userId) {
    this.setState({ userId: userId })
  }

  render() {
    const matchId = this.props.match.params.matchId
    return(
      <Query
        pollInterval={ 250 }
        query={ MATCH_DATA }

        variables={{ matchId }}>
        {({ loading, error, data }) => {
          if (loading) {
            console.log('loading')
            return "Loading..."
          }
          if (error){
            console.log('error')
            console.log(error)
            return `Error! ${error.message}`
          }

          const matchData = data.completeMatchData
          if (this.state.userId) {
            matchData.playerSession = this.state.userId
          } else {
            matchData.playerSession = new LocalMatchState(matchData).currentPlayerId()
          }
          matchData.location = this.props.location

          return (
            <div>
              <KeystrokeInput client={this.props.client} matchData={ matchData } />
              <div>
                <div className='LeftColumn'>
                  <div className='TitleRow'>
                    <span>
                      <SwitchUser matchData={ matchData } onUserIdChange={ this.onUserIdChange } />
                      <Turn client={this.props.client} matchData={ matchData } />
                      <Phase client={this.props.client} matchData={ matchData } />
                    </span>
                  </div>
                  <div className='MapBorder'>
                    <div className='ArenaMap'>
                      <svg
                        width={ matchData.match.map.size.width }
                        height={ matchData.match.map.size.height }>
                        <ArenaMap client={this.props.client} matchData={ matchData } />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="RightColumn">
                  <span className='CurrentVehicle'>
                    <VehicleName matchData={ matchData } />
                  </span>
                  <div className='CarInset'>
                    <CarInset matchData={ matchData } />
                  </div>
                  <div className='CarStats'>
                    <CarStats matchData={ matchData } />
                  </div>
                  <div className='ActionControls'>
                    <span className='Speed'><u>S</u>peed:&nbsp;&nbsp;<Speed matchData={ matchData } /></span><br/>
                    <span className='Maneuver'><u>M</u>aneuver:&nbsp;&nbsp;<Maneuver matchData={ matchData } /></span><br/>
                    <span className='Weapon'><u>W</u>eapon:&nbsp;&nbsp;<Weapon matchData={ matchData } /></span><br/>
                    <span className='Target'><u>T</u>arget:&nbsp;&nbsp;<Target matchData={ matchData } /></span>
                  </div>
                </div>
              </div>
              { /* <Modal matchData={ matchData } /> */ }
            </div>
          )
        }}
      </Query>
    )
  }
}

export default withRouter(Match)
