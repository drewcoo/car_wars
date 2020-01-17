import { combineReducers } from 'redux'
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'

import { matchesSlice } from './reducers/matches'

const reducer = combineReducers({
  matches: matchesSlice.reducer
})

export const store = configureStore({
  reducer: reducer,
  middleware: [...getDefaultMiddleware()]
})

export const {
  maneuverNext, maneuverPrevious, maneuverSet,
  speedNext, speedPrevious, speedSet,
  ghostForward, ghostHalf, ghostReset, ghostTurnBend, ghostMoveDrift, ghostTurnSwerve,
  ghostShowCollisions,
  ghostTargetNext, ghostTargetPrevious, ghostTargetSet,
  fireWeapon,
  acceptMove,
  weaponNext, weaponPrevious, weaponSet,
  currentPlayer,
  addMatch, addCarToMatch, startMatch, finishMatch,
  shiftModal, addMap
} = matchesSlice.actions
