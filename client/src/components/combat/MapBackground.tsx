import * as React from 'react'
import { INCH } from '../../utils/constants'
import LocalMatchState from './lib/LocalMatchState'

class MapLine  extends React.Component {
  props: any
  x1: number
  y1: number
  x2: number
  y2: number
  style: object
  lineWidth: number

  constructor(props: any) {
    super(props)
    this.x1 = props.x1
    this.y1 = props.y1
    this.x2 = props.x2
    this.y2 = props.y2
    this.style = {
      stroke: 'slategrey',
      fill: 'none'
    }
    this.lineWidth = props.lineWidth
  }

  render() {
    return (
      <line
        x1={ this.x1 }
        y1={ this.y1 }
        x2={ this.x2 }
        y2={ this.y2 }
        style={ this.style }
        strokeWidth={ this.lineWidth }
      />
    )
  }
}

class MapGrid extends React.Component {
  props: any
  height: number
  width: number

  constructor(props: any) {
    super(props)
    this.height = props.height
    this.width = props.width
  }

  GridLineWidth(lineNumber: number) {
    const fatLineWidth = (INCH / 20 > 1) ? (INCH / 20) : 2
    return (lineNumber % 4 === 0) ? fatLineWidth : 1
  }

  GridHorizontal({ y, width, lineWidth = 1 }: { y: number, width: number, lineWidth?: number}) {
    return (
      <MapLine
        key={ `horiz${y}` }
        x1={ 0 }
        y1={ y }
        x2={ width }
        y2={ y }
        lineWidth={ lineWidth }
      />
    )
  }

  GridVertical({ x, height, lineWidth = 1 }: { x: number, height: number, lineWidth?: number}) {
    return (
      <MapLine
        key={ `vert${x}` }
        x1={ x }
        y1={ 0 }
        x2={ x }
        y2={ height }
        lineWidth={ lineWidth }
      />
    )
  }

  render() {
    const edgeLength = INCH / 4
    var result = []
    for (var x = 0; x < this.width / edgeLength; x++) {
      result.push(this.GridVertical({ x: x * edgeLength, height: this.height, lineWidth: this.GridLineWidth(x) }))
    }
    for (var y = 0; y < this.height / edgeLength; y++) {
      result.push(this.GridHorizontal({ y: y * edgeLength, width: this.width, lineWidth: this.GridLineWidth(y)}))
    }
    return result
  }
}

class MapBackground extends React.Component {
  props: any
  lms: any

  render() {
    const mapSize = new LocalMatchState(this.props.matchData).mapSize()
    return (
      <g id='grid'>
        <MapGrid
          width={ mapSize.width }
          height={ mapSize.height }
        />
      </g>
    )
  }
}

export default MapBackground
