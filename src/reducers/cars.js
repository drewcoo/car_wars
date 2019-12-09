import { createSlice } from 'redux-starter-kit'
import { INCH } from '../utils/constants'
import { WallData, StartingPositions } from '../maps/arenaMap1'
import Dice from '../utils/Dice'

import { KillerKart } from '../vehicleDesigns/KillerKart'

import { Collisions } from './lib/Collisions'
import { PhasingMove } from './lib/PhasingMove'
import { Targets } from './lib/Targets'
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
      weaponIndex: 0,
      targets: null,
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
      weaponIndex: 0,
      targets: null,
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
      weaponIndex: 0,
      targets: null,
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
      weaponIndex: 0,
      targets: null,
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
      car.phasing.collisions.map((coll) => {
        console.log('my coll is . . .')
        console.log(coll)
        // BUGBUG: Extra buggy when we collide with more than one thing, I think.
        console.log(`unresolved collision with: ${coll.rammed.id}`)
        console.log('hi')
        // BUGBUG: Chokes on cars.
        Collisions.resolve({ car, collision: coll })
      })

      /// /////////////////////////////////////
      car.status.handling -= car.phasing.difficulty
      // BUGBUG: HANDLING ROLL NOW IF CHANGED!
      console.log('handling roll may go here')

      car.rect = car.phasing.rect.clone()
      PhasingMove.reset({ car })
      /// ////
      // BUGBUG: once per turn at and of turn instead:
      state.map((Car) => {
        Car.design.components.crew.driver.fired_this_turn = false
        Car.design.components.weapons.map((Weapon) => {
          Weapon.fired_this_turn = false
        })
      })
      /// ////

      Collisions.clear({ cars: state })
    },
    ghostForward (state, action) {
      const car = state.find((carState) => carState.id === action.payload.id)
      car.phasing.rect = car.rect.clone()
      car.phasing.rect = PhasingMove.forward({ car, distance: INCH })
      car.phasing.targets = null
    },
    ghostReset (state, action) {
      const car = state.find((carState) => carState.id === action.payload.id)
      PhasingMove.reset({ car })
      Collisions.clear({ cars: state })
      car.phasing.targets = null
    },
    ghostTurnBend (state, action) {
      const car = state.find((carState) => carState.id === action.payload.car.id)
      const degrees = action.payload.degrees
      car.phasing.rect = PhasingMove.bend({ car, degrees })
      car.phasing.targets = null
    },
    ghostTurnSwerve (state, action) {
      const car = state.find((carState) => carState.id === action.payload.car.id)
      const degrees = action.payload.degrees
      car.phasing.rect = PhasingMove.swerve({ car, degrees })
      car.phasing.targets = null
    },
    ghostMoveDrift (state, action) {
      const car = state.find((carState) => carState.color === action.payload.car.color)
      var distance = (action.payload.direction === 'right') ? INCH / 4 : -INCH / 4
      car.phasing.rect = PhasingMove.drift({ car, distance })
      car.phasing.targets = null
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
    ghost_targetsSet (state, action) {
      const car = state.find((carState) => carState.id === action.payload.id)
      // car.phasing.targets = Targets.find({car, walls: WallData});
      // action.payload.maneuverIndex;

      // targetPointsInArc
      console.log(JSON.stringify(car))

      console.log('targets set')
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
        var data = targets.targetsInArc()
        console.log(`targets in arc: ${data[0]}`)
        car.phasing.targets = data || null
        car.phasing.targetIndex = 0
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
        // var data = targets.targets();
        var data = targets.targetsInArc()
        car.phasing.targets = data || null
        car.phasing.targetIndex = 0
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
      console.log('NEXT MAN!!!')
      console.log(action.payload)
      const car = state.find((carState) => carState.id === action.payload.id)

      car.phasing.maneuverIndex = (car.phasing.maneuverIndex + 1) % car.status.maneuvers.length
      console.log('collisions?')
      Collisions.detect({ cars: state, walls: WallData, thisCar: car })
      console.log('returning from maneuverNext')
    },
    maneuverPrevious (state, action) {
      const car = state.find((carState) => carState.id === action.payload.id)
      car.phasing.maneuverIndex = (car.phasing.maneuverIndex - 1 + car.status.maneuvers.length) % car.status.maneuvers.length
      console.log(`man idx: ${car.phasing.maneuverIndex}`)
    },
    maneuverSet (state, action) {
      const car = state.find((carState) => carState.id === action.payload.id)
      car.phasing.maneuverIndex = parseInt(action.payload.maneuverIndex)
      //
      // TODO: call into PhasingMove->the maneuver(car, 0)
      //
    },
    weaponNext (state, action) {
      const car = state.find((carState) => carState.id === action.payload.id)
      console.log(car.phasing.weaponIndex)
      console.log(car.design.components.weapons[car.phasing.weaponIndex].type)
      car.phasing.targets = null
      car.phasing.weaponIndex = (car.phasing.weaponIndex + 1) % car.design.components.weapons.length
    },
    weaponPrevious (state, action) {
      const car = state.find((carState) => carState.id === action.payload.id)
      car.phasing.targets = null
      car.phasing.weaponIndex = (car.phasing.weaponIndex - 1 + car.design.components.weapons.length) % car.design.components.weapons.length
    },
    weaponSet (state, action) {
      console.log(action)
      console.log('tahat!!!')
      const car = state.find((carState) => carState.id === action.payload.id)
      console.log(`weapon: ${action.payload.weapon}`)
      console.log(typeof (action.payload.weapon))
      car.phasing.weaponIndex = parseInt(action.payload.weapon)
    }
  }
})
