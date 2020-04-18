import _ from 'lodash'
import { DATA,  matchCars } from '../DATA'
import Log from '../utils/Log'
import VehicleStatusHelper from './VehicleStatusHelper'

class Movement {
  static distanceThisPhase({ speed, phase }) {
    const MovementChart = [
      [   0,    0,    0,    0,    0 ], // 0 mph
      [ 0.5,    0,    0,    0,    0 ],
      [   1,    0,    0,    0,    0 ],
      [   1,    0,  0.5,    0,    0 ],
      [   1,    0,    1,    0,    0 ],

      [   1,    0,    1,    0,  0.5 ], // 25 mph
      [   1,    0,    1,    0,    1 ],
      [   1,  0.5,    1,    0,    1 ],
      [   1,    1,    1,    0,    1 ],
      [   1,    1,    1,  0.5,    1 ],
    ]
    if (phase < 1 || phase > 5) { throw new Error(`There is no phase ${phase}`) }
    return(MovementChart[(speed % 50)/5][phase - 1] + Math.floor(speed / 50))
  }

  static canMoveThisPhase({ match }) {
    function checkMove(car) {
      return Movement.distanceThisPhase({
        speed: car.status.speed,
        phase: match.time.phase.number
      }) !== 0
    }

    return match.carIds.map(id => DATA.cars.find(car => car.id === id)) // too much data
                       .filter((car) => checkMove(car) > 0)
                       .map((car)=> car.id)
  }

  static checkIfKilled({ car }) {
    // A “kill” is scored when an enemy vehicle can no longer move or fire, either
    // because of a direct attack, a crash during combat, surrender of the occupants,
    // or other circumstance
    if (car.status.kiled === true) { return }
    if (car.status.speed != 0) { return } // moving
    if (Movement.driverOut({ car }) ||
        (Movement.plantOut({ car }) &&
         Movement.weaponsOut({ car }) ) ) {
      car.status.killed = true
      car.status.nextMove = []
    }
  }

  static driverOut({ car }) {
    let driver = car.design.components.crew.find(member => member.role === 'driver')
    // 1 is unconscious; 0 is dead
    return (driver.damagePoints < 2)
  }

  static plantOut({ car }) {
    return (car.design.components.powerPlant.damagePoints === 0)
  }

  static weaponsOut({ car }) {
    let workingWeapon = car.design.components.weapons.includes(weapon => {
      let notPlantHampered = !weapon.requiresPlant ||
                             car.design.components.powerPlant.damagePoints > 0
      return (weapon.damagePoints > 0 && notPlantHampered)
    })
    return !workingWeapon
  }

  static slowTheDead({ match }) {
    // p. 30: Any other
    // ground vehicle (including a cycle with a
    // sidecar) will continue in a straight line if
    // the driver is incapacitated. It decelerates
    // 5 mph each turn, moving in a straight line
    // until it stops or hits something.
    //
    // p. 49 When the power plant is lost, a vehicle can no
    // longer fire lasers or accelerate, but all other
    // systems still work. The vehicle decelerates 5
    // mph per turn (more if you put on the brakes).

    let cars = match.carIds.map(id => DATA.cars.find(car => car.id === id))
    cars.forEach(car => {
      Log.info(car.color)
      if (Movement.driverOut({car}) ||
          Movement.plantOut({car}) ||
          !VehicleStatusHelper.enoughWheels(car)) {
        Log.info(`slowing car ${car.id} by 5 MPH`)
        if (car.status.speed > 0) { car.status.speed -= 5 }
        if (car.status.speed < 0) { car.status.speed += 5 }
        Movement.checkIfKilled({ car })
        car.phasing.speedChangeIndex = 0
        car.phasing.speedChanges = [car.status.speed]
      }
      Log.info(car.status.speed)
    })
  }

  static nextToMoveThisPhase({ match }) {
    if (match.time.phase.unmoved.length < 1) { return null }
    const ordered = match
                    .time.phase.unmoved
                    .map((id) => DATA.cars.find(car => car.id === id)) // too much data
                    .sort((a, b) => b.status.speed - a.status.speed)
                    .map((car) => car.id)

    // BUGBUG: Should handle same-speed disputes
    // Those are more complicated, involving prompting users to see if they want
    // to move or defer.
    const result = ordered.shift()
    match.time.phase.unmoved = ordered
    return result
  }
}

export default Movement
