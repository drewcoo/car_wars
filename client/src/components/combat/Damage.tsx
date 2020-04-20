import * as React from 'react'
import Point from '../../utils/geometry/Point'
import LocalMatchState from './lib/LocalMatchState'
import Reticle from './Reticle'

import MachineGun from './weaponsFire/MachineGun'
import HeavyRocket from './weaponsFire/HeavyRocket'
import RocketLauncher from './weaponsFire/RocketLauncher'
import Laser from './weaponsFire/Laser'

class Damage extends React.Component {
  props: any
  lms: any

  getCurrentDamage () {
    const car = new LocalMatchState(this.props.matchData).car({ id: this.props.carId })
    return car.phasing.damage
              .filter((damage: any) => damage.target != null)
              .map((damage: any) => this.drawWeaponFireAndDamage(damage))
  }

  drawWeaponFireAndDamage(damage: any) {
    // Maybe generate an UUID to pass to both of these so that drawDamage() will
    // know the id of the weaponsFire() animation and can cue itself to
    // show up after the weapon fires (once - not repeating, striking target)
    return (
      <>
        { this.weaponFire({ duration: .8, damage })}
        { this.drawDamage({
          point: damage.target.point,
          damage: damage.target.damage
        }) }
      </>
    )
  }

  weaponFire({ duration=1, damage }: { duration: number, damage: any}) {
    switch(damage.source.weapon) {
      case 'machineGun':
        return <MachineGun duration={duration} sourcePoint={damage.source.point} targetPoint={damage.target.point} />
      case 'heavyRocket':
        return <HeavyRocket duration={duration} sourcePoint={damage.source.point} targetPoint={damage.target.point} />
      case 'rocketLauncher':
        return <RocketLauncher duration={duration} sourcePoint={damage.source.point} targetPoint={damage.target.point} />
      case 'laser':
        return <Laser duration={duration} sourcePoint={damage.source.point} targetPoint={damage.target.point} />
      default:
        console.log(`Weapon not supported: \"${damage.source.weapon}\"; defaulting to MG`)
        return <MachineGun duration={duration} sourcePoint={damage.source.point} targetPoint={damage.target.point} />
    }
  }

  polylineStar({ x, y, pointCount, offset = 0, radiusMultiplier = 1 }:
    { x: number, y: number, pointCount: number, offset?: number, radiusMultiplier?: number }) {
    function inner(radians: number) {
      const radius = 10 + (Math.random() * 10)
      return `${x + radius * Math.cos(radians)},${y + radius * Math.sin(radians)} `
    }

    function outer(radians: number) {
      const radius = radiusMultiplier * (20 + (Math.random() * 20))
      return `${x + radius * Math.cos(radians)},${y + radius * Math.sin(radians)} `
    }

    var result = ''
    for (var i = 0; i < pointCount; i++) {
      var innerRads = 2 * Math.PI * (i / pointCount + offset)
      result += inner(innerRads)
      var outerRads = 2 * Math.PI * ((i + 0.5) / pointCount + offset)
      result += outer(outerRads)
    }
    result += inner(0)
    return result
  }

  stopSign({ x, y, radius, text0, text1 = '' }:
           { x: number, y: number, radius: number, text0: string, text1?: string}) {
    const stopSignTextStyle = {
      fill: 'white',
      stroke: 'none',
      fontSize: `${2 * radius / 3}px`, // '16px',
      fontFamily: 'fantasy',
      fontVariant: 'small-caps'
    }

    var points = ''
    var angle = 2 * Math.PI / 16
    for (var i = angle; i < 2 * Math.PI; i += 2 * angle) {
      points += `${x + radius * Math.cos(i)}, ${y + radius * Math.sin(i)} `
    }
    return (
      <g key={ `damage-${x}-${y}` } className={ 'StopSign' }>
        <polygon points={points}/>
        <text x ={ x } y={ y - radius / 5 } textAnchor={ 'middle' } style={ stopSignTextStyle }>{text0}</text>
        <text x ={ x } y={ y + 2 * radius / 5 } textAnchor={ 'middle' } style={ stopSignTextStyle }>{text1}</text>
      </g>
    )
  }

  drawDamage({ point, damage }: { point: Point, damage: number | string }) {
    const offset = 2 * Math.PI / 10
    if (damage === 0) {
      return (
        <g key={ `damage-${point.x}-${point.y}` } className={ 'MissedShot' } id='shotResult'>
          <circle key='aaaarqqqqq' cx={ point.x } cy={ point.y } strokeDasharray='2' r={ 18 } />
          <text key='aggggweeaa' x ={ point.x } y={ point.y + 6 } textAnchor={ 'middle' } className={ 'MissedShotText' }>miss</text>
        </g>
      )
    } else {
      return (
        <g key={ `damage-${point.x}-${point.y}` } className={ 'Damage' } id='shotResult'>
          <polyline points={ `${this.polylineStar({ x: point.x, y: point.y, pointCount: 10, offset: 0.3 * offset, radiusMultiplier: 1.4 })}`} fill={'yellow'} />
          <polyline points={ `${this.polylineStar({ x: point.x, y: point.y, pointCount: 8, offset: offset })}`} fill={'red'} />
          <polyline points={ `${this.polylineStar({ x: point.x, y: point.y, pointCount: 8, radiusMultiplier: 0.8 })}`} fill={'orange'} />
          <circle cx={ point.x } cy={ point.y } r={ 18 } fill={'white'} />
          <text x ={ point.x } y={ point.y + 8 } textAnchor={ 'middle' } className={ 'DamageText' }>{damage}</text>
        </g>
      )
    }
  }

  render() {
    const car = new LocalMatchState(this.props.matchData).car({ id: this.props.carId })
    return (
      <g>
      <Reticle client={this.props.client} matchData={ this.props.matchData } />
        { this.getCurrentDamage() }
      </g>
    )
  }
}

export default Damage
