import * as React from 'react'
import Damage from '../../../../../types/Damage'
import Splat from './Splat'
// import Sound from 'react-sound'

interface Props {
  damage: Damage
}

class TireDamage extends React.Component<Props> {
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

  drawDamage(): React.ReactNode {
    if (this.props.damage.target.damage === 0) {
      return <></>
    } else {
      return <Splat damage={this.props.damage} />
    }
  }

  render(): React.ReactNode {
    return (
      <>
        {this.sounds()}
        {this.drawDamage()}
      </>
    )
  }
}

export default TireDamage
