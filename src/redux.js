import { applyMiddleware, combineReducers, createStore } from 'redux'
import { configureStore, getDefaultMiddleware } from 'redux-starter-kit'

import { carsSlice } from './reducers/cars'
import { playersSlice } from './reducers/players'
import { turnsSlice } from './reducers/turns'
import { phasesSlice } from './reducers/phases'

const reducer = combineReducers({
  cars: carsSlice.reducer,
  players: playersSlice.reducer,
  turns: turnsSlice.reducer,
  phases: phasesSlice.reducer
})

const thunk = require('redux-thunk')
// const reducer = require('./reducers/index');

// Be sure to ONLY add this middleware in development!
/*
const middleware = process.env.NODE_ENV !== 'production' ?
  [require('redux-immutable-state-invariant').default(), thunk] :
  [thunk];
*/
// const middleware = [require('redux-immutable-state-invariant').default(), thunk];
const middleware = []

/*
// Note passing middleware as the last argument to createStore requires redux@>=3.1.0
export const store = createStore(
  reducer,
  applyMiddleware(...middleware)
);
*/

/*
export const store = createStore(
  reducer,
);
*/

export const store = configureStore({
  reducer: reducer,
  middleware: [...getDefaultMiddleware()]
})

//
//  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// );
/// ///////////

export const {
  addCarState, deleteCarState, getCarByColor, getCarStates,
  maneuver_next, maneuver_previous, maneuver_set,
  ghost_forward, ghost_reset, ghost_turn_bend, ghost_move_drift, ghost_turn_swerve,
  ghost_show_collisions,
  ghost_target_next, ghost_target_previous,
  ghost_fire,
  accept_move,
  weapon_next, weapon_previous, weapon_set
} = carsSlice.actions
export const { player_next } = playersSlice.actions
export const { turn_next } = turnsSlice.actions
export const { phase_next } = phasesSlice.actions
