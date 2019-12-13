import React from 'react'
import { useSelector } from 'react-redux'
import { defaultStyle } from './timeStyle'

const Turn = () => {
  const turn = useSelector((state) => state.time.turn)

  return (
    <span id='turn' style={ defaultStyle }>Turn: { turn.number }</span>
  )
}

export default Turn
