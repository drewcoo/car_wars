import * as React from 'react'
import { HotKeys } from 'react-hotkeys'

class CarKeystrokes extends React.Component {
  constructor(props) {
    super(props)
    this.state = { value: '' }
    this.keyMap = {
      close: ['enter', 'esc'],
      switchUp: ['space'],
      switchDown: ['space'],
    }
  }

  render() {
    const handlers = {
      close: (event) => {
        this.props.handlers.close(event)
      },
      switchUp: (event) => {
        this.props.handlers.switchUp(event)
        event.stopPropagation()
      },
      switchDown: (event) => {
        this.props.handlers.switchDown(event)
        event.stopPropagation()
      },
    }

    return (
      <HotKeys
        attach={document}
        focused={true}
        handlers={handlers}
        keyMap={this.keyMap}
      />
    )
  }
}

export default CarKeystrokes
