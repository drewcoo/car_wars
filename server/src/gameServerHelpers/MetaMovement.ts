import Log from '../utils/Log'
import Character from './Character'
import Vehicle from './Vehicle'
import _ from 'lodash'
import Match from './Match'

class MetaMovement {
  static canMoveThisPhase({ match }: { match: any }) {
    /*
    function checkMove({ vehicle }: { vehicle: any }) {
      if (
        MetaMovement.distanceThisPhase({
          speed: vehicle.status.speed,
          phase: match.time.phase.number,
        }) === 0
      ) {
        // BUGBUG: Why is this here?
        vehicle.phasing.rect = vehicle.rect
        return false
      } else {
        return true
      }
    }
    return match.carIds
      .map((id: string) => Vehicle.withId({ id }))
      .filter((vehicle: any) => checkMove({ vehicle }))
      .map((vehicle: any) => vehicle.id)
      */
    const thisPhaseMoves = match.time.turn.movesByPhase[match.time.phase.number - 1]
    console.log(thisPhaseMoves)
    const result: string[] = []
    thisPhaseMoves.forEach((speedElement: any) => {
      speedElement.movers.forEach((car: any) => {
        result.push(car.id)
      })
    })
    console.log(result)
    return result
  }

  static phaseDistancesAtSpeed({ speed }: { speed: number }) {
    const MetaMovementChart = [
      [0, 0, 0, 0, 0], // 0 mph
      [0.5, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 0, 0.5, 0, 0],
      [1, 0, 1, 0, 0],

      [1, 0, 1, 0, 0.5], // 25 mph
      [1, 0, 1, 0, 1],
      [1, 0.5, 1, 0, 1],
      [1, 1, 1, 0, 1],
      [1, 1, 1, 0.5, 1],
    ]
    const factor = Math.sign(speed)
    const additionalInch = Math.trunc(speed / 50)
    const result = MetaMovementChart[(speed % 50) / 5]
    return result.map(value => value * factor + additionalInch)
  }

  static distanceThisPhase({ speed, phase }: { speed: number; phase: number }) {
    if (phase < 1 || phase > 5) {
      throw new Error(`There is no phase ${phase}`)
    }
    return MetaMovement.phaseDistancesAtSpeed({ speed })[phase - 1]
  }

  static sortBySpeedAndReflex({ movers }: { movers: any }) {
    let result = _.shuffle(movers)
    result = _.sortBy(result, ['reflexTieBreaker'])
    result = _.sortBy(result, ['reflexRoll']).reverse() // sort in decscending reflex roll
    return result
  }

  static allMovesThisTurn({ match }: { match: any }) {
    let result: any[] = [[], [], [], [], []]
    const vehicles = match.carIds.map((id: string) => Vehicle.withId({ id }))
    vehicles.forEach((vehicle: any) => {
      const distances = MetaMovement.phaseDistancesAtSpeed({ speed: vehicle.status.speed })
      for (let phase = 0; phase <= 4; phase++) {
        if (distances[phase] !== 0) {
          let obj: any = result[phase].find((element: any) => element['absSpeed'] === Math.abs(vehicle.status.speed))
          if (!obj) {
            obj = { absSpeed: Math.abs(vehicle.status.speed), movers: [] }
            result[phase].push(obj)
          }
          const driver = Vehicle.driver({ vehicle })
          obj['movers'].push({
            id: vehicle.id,
            color: vehicle.color, // just to make it easy to display
            distance: distances[phase],
            speed: vehicle.status.speed,
            reflexRoll: driver.reflexRoll,
            reflexTieBreaker: driver.reflexTieBreaker,
          })
        }
      }
    })
    result = result.map((movesPerPhase: any) => {
      return movesPerPhase.map((element: any) => {
        return {
          absSpeed: element.absSpeed,
          movers: MetaMovement.sortBySpeedAndReflex({ movers: element.movers }),
        }
      })
    })
    return result
  }

  /*
  static moveOrderOnPhase({ match, phase }: { match: any, phase: number }) {
    let cars = match.map((id: string) => Vehicle.withId({ id }))
    let carsToMove = cars.map((car) => {
      let dist = MetaMovement.distanceThisPhase({ speed: car.status.speed, phase })
      if ( dist !== 0) {

      }
    })
  }
*/
  static nextToMoveThisPhase({ match }: { match: any }) {
    if (match.time.phase.unmoved.length < 1) {
      return null
    }
    const ordered = match.time.phase.unmoved
      .map((id: string) => Vehicle.withId({ id }))
      .sort((a: any, b: any) => Math.abs(b.status.speed) - Math.abs(a.status.speed))
      .map((vehicle: any) => vehicle.id)

    // BUGBUG: Should handle same-speed disputes
    // Those are more complicated, involving prompting users to see if they want
    // to move or defer.
    const result = ordered.shift()
    match.time.phase.unmoved = ordered
    return result
  }
}

export default MetaMovement
