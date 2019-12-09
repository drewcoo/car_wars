import { createSlice } from 'redux-starter-kit'

const initialTurnInfo = {
  number: 0
}

export const turnsSlice = createSlice({
  slice: 'turns',
  initialState: initialTurnInfo,
  reducers: {
    turnNext (state, action) {
      state.number++
      // bump hc up
      // mark cars to be able to change speed
      // etc.
    }
  }
})
