class DangerColorizer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static handlingColor(car: any, handling: number): string {
    const effectiveHandling = handling < -6 ? -6 : handling
    const speed = parseInt(car.phasing.speedChanges[car.phasing.speedChangeIndex].speed)
    if (Math.abs(car.status.speed) <= 5) {
      return 'white'
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const checks = car.phasing.controlChecksForSpeedChanges.find((entry: any) => entry.speed === speed).checks
    const checkIndex = [7, 6, 5, 4, 3, 2, 1, 0, -1, -2, -3, -4, -5, -6]

    let color: string
    const checkValue = checks[checkIndex.findIndex((e) => e === effectiveHandling)]
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static handlingDifficultyColorizer(car: any): any {
    const color = this.handlingColor(car, car.status.handling - car.phasing.difficulty)
    const isVisible = car.phasing.difficulty === 0 ? 'hidden' : 'visible'
    return { color: color, visibility: isVisible }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static handlingStatusColorizer(car: any): any {
    return { color: this.handlingColor(car, car.status.handling) }
  }
}

export default DangerColorizer
