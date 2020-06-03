import * as React from 'react'
import SVG from 'react-inlinesvg'
import Damage from '../../../../../types/Damage'
// import Sound from 'react-sound'
import Point from '../../../../../utils/geometry/Point'

interface Props {
  damage: Damage
}

class WeaponsFire extends React.Component<Props> {
  sounds(): React.ReactNode {
    return <></>
    /*
    return(
      <Sound
      url="/audio/MG.mp3"
      playStatus={Sound.status.PLAYING}
      loop={true}/>
    )
    */
  }

  svgFile(): string {
    switch (this.props.damage.source.weapon) {
      case 'machineGun':
        return '/img/weaponsFire/MG.svg'
      case 'heavyRocket':
        return '/img/weaponsFire/HR.svg'
      case 'rocketLauncher':
        return '/img/weaponsFire/RL.svg'
      case 'laser':
        return '/img/weaponsFire/L.svg'
      default:
        console.log(`Weapon not supported: "${this.props.damage.source.weapon}"; defaulting to MG`)
        return '/img/weaponsFire/MG.svg'
    }
  }

  durationFactor(): number {
    const srcPoint = new Point(this.props.damage.source.point)
    const tgtPoint = new Point(this.props.damage.target.point)
    const distance = srcPoint.distanceTo(tgtPoint)
    switch (this.props.damage.source.weapon) {
      case 'heavyRocket':
        return 0.004 * distance
      case 'laser':
        return 0.006 * distance
      case 'machineGun':
        return 0.002 * distance
      case 'rocketLauncher':
        return 0.006 * distance
      default:
        return 0.004 * distance
    }
  }

  render(): React.ReactNode {
    const source = this.props.damage.source.point
    const target = this.props.damage.target.point
    const rotation = (Math.atan2(target.y - source.y, target.x - source.x) * 180) / Math.PI
    const preProcess = (code: string): string => {
      let result = code.replace(/ROTATION/g, `rotate(${rotation})`)
      result = result.replace(/SOURCE_X/g, `${source.x}`)
      result = result.replace(/SOURCE_Y/g, `${source.y}`)
      result = result.replace(/TARGET_X/g, `${target.x}`)
      result = result.replace(/TARGET_Y/g, `${target.y}`)
      result = result.replace(/DURATION/g, `${this.durationFactor()}`)
      return result
    }

    return (
      <>
        {this.sounds()}
        <SVG src={this.svgFile()} duration={this.durationFactor()} preProcessor={(code): string => preProcess(code)} />
      </>
    )
  }
}

export default WeaponsFire
