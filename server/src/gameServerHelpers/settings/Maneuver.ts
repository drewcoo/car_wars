import Actions from './Actions'
import Collisions from '../Collisions'
import Match from '../Match'

class Maneuver {
  static next({ vehicle, match }: { vehicle: any; match: any }) {
    //const match = Match.withVehicle({ vehicle })
    const allVehicles = Match.cars({ match })
    Actions.showHidevehicle(vehicle, 1)
    vehicle.phasing.maneuverIndex = (vehicle.phasing.maneuverIndex + 1) % vehicle.status.maneuvers.length
    Collisions.detect({ cars: allVehicles, map: match.map, thisCar: vehicle })
  }

  static previous({ vehicle, match }: { vehicle: any; match: any }) {
    // const match = Match.withVehicle({ vehicle })
    const allVehicles = Match.cars({ match })
    Actions.showHidevehicle(vehicle, -1)

    vehicle.phasing.maneuverIndex =
      (vehicle.phasing.maneuverIndex - 1 + vehicle.status.maneuvers.length) % vehicle.status.maneuvers.length
    Collisions.detect({ cars: allVehicles, map: match.map, thisCar: vehicle })
  }

  static set({ vehicle, match, maneuverIndex }: { vehicle: any; match: any; maneuverIndex: number }) {
    //const match = Match.withVehicle({ vehicle })
    const allVehicles = Match.cars({ match })
    Actions.showHidevehicle(vehicle, maneuverIndex - vehicle.phasing.maneuverIndex)

    vehicle.phasing.maneuverIndex = parseInt(`${maneuverIndex}`)
    Collisions.detect({ cars: allVehicles, map: match.map, thisCar: vehicle })
  }
}

export default Maneuver
