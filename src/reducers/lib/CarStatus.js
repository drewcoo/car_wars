
import { Maneuvers } from './Maneuvers'

import Design from '../../vehicleDesigns/KillerKart'

class CarStatus {
  static addCar ({ id, design, color, name, player, startingPosition }) {
    if (!player) { player = { color: color } }

    design = Design
    //  design = KillerKart

    var car = {
      id: id,
      name: name,
      design: design, // change name to design?
      player: player,
      color: player.color,
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
