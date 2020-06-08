import * as React from 'react'

interface Props {
  x1: number
  y1: number
  x2: number
  y2: number
  lineWidth: number
}

class MapLine extends React.Component<Props> {
  render(): React.ReactNode {
    const style = {
      stroke: 'slategrey',
      fill: 'none',
    }
    return (
      <line
        x1={this.props.x1}
        y1={this.props.y1}
        x2={this.props.x2}
        y2={this.props.y2}
        style={style}
        strokeWidth={this.props.lineWidth}
      />
    )
  }
}

export default MapLine
