import _ from 'lodash'
import { DATA,  matchCars } from '../DATA'

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
