import * as React from 'react'
import { compose } from 'recompose'
import { HotKeys } from 'react-hotkeys'
import { graphql } from 'react-apollo'
import LocalMatchState from '../../lib/LocalMatchState'
import setSpeed from '../../../graphql/mutations/setSpeed'
import acceptSpeed from '../../../graphql/mutations/acceptSpeed'

const SET_SPEED = graphql(setSpeed, { name: 'setSpeed' })
const ACCEPT_SPEED = graphql(acceptSpeed, { name: 'acceptSpeed' })

class SpeedKeystrokes extends React.Component {
  constructor (props) {
    super(props)
    this.state = { value: '' }
    this.keyMap = {
      acceptSpeed: 'enter',
      bugMeNot: ['n'],
      nextSpeed: ['s', 'up', 'shift+down', '+', '='],
      previousSpeed: ['shift+s', 'down', 'shift+up', '-', '_']
    }
  }

  async speedSetter ({ id, speed }) {
    this.props.setSpeed({
      variables: { id: id, speed: parseInt(speed) }
    })
  }

  async speedAccepter ({ id }) {
    this.props.acceptSpeed({ variables: { id } })
  }

  render () {
    const lms = new LocalMatchState(this.props.matchData)
    const car = lms.car({ id: this.props.carId })

    const handlers = {
      acceptSpeed: (event) => {
        this.speedAccepter({ id: car.id })
      },
      bugMeNot: (event) => {
        this.speedAccepter({ id: car.id, bugMeNot: true })
      },
      nextSpeed: (event) => {
        if (car.status.speedChangedThisTurn) { return (<></>) }
        this.speedSetter({
          id: car.id,
          speed: lms.nextSpeed({ id: car.id })
        })
      },
      previousSpeed: (event) => {
        if (car.status.speedChangedThisTurn) { return (<></>) }
        this.speedSetter({
          id: car.id,
          speed: lms.previousSpeed({ id: car.id })
        })
      }
    }

    return (
      <HotKeys
        attach={ document }
        focused={ true }
        handlers={ handlers }
        keyMap={ this.keyMap } />
    )
  }
}

export default compose(
  SET_SPEED,
  ACCEPT_SPEED
)(SpeedKeystrokes)
