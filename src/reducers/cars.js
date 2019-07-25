import { createSlice } from "redux-starter-kit";
import uuid from 'uuid/v4';

import { INCH, FACE } from '../utils/constants';
import { WallData, StartingPositions } from '../maps/arena_map_1';
import Rectangle from '../utils/Rectangle';
import Segment from '../utils/Segment';
import Point from '../utils/Point';
import Dice from '../utils/Dice';

import { KillerKart } from '../vehicle_designs/KillerKart';

import { Collisions } from './lib/Collisions';
import { PhasingMove } from './lib/PhasingMove';
import { Targets } from './lib/Targets'
import Damage from './lib/Damage';
import CrewMember from './lib/CrewMember';
import Weapon from './lib/Weapon';

const maneuver_values = [
  'none',
  //'half',
  // At the beginning of the turn, add/remove 'half' if the vehicle's speed
  // ends in 5.
  'forward',
  'bend',
  'drift',
  'swerve',
  // more
];

const initialCars = [
  { id: 'car0',
    design: KillerKart, // change name to design?
    color: 'red',
    collision_detected: false,
    collisions: [],
    phasing: {
      rect: StartingPositions[0].clone(),
      damage_marker_location: null,
      damage_message: '',
      difficulty: 0,
      maneuver_index: 0,
      weapon_index: 0,
      targets: null,
      target_index: 0,
      collision_detected: false,
      collisions: [],
    },
    rect: StartingPositions[0].clone(),
    status: {
      handling: KillerKart.attributes.handling_class,
      speed: 10,
      changed_speed: false,
      maneuvers: maneuver_values,
    }
  },
  { id: 'car1',
    design: KillerKart,
    color: 'blue',
    collision_detected: false,
    collisions: [],
    phasing: {
      rect: StartingPositions[1].clone(),
      damage_marker_location: null,
      damage_message: '',
      difficulty: 0,
      maneuver_index: 0,
      weapon_index: 0,
      targets: null,
      target_index: 0,
      collision_detected: false,
      collisions: [],
    },
    rect: StartingPositions[1].clone(),
    status: {
      handling: KillerKart.attributes.handling_class,
      speed: 10,
      changed_speed: false,
      maneuvers: maneuver_values,
    }
  },
  { id: 'car2',
    design: KillerKart,
    color: 'green',
    collision_detected: false,
    collisions: [],
    phasing: {
      rect: StartingPositions[2].clone(),
      damage_marker_location: null,
      damage_message: '',
      difficulty: 0,
      maneuver_index: 0,
      weapon_index: 0,
      targets: null,
      target_index: 0,
      collision_detected: false,
      collisions: [],
    },
    rect: StartingPositions[2].clone(),
    status: {
      handling: KillerKart.attributes.handling_class,
      speed: 10,
      changed_speed: false,
      maneuvers: maneuver_values,
    }
  },
  { id: 'car3',
    design: KillerKart,
    color: 'purple',
    collision_detected: false,
    collisions: [],
    phasing: {
      rect: StartingPositions[3].clone(),
      damage_marker_location: null,
      damage_message: '',
      difficulty: 0,
      maneuver_index: 0,
      weapon_index: 0,
      targets: null,
      target_index: 0,
      collision_detected: false,
      collisions: [],
    },
    rect: StartingPositions[3].clone(),
    status: {
      handling: KillerKart.attributes.handling_class,
      speed: 10,
      changed_speed: false,
      maneuvers: maneuver_values,
    }
  }
];

export const carsSlice = createSlice({
  slice : 'carStates',
  initialState: initialCars,
  reducers : {
    addCarState(state, action) {
      // You can "mutate" the state in a reducer, thanks to Immer
      state.push(action.payload);
    },
    deleteCarState(state, action) {
      return state.filter((carState) => carState.color !== action.payload);
    },
    getCarStates(state, action) {
      var result = state.filter((carState) => carState.color !== action.payload);
      return result;
    },
    accept_move(state, action) {
      const car = state.find((carState) => carState.id === action.payload.id);

      // haven't moved
      if (!PhasingMove.has_moved({ car })) { return; }

      // BUGBUG: We shouldn't allow other actions (firing) from the
      // nom-final position.
////////////////////////////////////////
      car.phasing.collisions.map((coll) => {
        console.log(`unresolved collision with: ${coll.rammed.id}`);
        console.log('hi');
        Collisions.resolve({ car, collision: coll });
      });


////////////////////////////////////////
      car.status.handling -= car.phasing.difficulty;
      // BUGBUG: HANDLING ROLL NOW IF CHANGED!
      console.log('handling roll may go here');


      car.rect = car.phasing.rect.clone();
      PhasingMove.reset({ car });
///////
// BUGBUG: once per turn at and of turn instead:
      state.map((_car) => {
        _car.design.components.crew.driver.fired_this_turn = false;
        _car.design.components.weapons.map((_weapon) => {
          _weapon.fired_this_turn = false;
        });
      });
///////

      Collisions.clear({ cars: state });
    },
    ghost_forward(state, action) {
      const car = state.find((carState) => carState.id === action.payload.id);
      car.phasing.rect = car.rect.clone();
      car.phasing.rect = PhasingMove.forward({ car, distance: INCH });
      car.phasing.targets = null;
    },
    ghost_reset(state, action) {
      const car = state.find((carState) => carState.id === action.payload.id);
      PhasingMove.reset({ car });
      Collisions.clear({ cars: state });
      car.phasing.targets = null;
    },
    ghost_turn_bend(state, action) {
      const car = state.find((carState) => carState.id === action.payload.car.id);
      const degrees = action.payload.degrees;
      car.phasing.rect = PhasingMove.bend({ car, degrees });
      car.phasing.targets = null;
    },
    ghost_turn_swerve(state, action) {
      const car = state.find((carState) => carState.id === action.payload.car.id);
      const degrees = action.payload.degrees;
      car.phasing.rect = PhasingMove.swerve({ car, degrees });
      car.phasing.targets = null;
    },
    ghost_move_drift(state, action) {
      const car = state.find((carState) => carState.color === action.payload.car.color);
      var distance = (action.payload.direction === 'right') ? INCH/4 : -INCH/4;
      car.phasing.rect = PhasingMove.drift({ car, distance });
      car.phasing.targets = null;
    },
    ghost_show_collisions(state, action) {
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
      const this_car = state.find((carState)  => carState.id === action.payload.id);
      console.log('about to detect');
      Collisions.detect({ cars: state, walls: WallData, this_car: this_car });

      console.log('have detected');

    },
    ghost_targets_set(state, action) {
      const car = state.find((carState) => carState.id === action.payload.id);
      //car.phasing.targets = Targets.find({car, walls: WallData});
      //action.payload.maneuver_index;

//target_points_in_arc
      console.log(JSON.stringify(car));

      console.log('targets set');
    },
    ghost_target_next(state, action) {
      const car = state.find((carState) => carState.id === action.payload.id);

      const current_weapon = car.design.components.weapons[car.phasing.weapon_index];
      const current_crew_member = car.design.components.crew.driver;
      if (!Weapon.can_fire(current_weapon)) { return; }
      if (!CrewMember.can_fire(current_crew_member)) { return; }

  //////////////////

      //
      // Do something to keep the last target, too, so that when we move, we can
      // keep the same point targeted then iterate from there in whatever the
      // new target array is. Assuming the target's still there.
      //

      if(car.phasing.targets === null) {
        console.log('fetch targets');
        var targets = new Targets({ car, cars: state, walls: WallData });
        //var data = targets.targets();
        var data = targets.targets_in_arc();
        car.phasing.targets = data ? data : null;
        car.phasing.target_index = 0;
      } else {
        car.phasing.target_index = (car.phasing.target_index + 1) % car.phasing.targets.length;
      }

      // add array of targeting mods to phasing vehicle
      // show that with the reticule
      // take it into account when firing

      console.log('next target');
      car.phasing.damage_marker = null;
    },
    ghost_target_previous(state, action) {
      const car = state.find((carState) => carState.id === action.payload.id);

      const current_weapon = car.design.components.weapons[car.phasing.weapon_index];
      const current_crew_member = car.design.components.crew.driver;
      if (!Weapon.can_fire(current_weapon)) { return; }
      if (!CrewMember.can_fire(current_crew_member)) { return; }

      if(car.phasing.targets === null) {
        console.log('fetch targets');
        var targets = new Targets({ car, cars: state, walls: WallData });
        //var data = targets.targets();
        var data = targets.targets_in_arc();
        car.phasing.targets = data ? data : null;
        car.phasing.target_index = 0;
      } else {
        car.phasing.target_index = (car.phasing.target_index - 1 + car.phasing.targets.length) % car.phasing.targets.length;
      }

      // add array of targeting mods to phasing vehicle
      // show that with the reticule
      // take it into account when firing

      console.log('previous target');
      car.phasing.damage_marker = null;
    },
    ghost_fire(state, action) {
      const car = state.find((carState) => carState.id === action.payload.id);

      const weapon = car.design.components.weapons[car.phasing.weapon_index];
      const crew_member = car.design.components.crew.driver;

      var can_fire = Weapon.can_fire(weapon) && CrewMember.can_fire(crew_member);

      if (car.phasing.targets === null ||
          car.phasing.targets.length === 0 ||
          car.phasing.targets[car.phasing.target_index] === null) {
        console.log(`CANNOT FIRE: no target`);
        can_fire = false;
      }

      car.phasing.damage_marker = null;
      car.phasing.damage_message = null;
      if (!can_fire) { return; }

      console.log(`fire my ${weapon.type}`);
      console.log(`I have ${weapon.ammo} ammo.`)
      var damage = 'what?';
      console.log(`to hit: ${weapon.to_hit} / damage: ${weapon.damage}`);
      var to_hit = Dice.roll('2d');
      console.log(`to hit roll: ${to_hit} - ${(to_hit >= weapon.to_hit) ? 'hit' : 'miss'}`)
      var damage = (to_hit >= weapon.to_hit) ? Dice.roll(weapon.damage) : 0;
      console.log(`${damage} damage.`)
      weapon.ammo--;
      car.design.components.crew.driver.fired_this_turn = true;
      weapon.fired_this_turn = true;
      var target = car.phasing.targets[car.phasing.target_index];
      const target_car = state.find((carState) => carState.id === target.car_id);
      Damage.deal({ car: target_car, damage: damage, location: target.name });

      // TODO:
      // calculate to-hit mods
      // roll to hit
      // mark damage done in phasing loc, then show on map
      // apply damage in order to location hit, if any

      car.phasing.damage_marker = car.phasing.targets[car.phasing.target_index];
      car.phasing.damage_message = damage; //'BANG!';
    },
    maneuver_next(state, action) {
      const car = state.find((carState) => carState.id === action.payload.id);
      car.phasing.maneuver_index = (car.phasing.maneuver_index + 1) % car.status.maneuvers.length;
      console.log('collisions?');
      Collisions.detect({ cars: state, walls: WallData, this_car: car });
      console.log('returning from maneuver_next');
    },
    maneuver_previous(state, action) {
      const car = state.find((carState) => carState.id === action.payload.id);
      car.phasing.maneuver_index = (car.phasing.maneuver_index - 1 + car.status.maneuvers.length) % car.status.maneuvers.length;
      console.log(`man idx: ${car.phasing.maneuver_index}`);
    },
    maneuver_set(state, action) {
      const car = state.find((carState) => carState.id === action.payload.id);
      car.phasing.maneuver_index = parseInt(action.payload.maneuver_index);
      //
      // TODO: call into PhasingMove->the maneuver(car, 0)
      //
    },
    weapon_next(state, action) {
      const car = state.find((carState) => carState.id === action.payload.id);
      console.log(car.phasing.weapon_index);
      console.log(car.design.components.weapons[car.phasing.weapon_index].type);
      car.phasing.targets = null;
      car.phasing.weapon_index = (car.phasing.weapon_index + 1) % car.design.components.weapons.length;
    },
    weapon_previous(state, action) {
      const car = state.find((carState) => carState.id === action.payload.id);
      car.phasing.targets = null;
      car.phasing.weapon_index = (car.phasing.weapon_index - 1 + car.design.components.weapons.length) % car.design.components.weapons.length;
    },
    weapon_set(state, action) {
      console.log(action);
      console.log('tahat!!!');
      const car = state.find((carState) => carState.id === action.payload.id);
      console.log(`weapon: ${action.payload.weapon}`);
      console.log(typeof(action.payload.weapon));
      car.phasing.weapon_index = parseInt(action.payload.weapon);
    },
  }
})
