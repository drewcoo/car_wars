import React from 'react'
import { useSelector } from 'react-redux'
import { defaultStyle } from './timeStyle'

const Phase = () => {
  const phase = useSelector((state) => state.time.phase)

  return (
    <span id='phase' style={ defaultStyle }>Phase: { phase.number }</span>
  )
}

export default Phase
