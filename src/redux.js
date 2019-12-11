import { combineReducers } from 'redux'
import { configureStore, getDefaultMiddleware } from 'redux-starter-kit'

import { carsSlice } from './reducers/cars'
import { timeSlice } from './reducers/time'

const reducer = combineReducers({
  cars: carsSlice.reducer,
  time: timeSlice.reducer
})

export const store = configureStore({
  reducer: reducer,
  middleware: [...getDefaultMiddleware()]
})

export const {
  addCarState, deleteCarState, getCarByColor, getCarStates,
  maneuverNext, maneuverPrevious, maneuverSet,
  speedNext, speedPrevious, speedSet,
  ghostForward, ghostReset, ghostTurnBend, ghostMoveDrift, ghostTurnSwerve,
  ghostShowCollisions,
  ghostTargetNext, ghostTargetPrevious,
  ghostFire,
  acceptMove,
  weaponNext, weaponPrevious, weaponSet
} = carsSlice.actions
export const { phaseNext, playerNext, currentPlayer } = timeSlice.actions
