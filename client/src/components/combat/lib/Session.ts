import LocalMatchState from './LocalMatchState'
import queryString from 'query-string'

class Session {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static params(matchData: any): any {
    return queryString.parse(matchData.location.search)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static godMode(matchData: any): any {
    return Session.params(matchData).godmode
  }

  static lurking(): boolean {
    return !localStorage.getItem('playerId')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static whoami(matchData: any): string {
    const id = localStorage.getItem('playerId')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const found = matchData.players.find((obj: any) => obj.id === id)
    if (found) {
      return found.name
    }
    return 'lurker'
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static loggedInAsActivePlayer(matchData: any): boolean {
    const lms = new LocalMatchState(matchData)
    const activePlayerId = lms.activePlayerId()
    if (activePlayerId === null) {
      throw new Error('no active player!')
    }
    return localStorage.getItem('playerId') === activePlayerId
  }
}
export default Session
