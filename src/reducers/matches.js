import { createSlice } from 'redux-starter-kit'

import { INCH } from '../utils/constants'
import Dice from '../utils/Dice'

import CarStatus from './lib/CarStatus'
import Collisions from './lib/Collisions'
import CrewMember from './lib/CrewMember'
import Damage from './lib/Damage'
import Movement from './lib/Movement'
import PhasingMove from './lib/PhasingMove'
import Targets from './lib/Targets'
import Time from './lib/Time'
import Weapon from './lib/Weapon'

export const matchesSlice = createSlice({
  slice: 'matches',
  initialState: { },
  reducers: {
    addMatch (state, action) {
      const tmp = action.payload
      tmp.status = 'new' // new, started, finished - should create enum
      tmp.time = {
        phase: {
          number: 1,

          unmoved: [],
          moving: null
        },
        turn: {
          number: 1
        }
      }
      state[action.payload.matchId] = tmp
      state[action.payload.matchId].players = action.payload.players
    },
    addCarToMatch (state, action) {
      const match = state[action.payload.matchId]
      const StartingPositions = match.map.startingPositions

      const car = CarStatus.addCar({
        id: action.payload.id,
        design: action.payload.design,
        name: action.payload.name,
        playerId: action.payload.playerId,
        color: action.payload.color,
        startingPosition: StartingPositions[parseInt(action.payload.startingPosition)]
      })

      match.cars[car.id] = car
    },
    startMatch (state, action) {
      const match = state[action.payload.matchId]
      if (match.status !== 'new') { throw new Error('Restart match?') }
      match.time.phase = {
        number: 1,
        unmoved: Movement.canMoveThisPhase({ match }),
        moving: null
      }
      match.status = 'started'
      Time.nextPlayer({ match })
    },
    finishMatch (state, action) {
      const match = state[action.payload.matchId]
      if (match.status === 'started') {
        match.status = 'finished'
      }
    },

    shiftModal (state, action) {
      console.log(action.payload)
      const match = state[action.payload.matchId]
      const player = match.players[action.payload.playerId]
      player.modals.shift()
    },

    acceptMove (state, action) {
      const match = state[action.payload.matchId]
      const car = match.cars[action.payload.id]

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
      //  const targets = new Targets({ car, cars: state, map: state[matchId].map })
      //  targets.refresh()
      /// ////
      // BUGBUG: once per turn at and of turn instead:
      for (const Car of Object.values(match.cars)) {
        Car.design.components.crew.driver.firedThisTurn = false
        for (const Weapon of Car.design.components.weapons) {
          Weapon.firedThisTurn = false
        }
      }
      /// ////

      Collisions.clear({ cars: match.cars })
      Time.nextPlayer({ match })
    },

    ghostForward (state, action) {
      const match = state[action.payload.matchId]
      const car = match.cars[action.payload.id]
      car.phasing.rect = PhasingMove.forward({ car, distance: INCH })
      const targets = new Targets({ car, cars: match.cars, map: match.map })
      targets.refresh()
    },

    ghostHalf (state, action) {
      const match = state[action.payload.matchId]
      const car = match.cars[action.payload.id]
      car.phasing.rect = PhasingMove.forward({ car, distance: INCH / 2 })
      const targets = new Targets({ car, cars: match.cars, map: match.map })
      targets.refresh()
    },

    ghostReset (state, action) {
      const match = state[action.payload.matchId]
      const car = match.cars[action.payload.id]
      PhasingMove.reset({ car })
      Collisions.clear({ cars: match.cars })
      const targets = new Targets({ car, cars: match.cars, map: match.map })
      targets.refresh()
    },

    ghostTurnBend (state, action) {
      const match = state[action.payload.matchId]
      const car = match.cars[action.payload.id]
      const degrees = action.payload.degrees
      car.phasing.rect = PhasingMove.bend({ car, degrees })
      const targets = new Targets({ car, cars: match.cars, map: match.map })
      targets.refresh()
    },

    ghostTurnSwerve (state, action) {
      const match = state[action.payload.matchId]
      const car = match.cars[action.payload.id]
      const degrees = action.payload.degrees
      car.phasing.rect = PhasingMove.swerve({ car, degrees })
      const targets = new Targets({ car, cars: match.cars, map: match.map })
      targets.refresh()
    },

    ghostMoveDrift (state, action) {
      const match = state[action.payload.matchId]
      const car = match.cars[action.payload.id]
      const distance = (action.payload.direction === 'right') ? INCH / 4 : -INCH / 4
      car.phasing.rect = PhasingMove.drift({ car, distance })
      const targets = new Targets({ car, cars: match.cars, map: match.map })
      targets.refresh()
    },

    ghostShowCollisions (state, action) {
      const match = state[action.payload.matchId]
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
      const thisCar = match.cars[action.payload.id]
      Collisions.detect({ cars: match.cars, map: match.map, thisCar: thisCar })
    },

    ghostTargetSet (state, action) {
      const match = state[action.payload.matchId]
      const car = match.cars[action.payload.id]
      car.phasing.targetIndex = parseInt(action.payload.targetIndex)
    },

    ghostTargetNext (state, action) {
      const match = state[action.payload.matchId]
      const car = match.cars[action.payload.id]
      const currentWeapon = car.design.components.weapons[car.phasing.weaponIndex]
      const currentCrewMember = car.design.components.crew.driver
      const plant = car.design.components.power_plant
      if (!Weapon.canFire({
        weapon: currentWeapon,
        plantDisabled: plant.damagePoints < 1
      })) { return }
      if (!CrewMember.canFire(currentCrewMember)) { return }

      /// ///////////////

      //
      // Do something to keep the last target, too, so that when we move, we can
      // keep the same point targeted then iterate from there in whatever the
      // new target array is. Assuming the target's still there.
      //

      if (car.phasing.targets === null) {
        const targets = new Targets({ car, cars: match.cars, map: match.map })
        targets.refresh()
      } else {
        car.phasing.targetIndex = (car.phasing.targetIndex + 1) % car.phasing.targets.length
      }

      // add array of targeting mods to phasing vehicle
      // show that with the reticule
      // take it into account when firing

      car.phasing.damageMarker = null

    // car.phasing.maneuverIndex = (car.phasing.maneuverIndex + 1) % car.status.maneuvers.length
    },

    ghostTargetPrevious (state, action) {
      const match = state[action.payload.matchId]
      const car = match.cars[action.payload.id]
      const currentWeapon = car.design.components.weapons[car.phasing.weaponIndex]
      const currentCrewMember = car.design.components.crew.driver
      const plant = car.design.components.power_plant
      if (!Weapon.canFire({
        weapon: currentWeapon,
        plantDisabled: plant.damagePoints < 1
      })) { return }
      if (!CrewMember.canFire(currentCrewMember)) { return }

      if (car.phasing.targets === null) {
        const targets = new Targets({ car, cars: match.cars, map: match.map })
        targets.refresh()
      } else {
        car.phasing.targetIndex = (car.phasing.targetIndex - 1 + car.phasing.targets.length) % car.phasing.targets.length
      }

      // add array of targeting mods to phasing vehicle
      // show that with the reticule
      // take it into account when firing
      car.phasing.damageMarker = null
    },

    fireWeapon (state, action) {
      const match = state[action.payload.matchId]
      const car = match.cars[action.payload.id]
      const weapon = car.design.components.weapons[car.phasing.weaponIndex]
      const crewMember = car.design.components.crew.driver
      const plant = car.design.components.power_plant
      let canFire = Weapon.canFire({
        weapon: weapon,
        plantDisabled: plant.damagePoints < 1
      }) &&
                  CrewMember.canFire(crewMember)

      if (car.phasing.targets === null ||
        car.phasing.targets.length === 0 ||
        car.phasing.targets[car.phasing.targetIndex] === null) {
        console.log('CANNOT FIRE: no target')
        canFire = false
      }

      car.phasing.damageMarker = null
      car.phasing.damageMessage = null
      if (!canFire) { return }

      // This should check that all movement for the phase is finished instead.
      if (!PhasingMove.hasMoved({ car })) {
        console.log('Cannot fire; must move first.')
        return
      }

      console.log(`fire my ${weapon.type}`)
      console.log(`I have ${weapon.ammo} ammo.`)
      let damage = 'what?'
      console.log(`to hit: ${weapon.toHit} / damage: ${weapon.damage}`)
      const toHit = Dice.roll('2d')
      console.log(`to hit roll: ${toHit} - ${(toHit >= weapon.toHit) ? 'hit' : 'miss'}`)
      damage = (toHit >= weapon.toHit) ? Dice.roll(weapon.damage) : 0
      console.log(`${damage} damage.`)
      weapon.ammo--
      car.design.components.crew.driver.firedThisTurn = true
      weapon.firedThisTurn = true
      const target = car.phasing.targets[car.phasing.targetIndex]
      const targetCar = match.cars[target.carId]
      Damage.deal({ car: targetCar, damage: damage, location: target.name })

      /*
      // TODO: Something like this to lock movement, then check that it's false
      // when trying to move.   Maybe???
      //
      if (PhasingMove.hasMoved({ car })) {
        // no more ghost maneuvers
        car.phasing.movedAndFired = true
      }
*/

      // TODO:
      // calculate to-hit mods
      // roll to hit
      // mark damage done in phasing loc, then show on map
      // apply damage in order to location hit, if any

      car.phasing.damageMarker = car.phasing.targets[car.phasing.targetIndex]
      car.phasing.damageMessage = damage // 'BANG!';
    },

    maneuverNext (state, action) {
      const match = state[action.payload.matchId]
      const car = match.cars[action.payload.id]
      car.phasing.maneuverIndex = (car.phasing.maneuverIndex + 1) % car.status.maneuvers.length
      Collisions.detect({ cars: match.cars, map: match.map, thisCar: car })
    },

    maneuverPrevious (state, action) {
      const match = state[action.payload.matchId]
      const car = match.cars[action.payload.id]
      car.phasing.maneuverIndex = (car.phasing.maneuverIndex - 1 + car.status.maneuvers.length) % car.status.maneuvers.length
      Collisions.detect({ cars: match.cars, map: match.map, thisCar: car })
    },

    maneuverSet (state, action) {
      const match = state[action.payload.matchId]
      console.log(action.payload)
      const car = match.cars[action.payload.id]
      car.phasing.maneuverIndex = parseInt(action.payload.maneuverIndex)
      //
      // TODO: call into PhasingMove->the maneuver(car, 0)
      //
      Collisions.detect({ cars: match.cars, map: match.map, thisCar: car })
    },

    /// ////////////////
    speedNext (state, action) {
      const match = state[action.payload.matchId]
      const car = match.cars[action.payload.id]
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
      const match = state[action.payload.matchId]
      const car = match.cars[action.payload.id]
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
      const match = state[action.payload.matchId]
      const car = match.cars[action.payload.id]
      car.phasing.speedChangeIndex = parseInt(action.payload.speedChangeIndex)
    //
    // TODO: call into PhasingMove->the maneuver(car, 0)
    //
    },

    weaponNext (state, action) {
      const match = state[action.payload.matchId]
      const car = match.cars[action.payload.id]
      car.phasing.weaponIndex = (car.phasing.weaponIndex + 1) % car.design.components.weapons.length
      const targets = new Targets({ car, cars: match.cars, map: match.map })
      targets.refresh()
    },

    weaponPrevious (state, action) {
      const match = state[action.payload.matchId]
      const car = match.cars[action.payload.id]
      car.phasing.weaponIndex = (car.phasing.weaponIndex - 1 + car.design.components.weapons.length) % car.design.components.weapons.length
      const targets = new Targets({ car, cars: match.cars, map: match.map })
      targets.refresh()
    },

    weaponSet (state, action) {
      const match = state[action.payload.matchId]
      const car = match.cars[action.payload.id]
      car.phasing.weaponIndex = parseInt(action.payload.weapon)
      const targets = new Targets({ car, cars: match.cars, map: match.map })
      targets.refresh()
    }
  }
})
