import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
//  BrowserRouter as Router,
//  Switch,
//  Route,
  Link
//  useRouteMatch,
//  useParams
} from 'react-router-dom'

import { playerSet } from '../../redux'

import MapSelector from './MapSelector'

const PlayersForm = (props) => {
  const thisId = 'playersForm'
  const dispatch = useDispatch()

  const colorStyle = (myColor = 'black') => {
    return {
      background: 'black',
      color: myColor,
      fontSize: '40px',
      fontFamily: 'fantasy',
      fontVariant: 'small-caps'
    }
  }

  const players = useSelector((state) => state.time.moveMe.players.all)

  const onChangeName = (event) => {
    dispatch(playerSet({
      id: event.target.name,
      name: event.target.value
    }))
  }

  const onChangeColor = (event) => {
    dispatch(playerSet({
      id: event.target.id,
      color: event.target.value
    }))
  }

  const selectColors = (player) => {
    const palette = ['maroon', 'red', 'orange', 'yellow', 'olive', 'green',
      'purple', 'fuchsia', 'lime', 'teal', 'aqua', 'blue',
      'navy', 'black', 'gray', 'silver', 'white']
    var result = []

    palette.forEach(color =>
      result.push(
        <option key={ `${color}-${player.id}` } id={player.id} value={ color } style={ colorStyle(color) } >
          { color }
        </option>
      )
    )
    return (
      <select
        id={ player.id }
        onChange={ onChangeColor }
        value={ player.color }
        style={ colorStyle(player.color) }
      >
        { result }
      </select>
    )
  }

  const listPlayers = () => {
    var result = []
    var i = 1
    console.log(players)
    players.forEach(player => {
      result.push(
        <span key={ i++ }>
          <label style={ colorStyle(player.color) }>
            <input
              name={ player.id }
              type='text'
              value={ player.name }
              onChange={ onChangeName }
              style={ colorStyle(player.color) } />
            { selectColors(player) }
          </label>
          <br/>
        </span>
      )
    })
    return result
  }

  return (
    <div>
      <form id={ thisId } style={ colorStyle() }>
        <span className='FormText'>Map:<MapSelector/><br/></span>
        { listPlayers() }
      </form>
      <Link to='/arena'>
        <button className='StartGame' type='button'>
        Start A Game
        </button>
      </Link>
    </div>
  )
}

export default PlayersForm
