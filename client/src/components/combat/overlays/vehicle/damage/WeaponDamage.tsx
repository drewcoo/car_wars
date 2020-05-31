import * as React from 'react'
import Damage from '../../../../../types/Damage'
import WeaponsFire from './WeaponsFire'
import Splat from './Splat'
import Whoosh from './Whoosh'
// import Sound from 'react-sound'

interface Props {
  damage: Damage
}

class WeaponDamage extends React.Component<Props> {
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

  damageOrMiss(): React.ReactNode {
    if (this.props.damage.target.damage === 0) {
      return <Whoosh damage={this.props.damage} followWeapon={this.props.damage.source.weapon} />
    } else {
      return <Splat damage={this.props.damage} followWeapon={this.props.damage.source.weapon} />
    }
  }

  render(): React.ReactNode {
    return (
      <>
        {this.sounds()}
        <WeaponsFire damage={this.props.damage} />
        {this.damageOrMiss()}
      </>
    )
  }
}

export default WeaponDamage
