import React from 'react'
import { WallData } from '../../maps/arenaMap1'

const Walls = () => {
  const wallStyle = {
    fill: 'black',
    stroke: 'black'
  }

  return (
    <g>
      {
        WallData.map((wall) => (
          <g key={wall.id}>
            <rect
              x = { wall.rect.brPoint().x - wall.rect.width }
              y = { wall.rect.brPoint().y - wall.rect.length }
              width = { wall.rect.width }
              height = { wall.rect.length }
              style = { wallStyle }
              transform = {`rotate(${wall.rect.facing + 90} ${wall.rect.brPoint().x} ${wall.rect.brPoint().y})`}
            />
          </g>
        ))
      }
    </g>
  )
}

export default Walls
