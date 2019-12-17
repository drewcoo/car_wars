import { createSlice } from 'redux-starter-kit'
import uuid from 'uuid/v4'
import { shuffle } from '../utils/shuffle'

const orderedPlayers = [
    { id: uuid(), name: 'Alice', color: 'red', carIds: ['car0'], currentCarIndex: 0, currentSpeed: 20 },
    { id: uuid(), name: 'Bob', color: 'blue', carIds: ['car1'], currentCarIndex: 0, currentSpeed: 20 },
    { id: uuid(), name: 'Carol', color: 'green', carIds: ['car2'], currentCarIndex: 0, currentSpeed: 20 },
    { id: uuid(), name: 'Donald', color: 'purple', carIds: ['car3'], currentCarIndex: 0, currentSpeed: 20 }
  ]

const initialTimeInfo = {
  turn: {
    number: 1
  },
  phase: {
    number: 1,
    phaseOrdering: orderedPlayers,
    currentlyPhasing: 0
  },
  moveMe: {
    players: {
      all: orderedPlayers,
      currentIndex: 0
    }
  }
}

export const timeSlice = createSlice({
  slice: 'time',
  initialState: initialTimeInfo,
  reducers: {
    phaseNext (state, action) {
      var newPhase = state.phase.number + 1
      if (newPhase > 5) {
        // bump hc up, mark cars to be able to change speed, etc.
        state.turn.number += 1
        state.moveMe.players.all = shuffle(state.moveMe.players.all)
        newPhase = 1
      }
      state.phase.number = newPhase
    },
    playerNext (state, action) {
      var tempIndex = state.moveMe.players.currentIndex + 1
      if (tempIndex >= state.phase.phaseOrdering.length) {
        tempIndex = 0
        var newPhase = state.phase.number + 1
        if (newPhase > 5) {
          newPhase = 1
          state.turn.number += 1
          // bump hc up, mark cars to be able to change speed, etc.
          state.moveMe.players.all = shuffle(state.moveMe.players.all)
        }
        state.phase.phaseOrdering = state.moveMe.players.all.slice(0)
        state.phase.currentlyPhasing = 0
        state.phase.number = newPhase
      }
      state.moveMe.players.currentIndex = tempIndex
    },
    playerSet (state, action) {
      const player = state.moveMe.players.all.find(player => player.id === action.payload.id)
      console.log(action.payload)
      console.log(player)
      if (action.payload.name) {
        player.name = action.payload.name
      }
      if (action.payload.color) {
        console.log(action.payload.color)
        console.log(player)
        console.log(player.color)
        player.color = action.payload.color
      }
    },
      /*
      playerAdd (state, action) {
        const player_collision = state.moveMe.players.all.find(player => player.id === action.payload.id)
        if (player_collision) { throw new Error 'user id already exists!' }
        player = {}
        player.id = action.payload.id
        player.name = action.payload.name
        player.color = action.payload.color
        player.carIds = []
        state.moveMe.Players.all.push(player)
        // don't put currentCarIndex or currentSpeed here.
        { id: uuid(), name: 'Alice', color: 'red', carIds: ['car0'], currentCarIndex: 0, currentSpeed: 20 },\
        // deal with sorting order by car instead
      }
      */
    playersReset (state, action) {
    //const players = state.moveMe.players
      var temp = action.payload.players
      console.log(temp)
      temp.forEach(player => {
        player.carIds = player.cars.map(car => {
          return car.name
        })
        delete player.cars
      })
      console.log(temp)
      state.moveMe.players.all = temp
      //console.log(state.moveMe)
    }
  }
})
