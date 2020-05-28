import * as React from 'react'
import '../../../../../App.css'
import _ from 'lodash'
import uuid from 'uuid'

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  matchData: any
}

class MoveOrder extends React.Component<Props> {
  phaseBox({ phaseNumber }: { current?: boolean; phaseNumber: number }): React.ReactNode {
    const maxX = 25
    const maxY = 20
    const diameter = maxY / 4
    const current = this.props.matchData.match.time.phase.number === phaseNumber
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = []
    const movesByPhase = _.sortBy(this.props.matchData.match.time.turn.movesByPhase[phaseNumber - 1], [
      'absSpeed',
    ]).reverse()

    let cy = maxY / 2 - diameter / 2 - (diameter * movesByPhase.length) / 2

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    movesByPhase.forEach((movesAtSpeed: any) => {
      cy += diameter
      let cx = -diameter / 2
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      movesAtSpeed.movers.forEach((mover: any) => {
        cx += diameter
        if (!current || mover.id !== this.props.matchData.match.time.phase.moving) {
          /* Add label for multple game objects per color?
                        <text
                key={uuid()}
                textAnchor="middle"
                x={cx - 0.5}
                y={cy + 1.5}
                style={{ font: '4px fantasy' }}
                fill="white"
              >
                1
              </text>
          */
          result.push(
            <>
              <circle key={uuid()} cx={cx} cy={cy} r="2" fill={mover.color} />
            </>,
          )
        } else {
          result.push(
            <circle key={uuid()} cx={cx} cy={cy} r="2" fill={mover.color}>
              <animate
                attributeType="XML"
                attributeName="opacity"
                values="1;1;1;1;0.5;0;0.5;1;1;1;1"
                dur=".4s"
                repeatCount="indefinite"
              />
            </circle>,
          )
        }
      })
    })

    return (
      <svg viewBox={`0 0 ${maxX} ${maxY}`} width="5%" xmlns="http://www.w3.org/2000/svg">
        <text textAnchor="middle" className="RegularText" x="10" y="18" fill={current ? 'white' : '#333333'}>
          {phaseNumber}
        </text>
        {result}
      </svg>
    )
  }

  render(): React.ReactNode {
    return (
      <>
        <svg viewBox="0 0 60 20" width="5%" xmlns="http://www.w3.org/2000/svg">
          <text textAnchor="middle" className="RegularText" x="25" y="18" fill="white">
            Turn:
          </text>
        </svg>
        <svg viewBox={`0 0 25 20`} width="5%" xmlns="http://www.w3.org/2000/svg">
          <text textAnchor="middle" className="RegularText" x="10" y="18" fill="white">
            {this.props.matchData.match.time.turn.number}
          </text>
        </svg>
        <svg viewBox="0 0 60 20" width="5%" xmlns="http://www.w3.org/2000/svg">
          <text textAnchor="middle" className="RegularText" x="25" y="18" fill="white">
            Phase:
          </text>
        </svg>
        {this.phaseBox({ phaseNumber: 1 })}
        {this.phaseBox({ phaseNumber: 2 })}
        {this.phaseBox({ phaseNumber: 3 })}
        {this.phaseBox({ phaseNumber: 4 })}
        {this.phaseBox({ phaseNumber: 5 })}
      </>
    )
  }
}

export default MoveOrder
