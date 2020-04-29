import Rectangle from '../../../utils/geometry/Rectangle'

class LocalMatchState {
  constructor (data) {
    this.data = data
    if (!data) throw new Error('no match data!')
  }

  car ({ id }) {
    if (id === null) { return null }
    const result = this.data.cars.find(car => car.id === id)
    if (result.phasing.rect) {
      result.phasing.rect = new Rectangle(result.phasing.rect)
    }
    result.rect = new Rectangle(result.rect)
    return result
  }

  cars () {
    const result = this.data.cars
    result.forEach(car => {
      if (car.phasing.rect) {
        car.phasing.rect = new Rectangle(car.phasing.rect)
      }
      car.rect = new Rectangle(car.rect)
    })
    return result
  }

  awaitAllSpeedsSet () {
    return this.data.cars.some(car => {
      return (
        car.phasing.showSpeedChangeModal === true
      )
    })
  }

  isActiveCar ({ id }) {
    return id === this.data.match.time.phase.moving
  }

  activeCar () {
    return this.car({ id: this.activeCarId() })
  }

  activeCarId () {
    if (this.awaitAllSpeedsSet()) { return null }
    return this.data.match.time.phase.moving
  }

  currentManeuver () {
    const car = this.activeCar()
    return car.status.maneuvers[car.phasing.maneuverIndex]
  }

  activePlayer () {
    if (!this.activePlayerId()) { return null }
    return this.data.players.find(player => player.id === this.activePlayerId())
  }

  activePlayerId () {
    if (!this.activeCar()) { return null }
    return this.activeCar().playerId
  }

  player (id) {
    return this.data.players.find(player => player.id === id)
  }

  players () {
    return this.data.players
  }

  currentWeapon (car = this.activeCar()) {
    const weaponIndex = car.phasing.weaponIndex
    return car.design.components.weapons[weaponIndex]
  }

  canFire (car = this.activeCar()) {
    const weaponCanFire = (
      this.currentWeapon(car).location !== 'none' &&
      this.currentWeapon(car).damagePoints > 0 &&
      !this.currentWeapon(car).firedThisTurn &&
      (
        this.currentWeapon(car).ammo > 0 ||
        (this.currentWeapon(car).requiresPlant &&
         car.design.components.powerPlant.damagePoints > 0)
      )
    )
    const driverCanFire = (
      !this.driver({ car }).firedThisTurn &&
      this.driver({ car }).damagePoints > 1
    )
    return (weaponCanFire && driverCanFire)
  }

  driver ({ car = this.activeCar() }) {
    return car.design.components.crew.find(person => person.role === 'driver')
  }

  map () {
    const result = this.data.match.map
    result.wallData.forEach(wall => {
      wall.rect = new Rectangle(wall.rect)
    })
    return result
  }

  mapSize () {
    return this.data.match.map.size
  }

  match () {
    return this.data.match
  }

  matchId () {
    return this.data.match.id
  }

  speed ({ id }) {
    const phasing = this.car({ id }).phasing
    return phasing.speedChanges[phasing.speedChangeIndex]
  }

  nextSpeed ({ id }) {
    const phasing = this.car({ id }).phasing
    let newIndex = phasing.speedChangeIndex + 1
    if (newIndex > phasing.speedChanges.length - 1) {
      newIndex = phasing.speedChanges.length - 1
    }
    return phasing.speedChanges[newIndex]
  }

  previousSpeed ({ id }) {
    const phasing = this.car({ id }).phasing
    let newIndex = phasing.speedChangeIndex - 1
    if (newIndex < 0) { newIndex = 0 }
    return phasing.speedChanges[newIndex]
  }

  setSpeedIndex ({ id, speedIndex }) {
    const phasing = this.car({ id }).phasing
    phasing.speedChangeIndex = speedIndex

    return phasing.speedChanges[phasing.speedChangeIndex]
  }

  target ({ id, targetId }) {
    const allTargets = this.car({ id }).phasing.targets
    return allTargets[targetId]
  }

  currentTarget ({ id }) {
    const targetId = this.currentTargetIndex({ id })
    return this.target({ id, targetId })
  }

  currentTargetIndex ({ id }) {
    const phasing = this.car({ id }).phasing
    return phasing.targetIndex
  }

  nextTarget ({ id }) {
    let index = this.car({ id }).phasing.targetIndex
    const array = this.car({ id }).phasing.targets
    index = (index + 1) % array.length
    this.car({ id }).phasing.targetIndex = index
    return array[index]
  }

  previousTarget ({ id }) {
    let index = this.car({ id }).phasing.targetIndex
    const array = this.car({ id }).phasing.targets
    index = (index - 1 + array.length) % array.length
    this.car({ id }).phasing.targetIndex = index
    return array[index]
  }

  setTarget ({ id, index }) {
    this.car({ id }).phasing.targetIndex = index
  }

  weaponIndex ({ id }) {
    return this.car({ id }).phasing.weaponIndex
  }

  nextWeapon ({ id }) {
    const array = this.car({ id }).design.components.weapons
    let index = this.car({ id }).phasing.weaponIndex
    index = (index + 1) % array.length
    this.car({ id }).phasing.weaponIndex = index
    return array[index]
  }

  previousWeapon ({ id }) {
    const array = this.car({ id }).design.components.weapons
    let index = this.car({ id }).phasing.weaponIndex
    index = (index - 1 + array.length) % array.length
    this.car({ id }).phasing.weaponIndex = index
    return array[index]
  }

  setWeaponIndex ({ id, index }) {
    const array = this.car({ id }).design.components.weapons
    this.car({ id }).phasing.weaponIndex = index
    return array[index]
  }

  subphase () {
    return this.data.match.time.phase.subphase
  }

  time () {
    return this.data.match.time
  }
}

export default LocalMatchState
