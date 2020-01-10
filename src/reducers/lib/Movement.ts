class Movement {
  static distanceThisPhase({ speed, phase }: { speed: number, phase: number }): number {
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

  static canMoveThisPhase({ match }: { match: any }): any[] {
    function checkMove(car: any) {
      if(car === undefined) { return 0 }
      return Movement.distanceThisPhase({
        speed: car.status.speed,
        phase: match.time.phase.number
      }) !== 0
    }

    return Object
             .values(match.cars)
             .filter((car: any) => checkMove(car) > 0)
             .map((car: any )=> car.id)
  }

  static nextToMoveThisPhase({ match }: { match: any }): string | null {
    if (match.time.phase.unmoved.length < 1) { return null }
    const ordered = match
                    .time.phase.unmoved
                    .map((id: string) => match.cars[id])
                    .sort((a: any, b: any) => b.status.speed - a.status.speed)
                    .map((car: any) => car.id)
    // BUGBUG: Should handle same-speed disputes
    // Those are more complicated, involving prompting users to see if they want
    // to move or defer.
    const result = ordered.shift()
    match.time.phase.unmoved = ordered
    return result
  }
}

export default Movement
