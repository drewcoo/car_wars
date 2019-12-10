import React from 'react'
import { INCH } from '../utils/constants'
import { MAP_SIZE } from '../maps/arenaMap1'

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

const MapGrid = (width, height) => {
  const edgeLength = INCH / 4
  const fatLineWidth = (INCH / 20 > 1) ? (INCH / 20) : 2

  const GridLineWidth = (lineNumber) => {
    return (lineNumber % 4 === 0) ? fatLineWidth : 1
  }

  const GridHorizontal = (y, lineWidth = 1) => {
    return (<MapLine key={`horiz${y}`} x1={0} y1={y} x2={MAP_SIZE.WIDTH} y2={y} lineWidth={lineWidth} />)
  }

  const GridVertical = (x, lineWidth = 1) => {
    return (<MapLine key={`vert${x}`} x1={x} y1={0} x2={x} y2={MAP_SIZE.HEIGHT} lineWidth={lineWidth} />)
  }

  var result = []
  for (var x = 0; x < width / edgeLength; x++) {
    result.push(GridVertical(x * edgeLength, GridLineWidth(x)))
  }
  for (var y = 0; y < height / edgeLength; y++) {
    result.push(GridHorizontal(y * edgeLength, GridLineWidth(y)))
  }
  return result
}

const MapBackground = () => {
  return (
    <g id='grid'>
      { MapGrid(MAP_SIZE.WIDTH, MAP_SIZE.HEIGHT) }
    </g>
  )
}

export default MapBackground
