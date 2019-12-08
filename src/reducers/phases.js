import { createSlice } from 'redux-starter-kit'

const initialPhaseInfo = {
  number: 0
}

export const phasesSlice = createSlice({
  slice: 'phases',
  initialState: initialPhaseInfo,
  reducers: {
    turn_next (state, action) {
      state.number++
      // bump hc up
      // mark cars to be able to change speed
      // etc.
    }
  }
})
