import * as React from 'react'
import SVG from 'react-inlinesvg'
// import Sound from 'react-sound'

interface Props {
  duration: number
  damage: any
  svgFile: string
}

class WeaponsFire extends React.Component<Props> {
  sounds() {
    return (<></>)
    /*
    return(
      <Sound
      url="/audio/MG.mp3"
      playStatus={Sound.status.PLAYING}
      loop={true}/>
    )
    */
  }

  render() {
    const duration = this.props.duration || 1
    const source = this.props.damage.source.point
    const target = this.props.damage.target.point
    const rotation = (Math.atan2((target.y - source.y), (target.x - source.x)) * 180 / Math.PI)

    const preProcess = (code: any) => {
      let result = code.replace(/ROTATION/g, `rotate(${rotation})`)
      result = result.replace(/DURATION/g, duration)
      result = result.replace(/SOURCE_X/g, source.x)
      result = result.replace(/SOURCE_Y/g, source.y)
      result = result.replace(/TARGET_X/g, target.x)
      result = result.replace(/TARGET_Y/g, target.y)
      return result
    }

    return (
      <>
      { this.sounds() }
      <SVG src={this.props.svgFile} preProcessor={ code => preProcess(code) }/>
      </>
    )
  }
}

export default WeaponsFire
