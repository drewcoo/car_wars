import Rectangle from '../../../utils/geometry/Rectangle'

class LocalMatchState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(data: any) {
    this.data = data
    if (!data) throw new Error('no match data!')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  car({ id }: { id: string }): any {
    if (id === null) {
      return null
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = this.data.cars.find((car: any) => car.id === id)
    if (result.phasing.rect) {
      result.phasing.rect = new Rectangle(result.phasing.rect)
    }
    result.rect = new Rectangle(result.rect)
    return result
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cars(): any[] {
    const result = this.data.cars
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result.forEach((car: any) => {
      if (car.phasing.rect) {
        car.phasing.rect = new Rectangle(car.phasing.rect)
      }
      car.rect = new Rectangle(car.rect)
    })
    return result
  }

  awaitAllSpeedsSet(): boolean[] {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.data.cars.some((car: any) => {
      return car.phasing.showSpeedChangeModal === true
    })
  }

  isActiveCar({ id }: { id: string }): boolean {
    return id === this.data.match.time.phase.moving
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  activeCar(): any {
    const id: string | null = this.activeCarId()
    if (!id) {
      return null
    }
    return this.car({ id })
  }

  activeCarId(): string | null {
    if (this.awaitAllSpeedsSet()) {
      return null
    }
    return this.data.match.time.phase.moving
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentManeuver(): any {
    const car = this.activeCar()
    return car.status.maneuvers[car.phasing.maneuverIndex]
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  activePlayer(): any {
    if (!this.activePlayerId()) {
      return null
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.data.players.find((player: any) => player.id === this.activePlayerId())
  }

  activePlayerId(): string | null {
    if (!this.activeCar()) {
      return null
    }
    return this.activeCar().playerId
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  player({ id }: { id: string }): any {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.data.players.find((player: any) => player.id === id)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  players(): any[] {
    return this.data.players
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentWeapon({ car = this.activeCar() }): any {
    const weaponIndex = car.phasing.weaponIndex
    return car.design.components.weapons[weaponIndex]
  }

  canFire({ car = this.activeCar() }): boolean {
    const weaponCanFire =
      this.currentWeapon({ car }).location !== 'none' &&
      this.currentWeapon({ car }).damagePoints > 0 &&
      !this.currentWeapon({ car }).firedThisTurn &&
      (this.currentWeapon({ car }).ammo > 0 ||
        (this.currentWeapon({ car }).requiresPlant && car.design.components.powerPlant.damagePoints > 0))
    const driverCanFire = !this.driver({ car }).firedThisTurn && this.driver({ car }).damagePoints > 1
    return weaponCanFire && driverCanFire
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  driver({ car = this.activeCar() }): any {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const driverId = car.design.components.crew.find((person: any) => person.role === 'driver').id
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.data.characters.find((element: any) => element.id === driverId)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  map(): any {
    const result = this.data.match.map
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result.wallData.forEach((wall: any) => {
      wall.rect = new Rectangle(wall.rect)
    })
    return result
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapSize(): any {
    return this.data.match.map.size
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  match(): any {
    return this.data.match
  }

  matchId(): string {
    return this.data.match.id
  }

  speed({ id }: { id: string }): number {
    const phasing = this.car({ id }).phasing
    return phasing.speedChanges[phasing.speedChangeIndex].speed
  }

  nextSpeed({ id }: { id: string }): number {
    const phasing = this.car({ id }).phasing
    let newIndex = phasing.speedChangeIndex + 1
    if (newIndex > phasing.speedChanges.length - 1) {
      newIndex = phasing.speedChanges.length - 1
    }
    return phasing.speedChanges[newIndex].speed
  }

  previousSpeed({ id }: { id: string }): number {
    const phasing = this.car({ id }).phasing
    let newIndex = phasing.speedChangeIndex - 1
    if (newIndex < 0) {
      newIndex = 0
    }
    return phasing.speedChanges[newIndex].speed
  }

  setSpeedIndex({ id, speedIndex }: { id: string; speedIndex: number }): number {
    const phasing = this.car({ id }).phasing
    phasing.speedChangeIndex = speedIndex

    return phasing.speedChanges[phasing.speedChangeIndex].speed
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  target({ id, targetIndex }: { id: string; targetIndex: number }): any[] {
    const allTargets = this.car({ id }).phasing.targets
    return allTargets[targetIndex]
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentTarget({ id }: { id: string }): any {
    const targetIndex = this.currentTargetIndex({ id })
    return this.target({ id, targetIndex })
  }

  currentTargetIndex({ id }: { id: string }): number {
    const phasing = this.car({ id }).phasing
    return phasing.targetIndex
  }

  nextTarget({ id }: { id: string }): number {
    let index = this.car({ id }).phasing.targetIndex
    const array = this.car({ id }).phasing.targets
    index = (index + 1) % array.length
    this.car({ id }).phasing.targetIndex = index
    return array[index]
  }

  previousTarget({ id }: { id: string }): number {
    let index = this.car({ id }).phasing.targetIndex
    const array = this.car({ id }).phasing.targets
    index = (index - 1 + array.length) % array.length
    this.car({ id }).phasing.targetIndex = index
    return array[index]
  }

  setTarget({ id, index }: { id: string; index: number }): void {
    this.car({ id }).phasing.targetIndex = index
  }

  weaponIndex({ id }: { id: string }): number {
    return this.car({ id }).phasing.weaponIndex
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nextWeapon({ id }: { id: string }): any {
    const array = this.car({ id }).design.components.weapons
    let index = this.car({ id }).phasing.weaponIndex
    index = (index + 1) % array.length
    this.car({ id }).phasing.weaponIndex = index
    return array[index]
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  previousWeapon({ id }: { id: string }): any {
    const array = this.car({ id }).design.components.weapons
    let index = this.car({ id }).phasing.weaponIndex
    index = (index - 1 + array.length) % array.length
    this.car({ id }).phasing.weaponIndex = index
    return array[index]
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setWeaponIndex({ id, index }: { id: string; index: number }): any {
    const array = this.car({ id }).design.components.weapons
    this.car({ id }).phasing.weaponIndex = index
    return array[index]
  }

  subphase(): string {
    return this.data.match.time.phase.subphase
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  time(): any {
    return this.data.match.time
  }
}

export default LocalMatchState
