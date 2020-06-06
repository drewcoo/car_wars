import React from 'react'
import '../../../../App.css'
import Vehicle from './Vehicle'

interface Props {
  autoFocus: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  designs: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleCarNameChange: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleColorChange: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleDesignChange: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handlePlayerNameChange: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  player: any
}

class Player extends React.Component<Props> {
  palette: string[]
  constructor(props: Props) {
    super(props)
    this.palette = [
      'maroon',
      'red',
      'orange',
      'yellow',
      'olive',
      'green',
      'purple',
      'fuchsia',
      'lime',
      'teal',
      'aqua',
      'blue',
      'navy',
      'black',
      'gray',
      'silver',
      'white',
    ]
  }

  addPlayerColorSelector(): React.ReactNode {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any[] = []

    this.palette.forEach((color) =>
      result.push(
        <option
          className="SetupPage"
          id={this.props.player.id}
          key={`${color}-${this.props.player.id}`}
          style={{ color: color }}
          value={color}
        >
          {color}
        </option>,
      ),
    )
    return (
      <select
        className="SetupPage"
        id={`color-${this.props.player.id}`}
        onChange={this.props.handleColorChange}
        value={this.props.player.color}
        style={{ color: this.props.player.color }}
      >
        {result}
      </select>
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  showCars(): any[] {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any[] = []
    // BUGBUG: hard-code to first car
    console.log(this.props.designs)

    console.log(this.props.player)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.props.player.cars.forEach((car: any) => {
      result.push(
        <Vehicle
          car={car}
          designs={this.props.designs}
          handleCarNameChange={this.props.handleCarNameChange}
          handleDesignChange={this.props.handleDesignChange}
          key={car.id}
          playerId={this.props.player.id}
        />,
      )
    })
    return result
  }

  render(): React.ReactNode {
    return (
      <div key={`div-${this.props.player.id}`}>
        <fieldset className="SetupPage" key={`fieldset-${this.props.player.id}`} style={{ width: '80%' }}>
          <legend>
            <input
              autoFocus={this.props.autoFocus}
              className="SetupPage"
              style={{ color: this.props.player.color }}
              id={this.props.player.id}
              /*key={this.props.player.id}*/
              type="text"
              defaultValue={this.props.player.name}
              onChange={this.props.handlePlayerNameChange}
            />
            {this.addPlayerColorSelector()}
          </legend>
          {this.showCars()}
        </fieldset>
      </div>
    )
  }
}

export default Player
