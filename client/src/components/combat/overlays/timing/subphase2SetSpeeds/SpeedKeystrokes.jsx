import * as React from 'react'
import { compose } from 'recompose'
import { HotKeys } from 'react-hotkeys'
import { graphql } from 'react-apollo'
import LocalMatchState from '../../../lib/LocalMatchState'
import ViewElement from '../../../lib/ViewElement'
import setSpeed from '../../../../graphql/mutations/setSpeed'
import acceptSpeed from '../../../../graphql/mutations/acceptSpeed'
import PropTypes from 'prop-types'

const SET_SPEED = graphql(setSpeed, { name: 'setSpeed' })
const ACCEPT_SPEED = graphql(acceptSpeed, { name: 'acceptSpeed' })

class SpeedKeystrokes extends React.Component {
  constructor(props) {
    super(props)
    this.state = { value: '' }
    this.keyMap = {
      acceptSpeed: ['enter'],
      bugMeNot: ['t'],
      home: '.',
      nextSpeed: ['s', 'up', 'shift+down', '+', '='],
      previousSpeed: ['shift+s', 'down', 'shift+up', '-', '_'],
      reset: ['esc', 'w'],
    }
  }

  async speedSetter({ id, speed }) {
    this.props.setSpeed({
      variables: { id: id, speed: parseInt(speed) },
    })
  }

  async speedAccepter({ id }) {
    this.props.acceptSpeed({ variables: { id } })
  }

  render() {
    const lms = new LocalMatchState(this.props.matchData)
    const car = lms.car({ id: this.props.carId })

    const handlers = {
      acceptSpeed: (event) => {
        this.props.handlers.accept(event)
      },
      bugMeNot: (event) => {
        this.props.handlers.bugMeNot(event)
      },
      home: (event) => {
        ViewElement(car.id)
      },
      nextSpeed: (event) => {
        if (car.status.speedSetThisTurn) { return (<></>) }
        this.speedSetter({
          id: car.id,
          speed: lms.nextSpeed({ id: car.id }),
        })
      },
      previousSpeed: (event) => {
        if (car.status.speedSetThisTurn) { return (<></>) }
        this.speedSetter({
          id: car.id,
          speed: lms.previousSpeed({ id: car.id }),
        })
      },
      reset: (event) => {
        this.speedSetter({
          id: car.id,
          speed: car.status.speed,
        })
      },
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

SpeedKeystrokes.propTypes = {
  acceptSpeed: PropTypes.func,
  carId: PropTypes.string,
  handlers: PropTypes.object,
  matchData: PropTypes.object,
  setSpeed: PropTypes.func,
}

export default compose(
  SET_SPEED,
  ACCEPT_SPEED
)(SpeedKeystrokes)
