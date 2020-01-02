import React from 'react'
import { useSelector } from 'react-redux'
import { defaultStyle } from './timeStyle'

const Phase = ({ matchId }) => {
  const phase = useSelector((state) => state.matches[matchId].time.phase)

  return (
    <span id='phase' style={ defaultStyle }>Phase: { phase.number }</span>
  )
}

export default Phase
