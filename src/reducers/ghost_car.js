import { createSlice } from "redux-starter-kit";
import { INCH } from '../utils/constants';
import { KillerKart } from '../vehicle_designs/KillerKart';

import { useSelector } from 'react-redux';


const maneuver_values = [
  'none',
  //'half',
  'forward',
  'bend',
  'drift',
  'swerve',
  // more
];

// bugbug - one car per player
//const car_index = 0;
const initialStats = {};

export const ghostSlice = createSlice({
  slice : "ghostStates",
  initialState: initialStats,
  reducers : {
    ghost_initialize(state, action) {
      // expect car in action.payload
      state = action.payload.copy();
      console.log("state position");
      console.log(state.position);
      state.phasing = state.position;
    },
    ghost_forward(state, action) {
      var rad = state.position.facing / 360 * 2 * Math.PI;
      var temp = {
        facing: state.position.facing,
        front_left: {
          x: state.position.x += 60 * Math.sin(rad),
          y: state.position.y -= 60 * Math.cos(rad)
        }
      };
      state.phasing = temp;
    }
    /*
    addCarState(state, action) {
      // You can "mutate" the state in a reducer, thanks to Immer
      state.push(action.payload)
    },
    deleteCarState(state, action) {
      return state.filter((carState) => carState.color !== action.payload)
    },
    getCarStates(state, action) {
      var result = state.filter((carState) => carState.color !== action.payload);
      console.log('get car states:');
      console.log(result);
      return result;
    },
    maneuver_next(state, action) {
      const car = state.find((carState) => carState.color === action.payload.color);
      var temp_index = car.status.maneuver_index + 1;
      if (temp_index >= car.status.maneuvers.length) { temp_index = 0; }
      car.status.maneuver_index = temp_index;
    },
    maneuver_set(state, action) {
      const car = state.find((carState) => carState.color === action.payload.color);
      car.status.maneuver_index = action.payload.maneuver_index;
    },
    weapon_next(state, action) {
      const car = state.find((carState) => carState.color === action.payload.color);
      var temp_index = car.status.weapon_index + 1;
      if (temp_index >= car.design.components.weapons.length) { temp_index = 0; }
      car.status.weapon_index = temp_index;
    },
    weapon_set(state, action) {
      console.log(action.payload);
      const car = state.find((carState) => carState.color === action.payload.color);
      car.status.weapon_index = action.payload.weapon;
    },
    */
  }
})
