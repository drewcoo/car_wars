import * as React from 'react'
import { INCH } from '../../../utils/constants'

import MapLine from './MapLine'

interface Props {
  height: number
  width: number
}

class MapGrid extends React.Component<Props> {
  GridLineWidth(lineNumber: number): number {
    const fatLineWidth = INCH / 20 > 1 ? INCH / 20 : 2
    return lineNumber % 4 === 0 ? fatLineWidth : 1
  }

  GridHorizontal({ y, width, lineWidth = 1 }: { y: number; width: number; lineWidth?: number }): React.ReactNode {
    return <MapLine key={`horiz${y}`} x1={0} y1={y} x2={width} y2={y} lineWidth={lineWidth} />
  }

  GridVertical({ x, height, lineWidth = 1 }: { x: number; height: number; lineWidth?: number }): React.ReactNode {
    return <MapLine key={`vert${x}`} x1={x} y1={0} x2={x} y2={height} lineWidth={lineWidth} />
  }

  render(): React.ReactNode {
    const edgeLength = INCH / 4
    const result = []
    for (let x = 0; x < this.props.width / edgeLength; x++) {
      result.push(this.GridVertical({ x: x * edgeLength, height: this.props.height, lineWidth: this.GridLineWidth(x) }))
    }
    for (let y = 0; y < this.props.height / edgeLength; y++) {
      result.push(this.GridHorizontal({ y: y * edgeLength, width: this.props.width, lineWidth: this.GridLineWidth(y) }))
    }
    return result
  }
}

export default MapGrid
