import { createSlice } from "redux-starter-kit";
import uuid from 'uuid/v4';

const initialTodos = [
      {
        id: uuid(),
        name: 'Read a bit',
        complete: true
      },
      {
        id: uuid(),
        name: 'Do laundry',
        complete: false
      }
    ];

export const todosSlice = createSlice({
  slice : "todos",
  initialState: initialTodos,
  reducers : {
    addTodo(state, action) {
      // You can "mutate" the state in a reducer, thanks to Immer
      state.push(action.payload)
    },
    toggleTodo(state, action) {
      const todo = state.find(todo => todo.id === action.payload);
      todo.complete = !todo.complete;
    },
    deleteTodo(state, action) {
      return state.filter((todo) => todo.id !== action.payload)
    }
  }
})
