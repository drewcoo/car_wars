import Rectangle from '../../../utils/geometry/Rectangle'

class LocalMatchState {
  constructor(data) {
    this.data = data
    if (!data) throw new Error('no match data!')
  }

  car({ id }) {
    let result = this.data.cars.find(car => car.id === id)
    if (result.phasing.rect) {
      result.phasing.rect = new Rectangle(result.phasing.rect)
    }
    result.rect = new Rectangle(result.rect)
    return result
  }

  cars() {
    let result = this.data.cars
    result.forEach(car => {
      if (car.phasing.rect) {
        car.phasing.rect = new Rectangle(car.phasing.rect)
      }
      car.rect = new Rectangle(car.rect)
    })
    return result
  }

  currentCar() {
    return this.car({ id: this.currentCarId() })
  }

  currentCarId() {
    return this.data.match.time.phase.moving
  }

  currentManeuver() {
    let car = this.currentCar()
    return car.status.maneuvers[car.phasing.maneuverIndex]
  }

  currentPlayer() {
    return this.data.players.find(player => player.id === this.currentPlayerId())
  }

  currentPlayerId() {
    return this.currentCar().playerId
  }

  player (id) {
    return this.data.players.find(player => player.id === id)
  }

  currentWeapon() {
    const car = this.currentCar()
    const weaponIndex = car.phasing.weaponIndex
    return car.design.components.weapons[weaponIndex]
  }

  canFire() {
    const weaponCanFire = (
      this.currentWeapon().location !== 'none' &&
      this.currentWeapon().damagePoints > 0 &&
      !this.currentWeapon().firedThisTurn &&
      (
        this.currentWeapon().ammo > 0 ||
        (this.currentWeapon().requiresPlant &&
         this.currentCar().design.components.powerPlant.damagePoints >0)
      )
    )

    const driverCanFire = (
      !this.driver().firedThisTurn &&
      this.driver().damagePoints > 1
    )

    return(weaponCanFire && driverCanFire)
  }

  driver() {
    return this.currentCar().design.components.crew.find(person => person.role === 'driver')
  }

  map() {
    let result = this.data.match.map
    result.wallData.forEach(wall => {
      wall.rect = new Rectangle(wall.rect)
    })
    return result
  }

  mapSize() {
    return this.data.match.map.size
  }

  match() {
    return this.data.match
  }

  matchId() {
    return this.data.match.id
  }

  speed({ id }) {
    let phasing = this.car({ id }).phasing
    return phasing.speedChanges[phasing.speedChangeIndex]
  }

  nextSpeed({ id }) {
    let phasing = this.car({ id }).phasing
    phasing.speedChangeIndex++
    if (phasing.speedChangeIndex > phasing.speedChanges.length - 1) {
      phasing.speedChangeIndex = phasing.speedChanges.length - 1
    }
    return phasing.speedChanges[phasing.speedChangeIndex]
  }

  previousSpeed({ id }) {
    let phasing = this.car({ id }).phasing
    phasing.speedChangeIndex--
    if (phasing.speedChangeIndex < 0) {
      phasing.speedChangeIndex = 0
    }
    return phasing.speedChanges[phasing.speedChangeIndex]
  }

  setSpeedIndex({ id, speedIndex }) {
    let phasing = this.car({ id }).phasing
    phasing.speedChangeIndex = speedIndex
    return phasing.speedChanges[phasing.speedChangeIndex]
  }

  target({ id, targetId }) {
    let allTargets = this.car({ id }).phasing.targets
    return allTargets[targetId]
  }

  currentTarget({ id }) {
    let targetId = this.currentTargetIndex({ id })
    return this.target({ id, targetId })
  }

  currentTargetIndex({ id }) {
    let phasing = this.car({ id }).phasing
    return phasing.targetIndex
  }

  nextTarget({ id }) {
    let index = this.car({ id }).phasing.targetIndex
    let array = this.car({ id }).phasing.targets
    index = (index + 1) % array.length
    this.car({ id }).phasing.targetIndex = index
    return array[index]
  }

  previousTarget({ id }) {
    let index = this.car({ id }).phasing.targetIndex
    let array = this.car({ id }).phasing.targets
    index = (index - 1 + array.length) % array.length
    this.car({ id }).phasing.targetIndex = index
    return array[index]
  }

  setTarget({ id, index }) {
    this.car({ id }).phasing.targetIndex = index
  }

  weaponIndex({ id }) {
    return this.car({ id }).phasing.weaponIndex
  }

  nextWeapon({ id }) {
    let array = this.car({ id }).design.components.weapons
    let index = this.car({ id }).phasing.weaponIndex
    index = (index + 1) % array.length
    this.car({ id }).phasing.weaponIndex = index
    return array[index]
  }

  previousWeapon({ id }) {
    let array = this.car({ id }).design.components.weapons
    let index = this.car({ id }).phasing.weaponIndex
    index = (index - 1 + array.length) % array.length
    this.car({ id }).phasing.weaponIndex = index
    return array[index]
  }

  setWeaponIndex({ id, index }) {
    let array = this.car({ id }).design.components.weapons
    this.car({ id }).phasing.weaponIndex = index
    return array[index]
  }

  time() {
    return this.data.match.time
  }
}

export default LocalMatchState
