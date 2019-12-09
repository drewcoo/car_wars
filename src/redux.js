import { combineReducers } from 'redux'
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

export const store = configureStore({
  reducer: reducer,
  middleware: [...getDefaultMiddleware()]
})

export const {
  addCarState, deleteCarState, getCarByColor, getCarStates,
  maneuverNext, maneuverPrevious, maneuverSet,
  ghostForward, ghostReset, ghostTurnBend, ghostMoveDrift, ghostTurnSwerve,
  ghostShowCollisions,
  ghostTargetNext, ghostTargetPrevious,
  ghostFire,
  acceptMove,
  weaponNext, weaponPrevious, weaponSet
} = carsSlice.actions
export const { playerNext } = playersSlice.actions
export const { turnNext } = turnsSlice.actions
export const { phaseNext } = phasesSlice.actions
