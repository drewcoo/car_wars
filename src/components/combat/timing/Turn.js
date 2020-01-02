import React from 'react'
import { useSelector } from 'react-redux'
import { defaultStyle } from './timeStyle'

const Turn = ({ matchId }) => {
  const turn = useSelector((state) => state.matches[matchId].time.turn)

  return (
    <span id='turn' style={ defaultStyle }>Turn: { turn.number }</span>
  )
}

export default Turn
