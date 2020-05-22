import Control from '../Control'
import Vehicle from '../Vehicle'
import Time from '../Time'
import Point from '../../utils/geometry/Point'
import Log from '../../utils/Log'

class Speed {
  static accept({ vehicle, match, bugMeNot }: { vehicle: any, match: any, bugMeNot: boolean }) {
      if (vehicle.status.speedSetThisTurn) {
        return
      }

      const newSpeed = vehicle.phasing.speedChanges[vehicle.phasing.speedChangeIndex]
      Log.info(`${vehicle.status.speed} -> ${newSpeed.speed}`, vehicle)
      const speedChanged = newSpeed.speed !== vehicle.status.speed

      if (speedChanged || bugMeNot) {
        Log.info(`speed change: ${vehicle.status.speed}MPH -> ${newSpeed.speed}MPH`, vehicle)
        vehicle.status.speedSetThisTurn = true
      }

      if (speedChanged && newSpeed.damageDice !== '') {
        // deal with the damage and handling roll after everyone moves
        const points: { [index: string]: any } = {
          FL: vehicle.rect.flPoint(),
          FR: vehicle.rect.frPoint(),
          BL: vehicle.rect.blPoint(),
          BR: vehicle.rect.brPoint(),
        }
        vehicle.design.components.tires.forEach((tire: any) => {
          vehicle.phasing.damage.push({
            target: {
              location: tire.location,
              point: points[tire.location],
              damageDice: newSpeed.damageDice,
            },

            message: 'tire damage',
          })
        })
      }

      vehicle.phasing.showSpeedChangeModal = false

      Time.subphase2SetSpeeds({ match })
  }

  static set({ vehicle, speed}: { vehicle: any, speed: number }) {
    if (vehicle.status.speedSetThisTurn) {
      return
    }

    const driver = Vehicle.driver({ vehicle })

    if (
      driver.damagePoints < 2 ||
      vehicle.status.speedSetThisTurn ||
      (vehicle.design.components.powerPlant.damagePoints < 1 && Math.abs(speed) > Math.abs(vehicle.status.speed))
    ) {
      // driver unconscious or dead
      return vehicle.status.speed
    }

    const topSpeed = vehicle.design.attributes.topSpeed
    if (speed < -topSpeed / 5 || speed > topSpeed) {
      throw new Error(`Excessive speed: ${speed}`)
    }

    // BUGBUG: Check for Excessive speed change.
    // BUGBUG: Check for "going through 0" without stopping.

    vehicle.phasing.speedChangeIndex = vehicle.phasing.speedChanges.findIndex((change: any) => change.speed === speed)
    if (vehicle.phasing.speedChangeIndex === -1) {
      throw new Error(`Speed ${speed} not in array ${vehicle.phasing.speedChanges}`)
    }
    vehicle.status.controlChecks = Control.row({ speed: speed })
    vehicle.phasing.difficulty = vehicle.phasing.speedChanges[vehicle.phasing.speedChangeIndex].difficulty
    vehicle.phasing.damage = []
    const corners: { [index: string]: any } = {
      FL: vehicle.rect.flPoint(),
      FR: vehicle.rect.frPoint(),
      BL: vehicle.rect.blPoint(),
      BR: vehicle.rect.brPoint(),
    }
    if (vehicle.phasing.speedChanges[vehicle.phasing.speedChangeIndex].damageDice !== '') {
      vehicle.design.components.tires.forEach((tire: any) => {
        vehicle.phasing.damage.push({
          target: {
            point: corners[tire.location],
            location: tire.location,
            damageDice: vehicle.phasing.speedChanges[vehicle.phasing.speedChangeIndex].damageDice,
          },
          message: 'tire damage',
        })
      })
    }
    return speed
  }
}

export default Speed