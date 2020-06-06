import React from 'react'
import '../../../../App.css'
import SVG from 'react-inlinesvg'

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  car: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  designs: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleCarNameChange: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleDesignChange: any
  playerId: string
}

class Vehicle extends React.Component<Props> {
  addDesignSelector(): React.ReactNode {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any[] = []
    console.log(this.props.designs)
    //return <>{this.props.designs[0].name}</>
    console.log(this.props.designs)
    this.props.designs.forEach((design, index) =>
      result.push(
        <option className="SetupPage" id={design.name} key={`design-${index}`} value={design.name}>
          {design.name}
        </option>,
      ),
    )

    console.log(this.props.car.designName)

    return (
      <select
        className="SetupPage"
        id={`design-p${this.props.playerId}-v${this.props.car.id}`}
        onChange={this.props.handleDesignChange}
        value={this.props.car.designName}
      >
        {result}
      </select>
    )
  }

  render(): React.ReactNode {
    return (
      <div className="SetupPage" key={this.props.car.id} style={{ columns: 2 }}>
        <div>
          <input
            className="SetupPage"
            id={`carname-p${this.props.playerId}-v${this.props.car.id}`}
            key={this.props.car.id}
            style={{ color: this.props.car.color }}
            type="text"
            defaultValue={this.props.car.name}
            onChange={this.props.handleCarNameChange}
          />
          <div style={{ whiteSpace: 'nowrap' }}>{this.addDesignSelector()}</div>
        </div>

        <div>
          <svg>
            <rect x={0} y={-40} height={190} width={95} fill={'#5b5b5b'} />
            <SVG
              src={this.props.designs.find((found) => found.name === this.props.car.designName).imageFile}
              width={'25%'}
              height={'125%'}
              x={10}
              y={-20}
              style={{ opacity: 1, fill: this.props.car.color }}
            />
          </svg>
        </div>
      </div>
    )
  }
}

export default Vehicle
