import * as React from 'react'
import LocalMatchState from './lib/LocalMatchState'
import Car from './Car'
import MapBackground from './map/MapBackground'
import Walls from './Walls'
import ActiveCar from './ActiveCar'
import ViewElement from './lib/ViewElement'

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  matchData: any
}

class ArenaMap extends React.Component<Props> {
  /*
  constructor(props: Props) {
    super(props)
  }
  */

  componentDidMount(): void {
    const lms = new LocalMatchState(this.props.matchData)
    if (lms.activeCar()) {
      ViewElement(lms.activeCar().id)
    } else {
      const pid = localStorage.getItem('playerId')
      if (
        pid &&
        lms
          .cars()
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((elem: any) => elem.playerId)
          .includes(pid)
      ) {
        const id: string | null = localStorage.getItem('playerId')
        if (id) {
          ViewElement(lms.player({ id }).carIds[0])
        }
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addCars(lms: any): React.ReactNode {
    return (
      <>
        {Object.values(lms.cars()).map((car) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const thing: any = car
          const id: string = thing.id
          return <Car key={id} matchData={this.props.matchData} id={id} client={this.props.client} />
        })}
        {Object.values(lms.cars()).map((car) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const thing: any = car
          const id: string = thing.id
          return (
            <Car
              key={`shadow-${id}`}
              matchData={this.props.matchData}
              id={id}
              client={this.props.client}
              shadow={true}
            />
          )
        })}
      </>
    )
  }

  render(): React.ReactNode {
    const lms = new LocalMatchState(this.props.matchData)

    return (
      <svg id="ArenaMap" width={lms.mapSize().width} height={lms.mapSize().height}>
        <MapBackground matchData={this.props.matchData} />
        <Walls matchData={this.props.matchData} />
        {this.addCars(lms)}
        <ActiveCar matchData={this.props.matchData} client={this.props.client} />
      </svg>
    )
  }
}

export default ArenaMap
