import LocalMatchState from './LocalMatchState'

class Session {
  static godMode(matchdata) {
    return matchdata.location.search.match(/godmode/i)
  }

  static currentPlayer(matchData) {
    return matchData.playerSession === (new LocalMatchState(matchData).currentPlayerId())
  }
}
export default Session
