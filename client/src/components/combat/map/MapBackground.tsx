import * as React from 'react'
import LocalMatchState from '../lib/LocalMatchState'
import MapGrid from './MapGrid'

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  matchData: any
}

class MapBackground extends React.Component<Props> {
  render(): React.ReactNode {
    const mapSize = new LocalMatchState(this.props.matchData).mapSize()
    return (
      <g id="grid">
        <MapGrid width={mapSize.width} height={mapSize.height} />
      </g>
    )
  }
}

export default MapBackground
