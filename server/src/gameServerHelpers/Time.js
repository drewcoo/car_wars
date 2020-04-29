import Collisions from './Collisions'
import { Maneuvers } from './Maneuvers'
import Movement from './Movement'
import PhasingMove from './PhasingMove'
import { INCH } from '../utils/constants'
import Log from '../utils/Log'
import Targets from './Targets'
import VehicleStatusHelper from './VehicleStatusHelper'

import Phase from './Phase'

import { DATA,  matchCars } from '../DATA'

class Time {
  static nextMover ({ match }) {
    console.log('next mover')

    Phase.subphase3_maneuver({ match })

  }
}

export default Time
