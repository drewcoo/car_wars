import { Maneuvers } from './Maneuvers'
import Design from '../../vehicleDesigns/KillerKart'

class CarStatus {
  static addCar ({ color, design, id, name, playerId, startingPosition }) {
    // Currently, hard-coded to Killer Kart.
    design = Design

    const car = {
      id: id,
      name: name,
      design: design, // change name to design?
      playerId: playerId,
      color: color,
      collisionDetected: false,
      collisions: [],
      phasing: {
        rect: startingPosition.clone(),
        damageMarkerLocation: null,
        damageMessage: '',
        difficulty: 0,
        maneuverIndex: 0,
        speedChanges: [0, 5, 10, 15, 20],
        speedChangeIndex: 2,
        weaponIndex: 0,
        targets: [],
        targetIndex: 0,
        collisionDetected: false,
        collisions: []
      },
      rect: startingPosition.clone(),
      status: {
        handling: design.attributes.handlingClass,
        speed: 10,
        changedSpeed: false,
        maneuvers: Maneuvers()
      }
    }
    return car
  }
}

export default CarStatus
