import * as React from 'react'
import SVG from 'react-inlinesvg'
import Damage from '../../../../../types/Damage'
// import Sound from 'react-sound'

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

  durationFactor(): number {
    const base = 1
    switch (this.props.damage.source.weapon) {
      case 'heavyRocket':
        return 2 * base
      case 'rocketLauncher':
        return 1.5 * base
      default:
        return 1 * base
    }
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
        <SVG src={this.svgFile()} preProcessor={(code): string => preProcess(code)} />
      </>
    )
  }
}

export default WeaponsFire
