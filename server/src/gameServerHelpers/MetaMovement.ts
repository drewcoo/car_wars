import Log from '../utils/Log'
import Character from './Character'
import Vehicle from './Vehicle'

class MetaMovement {
  static canMoveThisPhase({ match }: { match: any }) {
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
  }

  static distanceThisPhase({ speed, phase }: { speed: number, phase: number }) {
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
    if (phase < 1 || phase > 5) {
      throw new Error(`There is no phase ${phase}`)
    }
    return MetaMovementChart[(speed % 50) / 5][phase - 1] + Math.floor(speed / 50)
  }

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
