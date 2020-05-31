import React from 'react'

/*
interface Props {
  carData: any
  carDimensions: Dimensions
}
*/

class AllArmor extends React.Component /*<Props>*/ {
  armor(location) {
    const dimensions = {
      F: { x: (this.props.carDimensions.width * 16) / 64, y: (this.props.carDimensions.length * 9) / 64 },
      T: { x: (this.props.carDimensions.width * 38) / 64, y: (this.props.carDimensions.length * 9) / 64 },
      L: { x: (this.props.carDimensions.width * 1) / 64, y: (this.props.carDimensions.length * 36) / 64 },
      R: { x: (this.props.carDimensions.width * 63) / 64, y: (this.props.carDimensions.length * 36) / 64 }, // textAnchor={'end'}
      B: { x: (this.props.carDimensions.width * 16) / 64, y: (this.props.carDimensions.length * 63) / 64 },
      U: { x: (this.props.carDimensions.width * 38) / 64, y: (this.props.carDimensions.length * 63) / 64 },
    }
    const style = {
      red: { fill: 'red' },
      black: { fill: 'black' },
    }
    const DP = this.props.carData.design.components.armor[location]

    return (
      <text
        x={dimensions[location].x}
        y={dimensions[location].y}
        style={DP < 1 ? style.red : style.black}
        textAnchor={location === 'R' ? 'end' : ''}
      >
        {location}:{DP}
      </text>
    )
  }

  render() {
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
