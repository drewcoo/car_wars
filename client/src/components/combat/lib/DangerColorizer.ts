class DangerColorizer {
  static handlingColor(car: any, handling: number) {
    let effectiveHandling = handling < -6 ? -6 : handling
    const speed = parseInt(
      car.phasing.speedChanges[car.phasing.speedChangeIndex].speed
    )
    if (Math.abs(car.status.speed) <= 5) {
      return 'white'
    }
    const checks = car.phasing.controlChecksForSpeedChanges.find(
      (entry: any) => entry.speed === speed
    ).checks
    const checkIndex = [7, 6, 5, 4, 3, 2, 1, 0, -1, -2, -3, -4, -5, -6]

    let color: string
    let checkValue =
      checks[checkIndex.findIndex((e) => e === effectiveHandling)]
    switch (checkValue) {
      case 'safe':
        color = 'white'
        break
      case 'XX':
        color = 'red'
        break
      default:
        color = `rgb(255, ${255 - 42 * (checkValue - 1)}, 0)`
    }
    return color
  }

  static handlingDifficultyColorizer(car: any): any {
    let color = this.handlingColor(
      car,
      car.status.handling - car.phasing.difficulty
    )
    let isVisible = car.phasing.difficulty === 0 ? 'hidden' : 'visible'
    return { color: color, visibility: isVisible }
  }

  static handlingStatusColorizer(car: any): any {
    return { color: this.handlingColor(car, car.status.handling) }
  }
}

export default DangerColorizer
