import { createSlice } from 'redux-starter-kit'
import { INCH } from '../utils/constants'
import { WallData, StartingPositions } from '../maps/arenaMap1'
import Dice from '../utils/Dice'

import { KillerKart } from '../vehicleDesigns/KillerKart'

import { Collisions } from './lib/Collisions'
import { PhasingMove } from './lib/PhasingMove'
import Targets from './lib/Targets'
import Damage from './lib/Damage'
import CrewMember from './lib/CrewMember'
import Weapon from './lib/Weapon'

const maneuverValues = [
  'none',
  // 'half',
  // At the beginning of the turn, add/remove 'half' if the vehicle's speed
  // ends in 5.
  'forward',
  'bend',
  'drift',
  'swerve'
  // more
]

const initialCars = [
  {
    id: 'car0',
    design: KillerKart, // change name to design?
    color: 'red',
    collisionDetected: false,
    collisions: [],
    phasing: {
      rect: StartingPositions[0].clone(),
      damageMarkerLocation: null,
      damageMessage: '',
      difficulty: 0,
      maneuverIndex: 0,
      speedChanges: [0, 5, 10, 15, 20],
      speedChangeIndex: 2,
      weaponIndex: 0,
      targets: [],
      targetIndex: 0,
      collisionDetected: false,
      collisions: []
    },
    rect: StartingPositions[0].clone(),
    status: {
      handling: KillerKart.attributes.handlingClass,
      speed: 10,
      changedSpeed: false,
      maneuvers: maneuverValues
    }
  },
  {
    id: 'car1',
    design: KillerKart,
    color: 'blue',
    collisionDetected: false,
    collisions: [],
    phasing: {
      rect: StartingPositions[1].clone(),
      damageMarkerLocation: null,
      damageMessage: '',
      difficulty: 0,
      maneuverIndex: 0,
      speedChanges: [0, 5, 10, 15, 20],
      speedChangeIndex: 2,
      weaponIndex: 0,
      targets: [],
      targetIndex: 0,
      collisionDetected: false,
      collisions: []
    },
    rect: StartingPositions[1].clone(),
    status: {
      handling: KillerKart.attributes.handlingClass,
      speed: 10,
      changedSpeed: false,
      maneuvers: maneuverValues
    }
  },
  {
    id: 'car2',
    design: KillerKart,
    color: 'green',
    collisionDetected: false,
    collisions: [],
    phasing: {
      rect: StartingPositions[2].clone(),
      damageMarkerLocation: null,
      damageMessage: '',
      difficulty: 0,
      maneuverIndex: 0,
      speedChanges: [0, 5, 10, 15, 20],
      speedChangeIndex: 2,
      weaponIndex: 0,
      targets: [],
      targetIndex: 0,
      collisionDetected: false,
      collisions: []
    },
    rect: StartingPositions[2].clone(),
    status: {
      handling: KillerKart.attributes.handlingClass,
      speed: 10,
      changedSpeed: false,
      maneuvers: maneuverValues
    }
  },
  {
    id: 'car3',
    design: KillerKart,
    color: 'purple',
    collisionDetected: false,
    collisions: [],
    phasing: {
      rect: StartingPositions[3].clone(),
      damageMarkerLocation: null,
      damageMessage: '',
      difficulty: 0,
      maneuverIndex: 0,
      speedChanges: [0, 5, 10, 15, 20],
      speedChangeIndex: 2,
      weaponIndex: 0,
      targets: [],
      targetIndex: 0,
      collisionDetected: false,
      collisions: []
    },
    rect: StartingPositions[3].clone(),
    status: {
      handling: KillerKart.attributes.handlingClass,
      speed: 10,
      changedSpeed: false,
      maneuvers: maneuverValues
    }
  }
]

export const carsSlice = createSlice({
  slice: 'carStates',
  initialState: initialCars,
  reducers: {
    addCarState (state, action) {
      // You can "mutate" the state in a reducer, thanks to Immer
      state.push(action.payload)
    },
    deleteCarState (state, action) {
      return state.filter((carState) => carState.color !== action.payload)
    },
    getCarStates (state, action) {
      var result = state.filter((carState) => carState.color !== action.payload)
      return result
    },
    acceptMove (state, action) {
      const car = state.find((carState) => carState.id === action.payload.id)

      // haven't moved
      if (!PhasingMove.hasMoved({ car })) { return }

      // BUGBUG: We shouldn't allow other actions (firing) from the
      // nom-final position.
      /// /////////////////////////////////////
      for (const coll of car.phasing.collisions) {
        console.log(`unresolved collision with: ${coll.rammed.id}`)
        Collisions.resolve({ car, collision: coll })
      }

      //  Speeds.setSpeed({ car })
      // Speeds.setPossibleAndIndex({ car })

      /// /////////////////////////////////////
      car.status.handling -= car.phasing.difficulty
      // BUGBUG: HANDLING ROLL NOW IF CHANGED!
      console.log('handling roll may go here')

      car.rect = car.phasing.rect.clone()
      PhasingMove.reset({ car })
      /// ////
      // BUGBUG: once per turn at and of turn instead:
      for (const Car of state) {
        Car.design.components.crew.driver.fired_this_turn = false
        for (const Weapon of Car.design.components.weapons) {
          Weapon.fired_this_turn = false
        }
      }
      /// ////

      Collisions.clear({ cars: state })
    },
    ghostForward (state, action) {
      const car = state.find((carState) => carState.id === action.payload.id)
      car.phasing.rect = car.rect.clone()
      car.phasing.rect = PhasingMove.forward({ car, distance: INCH })
      var targets = new Targets({ car, cars: state, walls: WallData })
      targets.refresh()
    },
    ghostReset (state, action) {
      const car = state.find((carState) => carState.id === action.payload.id)
      PhasingMove.reset({ car })
      Collisions.clear({ cars: state })
      var targets = new Targets({ car, cars: state, walls: WallData })
      targets.refresh()
    },
    ghostTurnBend (state, action) {
      const car = state.find((carState) => carState.id === action.payload.car.id)
      const degrees = action.payload.degrees
      car.phasing.rect = PhasingMove.bend({ car, degrees })
      var targets = new Targets({ car, cars: state, walls: WallData })
      targets.refresh()
    },
    ghostTurnSwerve (state, action) {
      const car = state.find((carState) => carState.id === action.payload.car.id)
      const degrees = action.payload.degrees
      car.phasing.rect = PhasingMove.swerve({ car, degrees })
      var targets = new Targets({ car, cars: state, walls: WallData })
      targets.refresh()
    },
    ghostMoveDrift (state, action) {
      const car = state.find((carState) => carState.color === action.payload.car.color)
      var distance = (action.payload.direction === 'right') ? INCH / 4 : -INCH / 4
      car.phasing.rect = PhasingMove.drift({ car, distance })
      var targets = new Targets({ car, cars: state, walls: WallData })
      targets.refresh()
    },
    ghostShowCollisions (state, action) {
      //
      // BUGBUG: Problems:
      // 1. I don't like the way walls are handled. I'd like to put all "collidable
      //    things" in an array and walk through them.
      // 2. Only finds collisions where bounding lines cross/connect. That means
      //    even if #1 adds humans (1/4"x1/2") they may be contained in the
      //    bounding rectangle of the car and not detected.
      // 3. Because of the way this is tracked, we can move *through* a collision
      //    state and not end in one. That's a bug.
      // 4. Doesn't stop at time of collision to determine where the cars go.
      // 5. Doesn't consider the type of collision. That will matter when
      //    damage is assessed when the move is accepted.
      // 6. Others?
      //
      const thisCar = state.find((carState) => carState.id === action.payload.id)
      console.log('about to detect')
      Collisions.detect({ cars: state, walls: WallData, thisCar: thisCar })

      console.log('have detected')
    },
    ghostTargetSet (state, action) {
      const car = state.find((carState) => carState.id === action.payload.id)
      car.phasing.targetIndex = parseInt(action.payload.targetIndex)
    },
    ghostTargetNext (state, action) {
      const car = state.find((carState) => carState.id === action.payload.id)
      const currentWeapon = car.design.components.weapons[car.phasing.weaponIndex]
      const currentCrewMember = car.design.components.crew.driver
      if (!Weapon.canFire(currentWeapon)) { return }
      if (!CrewMember.canFire(currentCrewMember)) { return }

      /// ///////////////

      //
      // Do something to keep the last target, too, so that when we move, we can
      // keep the same point targeted then iterate from there in whatever the
      // new target array is. Assuming the target's still there.
      //

      if (car.phasing.targets === null) {
        console.log('fetch targets')
        var targets = new Targets({ car, cars: state, walls: WallData })
        targets.refresh()
      } else {
        car.phasing.targetIndex = (car.phasing.targetIndex + 1) % car.phasing.targets.length
      }

      // add array of targeting mods to phasing vehicle
      // show that with the reticule
      // take it into account when firing

      console.log(`next target: ${car.phasing.targets[car.phasing.targetIndex]}`)
      car.phasing.damageMarker = null
    },
    ghostTargetPrevious (state, action) {
      const car = state.find((carState) => carState.id === action.payload.id)

      const currentWeapon = car.design.components.weapons[car.phasing.weaponIndex]
      const currentCrewMember = car.design.components.crew.driver
      if (!Weapon.canFire(currentWeapon)) { return }
      if (!CrewMember.canFire(currentCrewMember)) { return }

      if (car.phasing.targets === null) {
        console.log('fetch targets')
        var targets = new Targets({ car, cars: state, walls: WallData })
        targets.refresh()
      } else {
        car.phasing.targetIndex = (car.phasing.targetIndex - 1 + car.phasing.targets.length) % car.phasing.targets.length
      }

      // add array of targeting mods to phasing vehicle
      // show that with the reticule
      // take it into account when firing

      console.log('previous target')
      car.phasing.damageMarker = null
    },
    ghostFire (state, action) {
      const car = state.find((carState) => carState.id === action.payload.id)

      const weapon = car.design.components.weapons[car.phasing.weaponIndex]
      const crewMember = car.design.components.crew.driver

      var canFire = Weapon.canFire(weapon) && CrewMember.canFire(crewMember)

      if (car.phasing.targets === null ||
          car.phasing.targets.length === 0 ||
          car.phasing.targets[car.phasing.targetIndex] === null) {
        console.log('CANNOT FIRE: no target')
        canFire = false
      }

      car.phasing.damageMarker = null
      car.phasing.damageMessage = null
      if (!canFire) { return }

      console.log(`fire my ${weapon.type}`)
      console.log(`I have ${weapon.ammo} ammo.`)
      var damage = 'what?'
      console.log(`to hit: ${weapon.toHit} / damage: ${weapon.damage}`)
      var toHit = Dice.roll('2d')
      console.log(`to hit roll: ${toHit} - ${(toHit >= weapon.toHit) ? 'hit' : 'miss'}`)
      damage = (toHit >= weapon.toHit) ? Dice.roll(weapon.damage) : 0
      console.log(`${damage} damage.`)
      weapon.ammo--
      car.design.components.crew.driver.fired_this_turn = true
      weapon.fired_this_turn = true
      var target = car.phasing.targets[car.phasing.targetIndex]
      const targetCar = state.find((carState) => carState.id === target.carId)
      Damage.deal({ car: targetCar, damage: damage, location: target.name })

      // TODO:
      // calculate to-hit mods
      // roll to hit
      // mark damage done in phasing loc, then show on map
      // apply damage in order to location hit, if any

      car.phasing.damageMarker = car.phasing.targets[car.phasing.targetIndex]
      car.phasing.damageMessage = damage // 'BANG!';
    },
    maneuverNext (state, action) {
      const car = state.find((carState) => carState.id === action.payload.id)
      car.phasing.maneuverIndex = (car.phasing.maneuverIndex + 1) % car.status.maneuvers.length
      Collisions.detect({ cars: state, walls: WallData, thisCar: car })
    },
    maneuverPrevious (state, action) {
      const car = state.find((carState) => carState.id === action.payload.id)
      car.phasing.maneuverIndex = (car.phasing.maneuverIndex - 1 + car.status.maneuvers.length) % car.status.maneuvers.length
      Collisions.detect({ cars: state, walls: WallData, thisCar: car })
    },
    maneuverSet (state, action) {
      const car = state.find((carState) => carState.id === action.payload.id)
      car.phasing.maneuverIndex = parseInt(action.payload.maneuverIndex)
      //
      // TODO: call into PhasingMove->the maneuver(car, 0)
      //
    },
    /// ////////////////
    speedNext (state, action) {
      const car = state.find((carState) => carState.id === action.payload.id)
      // BUGBBUG: Haven't handled:
      // - hazard from excessive braking
      // - components to modify braking
      // - components to modify acceleration
      const maxIndex = car.phasing.speedChanges.length - 1
      console.assert(car.phasing.speedChangeIndex <= maxIndex)
      if (car.phasing.speedChangeIndex < maxIndex) {
        car.phasing.speedChangeIndex += 1
      }
    },
    speedPrevious (state, action) {
      const car = state.find((carState) => carState.id === action.payload.id)
      // BUGBBUG: Haven't handled:
      // - hazard from excessive braking
      // - components to modify braking
      // - components to modify acceleration
      console.assert(car.phasing.speedChangeIndex >= 0)
      if (car.phasing.speedChangeIndex > 0) {
        car.phasing.speedChangeIndex -= 1
      }
    },
    speedSet (state, action) {
      const car = state.find((carState) => carState.id === action.payload.id)
      car.phasing.speedChangeIndex = parseInt(action.payload.speedChangeIndex)
      //
      // TODO: call into PhasingMove->the maneuver(car, 0)
      //
    },
    weaponNext (state, action) {
      const car = state.find((carState) => carState.id === action.payload.id)
      car.phasing.weaponIndex = (car.phasing.weaponIndex + 1) % car.design.components.weapons.length
      var targets = new Targets({ car, cars: state, walls: WallData })
      targets.refresh()
    },
    weaponPrevious (state, action) {
      const car = state.find((carState) => carState.id === action.payload.id)
      car.phasing.weaponIndex = (car.phasing.weaponIndex - 1 + car.design.components.weapons.length) % car.design.components.weapons.length
      var targets = new Targets({ car, cars: state, walls: WallData })
      targets.refresh()
    },
    weaponSet (state, action) {
      console.log(action)
      const car = state.find((carState) => carState.id === action.payload.id)
      console.log(`weapon: ${action.payload.weapon}`)
      console.log(typeof (action.payload.weapon))
      car.phasing.weaponIndex = parseInt(action.payload.weapon)
      var targets = new Targets({ car, cars: state, walls: WallData })
      targets.refresh()
    }
  }
})
