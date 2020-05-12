import LocalMatchState from './LocalMatchState'
import queryString from 'query-string'

class Session {
  static params(matchData) {
    console.log(matchData)
    return queryString.parse(matchData.location.search)
  }

  static godMode(matchData) {
    return Session.params(matchData).godmode
  }

  static lurking() {
    return !localStorage.getItem('playerId')
  }

  static whoami(matchData) {
    const id = localStorage.getItem('playerId')
    console.log(id)
    console.log(matchData.players)
    const found = matchData.players.find((obj) => obj.id === id)
    if (found) {
      return found.name
    }
    return 'lurker'
  }

  static loggedInAsActivePlayer(matchData) {
    const lms = new LocalMatchState(matchData)
    const activePlayerId = lms.activePlayerId()
    console.log(`activePlayerId: ${activePlayerId}`)
    if (activePlayerId === null) {
      return null
    }
    console.log(activePlayerId + ' - ' + lms.activePlayer().color)
    console.log(localStorage.getItem('playerId'))
    return localStorage.getItem('playerId') === activePlayerId
  }
}
export default Session
