import React from 'react'
import { useSelector } from 'react-redux'
import { INCH } from '../../utils/constants'

const MapLine = ({ x1, y1, x2, y2, lineWidth = 1 }) => {
  const style = {
    stroke: 'black',
    fill: 'none'
  }

  return (
    <line
      x1={ x1 }
      y1={ y1 }
      x2={ x2 }
      y2={ y2 }
      style={ style }
      strokeWidth={lineWidth}
    />
  )
}

const MapGrid = (mapWidth, mapHeight) => {
  const edgeLength = INCH / 4
  const fatLineWidth = (INCH / 20 > 1) ? (INCH / 20) : 2

  const GridLineWidth = (lineNumber) => {
    return (lineNumber % 4 === 0) ? fatLineWidth : 1
  }

  const GridHorizontal = (y, lineWidth = 1) => {
    return (
      <MapLine
        key={ `horiz${y}` }
        x1={ 0 }
        y1={ y }
        x2={ mapWidth }
        y2={ y }
        lineWidth={ lineWidth }
      />
    )
  }

  const GridVertical = (x, lineWidth = 1) => {
    return (
      <MapLine
        key={ `vert${x}` }
        x1={ x }
        y1={ 0 }
        x2={ x }
        y2={ mapHeight }
        lineWidth={ lineWidth }
      />
    )
  }

  var result = []
  for (var x = 0; x < mapWidth / edgeLength; x++) {
    result.push(GridVertical(x * edgeLength, GridLineWidth(x)))
  }
  for (var y = 0; y < mapHeight / edgeLength; y++) {
    result.push(GridHorizontal(y * edgeLength, GridLineWidth(y)))
  }
  return result
}

const MapBackground = ({ matchId }) => {
  const mapSize = useSelector((state) => state.matches[matchId].map.size)
  return (
    <g id='grid'>
      { MapGrid(mapSize.width, mapSize.height) }
    </g>
  )
}

export default MapBackground
