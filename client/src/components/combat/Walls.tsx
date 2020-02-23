import * as React from 'react'
import '../../App.css'

import LocalMatchState from './lib/LocalMatchState'

class Walls extends React.Component {
  props: any
  lms: any

  wallData() {
    const data: any = new LocalMatchState(this.props.matchData).map().wallData
    return (
      data.map((wall: any) => (
        <g key={ wall.id }>
        <rect
          className={ 'Wall' }
          x = { wall.rect._brPoint.x - wall.rect.width }
          y = { wall.rect._brPoint.y - wall.rect.length }
          width = { wall.rect.width }
          height = { wall.rect.length }
          transform = { `rotate(${ wall.rect.facing + 90 } ${ wall.rect._brPoint.x } ${ wall.rect._brPoint.y })` }
        />
        </g>
      ))
    )
  }

  render() {
    return (
      <g>
        { this.wallData() }
      </g>
    )
  }
}

export default Walls
