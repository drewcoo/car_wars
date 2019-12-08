import React from 'react'
import { WallData } from '../maps/arena_map_1'

const Walls = () => {
  const wall_style = {
    fill: 'black',
    stroke: 'black'
  }

  return (
    <g>
      {
        WallData.map((wall) => (
          <g key={wall.id}>
            <rect
              x = { wall.rect.BR_point().x - wall.rect.width }
              y = { wall.rect.BR_point().y - wall.rect.length }
              width = { wall.rect.width }
              height = { wall.rect.length }
              style = { wall_style }
              transform = {`rotate(${wall.rect.facing + 90} ${wall.rect.BR_point().x} ${wall.rect.BR_point().y})`}
            />
          </g>
        ))
      }
    </g>
  )
}

export default Walls
