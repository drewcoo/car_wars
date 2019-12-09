import { createSlice } from 'redux-starter-kit'

// bugbug - one car per player
// const carIndex = 0;
const initialStats = {}

export const ghostSlice = createSlice({
  slice: 'ghostStates',
  initialState: initialStats,
  reducers: {
    ghostInitialize (state, action) {
      // expect car in action.payload
      state = action.payload.copy()
      console.log('state position')
      console.log(state.position)
      state.phasing = state.position
    },
    ghostForward (state, action) {
      var rad = state.position.facing / 360 * 2 * Math.PI
      var temp = {
        facing: state.position.facing,
        frontLeft: {
          x: state.position.x += 60 * Math.sin(rad),
          y: state.position.y -= 60 * Math.cos(rad)
        }
      }
      state.phasing = temp
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
    maneuverNext(state, action) {
      const car = state.find((carState) => carState.color === action.payload.color);
      var tempIndex = car.status.maneuverIndex + 1;
      if (tempIndex >= car.status.maneuvers.length) { tempIndex = 0; }
      car.status.maneuverIndex = tempIndex;
    },
    maneuverSet(state, action) {
      const car = state.find((carState) => carState.color === action.payload.color);
      car.status.maneuverIndex = action.payload.maneuverIndex;
    },
    weaponNext(state, action) {
      const car = state.find((carState) => carState.color === action.payload.color);
      var tempIndex = car.status.weaponIndex + 1;
      if (tempIndex >= car.design.components.weapons.length) { tempIndex = 0; }
      car.status.weaponIndex = tempIndex;
    },
    weaponSet(state, action) {
      console.log(action.payload);
      const car = state.find((carState) => carState.color === action.payload.color);
      car.status.weaponIndex = action.payload.weapon;
    },
    */
  }
})
