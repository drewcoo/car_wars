import * as React from 'react'
import SVG from 'react-inlinesvg'

class WeaponsFire extends React.Component {
  render () {
    const duration = this.props.duration || 1
    const source = this.props.damage.source.point
    const target = this.props.damage.target.point
    const rotation = (Math.atan2((target.y - source.y), (target.x - source.x)) * 180 / Math.PI)

    const preProcess = (code) => {
      let result = code.replace(/ROTATION/g, `rotate(${rotation})`)
      result = result.replace(/DURATION/g, duration)
      result = result.replace(/SOURCE_X/g, source.x)
      result = result.replace(/SOURCE_Y/g, source.y)
      result = result.replace(/TARGET_X/g, target.x)
      result = result.replace(/TARGET_Y/g, target.y)
      return result
    }

    return (<SVG src={this.props.svgFile} preProcessor={ code => preProcess(code) }/>)
  }
}

export default WeaponsFire
