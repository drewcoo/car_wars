import { createSlice } from "redux-starter-kit";
import uuid from 'uuid/v4';

const initialPlayers = {
      current_index: 0,
      all: [
        { id: uuid(), name: 'Alice',  color: 'red',    car_ids: ['car0'], current_car_index: 0 },
        { id: uuid(), name: 'Bob',    color: 'blue',   car_ids: ['car1'], current_car_index: 0},
        { id: uuid(), name: 'Carol',  color: 'green',  car_ids: ['car2'], current_car_index: 0},
        { id: uuid(), name: 'Donald', color: 'purple', car_ids: ['car3'], current_car_index: 0}
      ]
    };

export const playersSlice = createSlice({
  slice : "players",
  initialState: initialPlayers,
  reducers : {
    player_next(state, action) {
      var temp_index = state.current_index + 1;
      if (temp_index >= state.all.length) { temp_index = 0; }
      state.current_index = temp_index;
    },
  }
});
