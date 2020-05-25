import * as React from 'react'
import Point from '../../../../../../../utils/geometry/Point'
import uuid from 'uuid'

interface Props {
  tire?: boolean
  centerPoint: Point
  edgeLength: number
  dp: number
  maxDp: number
}

class DamageBoxes extends React.Component<Props> {
  render(): React.ReactNode {
    const boxesPerRow = this.props.tire ? 3 : 5
    console.log(this.props.edgeLength)
    const boxSide = this.props.edgeLength / boxesPerRow
    const boxesInBaseRow = this.props.maxDp > boxesPerRow ? boxesPerRow : this.props.maxDp

    const x = this.props.centerPoint.x - (boxesInBaseRow / 2) * boxSide
    const y = this.props.centerPoint.y + this.props.edgeLength / 2 - boxSide

    const boxArray = []
    for (let i = 0; i < this.props.maxDp; i++) {
      boxArray.push(
        <rect
          key={uuid()}
          x={x + (i % boxesPerRow) * boxSide}
          y={y - Math.floor(i / boxesPerRow) * boxSide}
          height={boxSide}
          width={boxSide}
          fill="floralwhite"
          stroke="black"
          strokeWidth="2"
        />,
      )
      if (i >= this.props.dp) {
        boxArray.push(
          <line
            key={uuid()}
            x1={x + (i % boxesPerRow) * boxSide}
            y1={y - Math.floor(i / boxesPerRow) * boxSide}
            x2={x + ((i % 4) + 1) * boxSide}
            y2={y - Math.floor(i / boxesPerRow) * boxSide + boxSide}
            stroke="black"
            strokeWidth="2"
          />,
        )
        boxArray.push(
          <line
            key={uuid()}
            x1={x + i * boxSide}
            y1={y - Math.floor(i / boxesPerRow) * boxSide + boxSide}
            x2={x + (i + 1) * boxSide}
            y2={y - Math.floor(i / boxesPerRow) * boxSide}
            stroke="black"
            strokeWidth="2"
          />,
        )
      }
    }

    return <svg>{boxArray}</svg>
  }
}

export default DamageBoxes
