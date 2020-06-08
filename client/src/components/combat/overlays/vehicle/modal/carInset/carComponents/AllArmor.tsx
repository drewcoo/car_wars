import React from 'react'
import Dimensions from '../../../../../../../utils/Dimensions'

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  carData: any
  carDimensions: Dimensions
}

class AllArmor extends React.Component<Props> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dimensions: Map<string, any>
  constructor(props: Props) {
    super(props)
    this.dimensions = new Map([
      ['F', { x: (this.props.carDimensions.width * 16) / 64, y: (this.props.carDimensions.length * 4) / 64 }],
      ['T', { x: (this.props.carDimensions.width * 38) / 64, y: (this.props.carDimensions.length * 4) / 64 }],
      ['L', { x: (this.props.carDimensions.width * 1) / 64, y: (this.props.carDimensions.length * 36) / 64 }],
      ['R', { x: (this.props.carDimensions.width * 63) / 64, y: (this.props.carDimensions.length * 36) / 64 }], // textAnchor={'end'}
      ['B', { x: (this.props.carDimensions.width * 16) / 64, y: (this.props.carDimensions.length * 62) / 64 }],
      ['U', { x: (this.props.carDimensions.width * 38) / 64, y: (this.props.carDimensions.length * 62) / 64 }],
    ])
  }

  armor(location: string): React.ReactNode {
    const style = {
      red: { fill: 'red' },
      black: { fill: 'black' },
    }
    const DP = this.props.carData.design.components.armor[location]
    const dimensions = this.dimensions.get(location)
    return (
      <text
        x={dimensions.x}
        y={dimensions.y}
        style={DP < 1 ? style.red : style.black}
        textAnchor={location === 'R' ? 'end' : ''}
      >
        {location}:{DP}
      </text>
    )
  }

  render(): React.ReactNode {
    return (
      <>
        {this.armor('F')}
        {this.armor('T')}
        {this.armor('L')}
        {this.armor('R')}
        {this.armor('B')}
        {this.armor('U')}
      </>
    )
  }
}

export default AllArmor
