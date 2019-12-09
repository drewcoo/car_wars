import { createSlice } from 'redux-starter-kit'
import uuid from 'uuid/v4'

const initialPlayers = {
  currentIndex: 0,
  all: [
    { id: uuid(), name: 'Alice', color: 'red', carIds: ['car0'], currentCarIndex: 0 },
    { id: uuid(), name: 'Bob', color: 'blue', carIds: ['car1'], currentCarIndex: 0 },
    { id: uuid(), name: 'Carol', color: 'green', carIds: ['car2'], currentCarIndex: 0 },
    { id: uuid(), name: 'Donald', color: 'purple', carIds: ['car3'], currentCarIndex: 0 }
  ]
}

export const playersSlice = createSlice({
  slice: 'players',
  initialState: initialPlayers,
  reducers: {
    playerNext (state, action) {
      var tempIndex = state.currentIndex + 1
      if (tempIndex >= state.all.length) { tempIndex = 0 }
      state.currentIndex = tempIndex
    }
  }
})
