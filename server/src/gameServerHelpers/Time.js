import Phase from './Phase'

class Time {
  static nextMover ({ match }) {
    console.log('next mover')

    Phase.subphase3_maneuver({ match })
  }
}

export default Time
