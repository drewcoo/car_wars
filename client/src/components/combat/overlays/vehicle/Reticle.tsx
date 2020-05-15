import * as React from 'react'
import { INCH } from '../../../../utils/constants'
import '../../../../App.css'
import LocalMatchState from '../../lib/LocalMatchState'

class Reticle extends React.Component {
  lms: any
  props: any
  drawReticle = ({ x, y, name = '' }: { x: number, y: number, name: string}) => {
    return (
      <g key={ `target-${x}=${y}` } className='Reticle'>
        <text className='ReticleText' x ={ x + 12 } y={ y - 12 }>{ name }</text>
        <circle id='reticle' cx={ x } cy={ y } r={ 12 } />
        <circle cx={ x } cy={ y } r={ 7 } />
        <circle cx={ x } cy={ y } r={ 2 } />
        <line x1={ x - 17 } y1={ y } x2={ x + 17 } y2={ y } />
        <line x1={ x } y1={ y - 17 } x2={ x } y2={ y + 17 } />
      </g>
    )
  }

  weaponCanFire({ car }: {car: any}) {
    const weapon = car.design.components.weapons[car.phasing.weaponIndex]
    const crewMember = car.design.components.crew.find((member: any) => member.role === 'driver')
    const plantDisabled = car.design.components.powerPlant.damagePoints < 1

    let result = !(
      weapon.location === 'none' ||
      weapon.ammo === 0 ||
      weapon.damagePoints === 0 ||
      weapon.firedThisTurn ||
      (weapon.requiresPlant && plantDisabled)
    )

    result = result && !(
      crewMember.firedThisTurn ||
      crewMember.damagePoints < 1
    )
    return result
  }

  draw() {
    console.log(this.props.carId)
    console.log(this.props.matchData)
    const lms = new LocalMatchState(this.props.matchData)
    const car = lms.car({ id: this.props.carId })
    if (!car || !this.weaponCanFire({ car })) { return }

    if (car.phasing.targets && car.phasing.targets[car.phasing.targetIndex]) {
      var target = car.phasing.targets[car.phasing.targetIndex]

      /// TODO: This for real instead of just show.
      // including things like not in target's firing arc, speed mods,
      // handling, sustained fire, etc.
      var prettyName = (target.name.length === 2) ? ' tire' : ''
      var mod = (target.name === 'F' || target.name === 'B') ? -1 : 0

      // BUGBUG: middle is wrong.
      //  var targetPoint = car.phasing.rect.side(target.name) instanceof Point ?
      //    car.phasing.rect.side(target.name).displayPoint :
      var currentWeaponLocation = car.design.components.weapons[car.phasing.weaponIndex].location

      var dist = car.phasing.rect.side(currentWeaponLocation).middle().distanceTo(target.displayPoint)
      mod += (dist <= INCH) ? 4 : -Math.floor(dist / (4 * INCH))

      // two-letter loc is a tire - doesn't take into account facing - FR always R
      if (target.name.length === 2) { mod -= 3 }

      return this.drawReticle({
        x: target.displayPoint.x,
        y: target.displayPoint.y,
        name: `${mod > 0 ? '+' : ''}${mod}${prettyName}`,
      })
    }
  }

  render() {
    console.log('reticle')

    if (this.props.matchData.match.time.phase.subphase !== '4_fire_weapons') {
      return (<></>)
    }

    return (
      <>
        { this.draw() }
      </>
    )
  }
}

export default Reticle
