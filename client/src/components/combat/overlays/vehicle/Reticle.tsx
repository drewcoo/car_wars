import * as React from 'react'
import { INCH } from '../../../../utils/constants'
import '../../../../App.css'
import LocalMatchState from '../../lib/LocalMatchState'

interface Props {
  carId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  matchData: any
}
class Reticle extends React.Component<Props> {
  drawReticle({ x, y, name = '' }: { x: number; y: number; name: string }): React.ReactNode {
    return (
      <g key={`target-${x}=${y}`} className="Reticle">
        <text className="ReticleText" x={x + 12} y={y - 12}>
          {name}
        </text>
        <circle id="reticle" cx={x} cy={y} r={12} />
        <circle cx={x} cy={y} r={7} />
        <circle cx={x} cy={y} r={2} />
        <line x1={x - 17} y1={y} x2={x + 17} y2={y} />
        <line x1={x} y1={y - 17} x2={x} y2={y + 17} />
      </g>
    )
  }

  draw(): React.ReactNode {
    const lms = new LocalMatchState(this.props.matchData)
    if (lms.time().phase.subphase !== '5_fire_weapons') return
    const car = lms.car({ id: this.props.carId })
    if (!car || !lms.canFire({ car })) {
      return
    }

    if (car.phasing.targets && car.phasing.targets[car.phasing.targetIndex]) {
      const target = car.phasing.targets[car.phasing.targetIndex]

      /// TODO: This for real instead of just show.
      // including things like not in target's firing arc, speed mods,
      // handling, sustained fire, etc.
      const prettyName = target.name.length === 2 ? ' tire' : ''
      let mod = target.name === 'F' || target.name === 'B' ? -1 : 0

      // BUGBUG: middle is wrong.
      //  var targetPoint = car.phasing.rect.side(target.name) instanceof Point ?
      //    car.phasing.rect.side(target.name).displayPoint :
      const currentWeaponLocation = car.design.components.weapons[car.phasing.weaponIndex].location

      const dist = car.phasing.rect.side(currentWeaponLocation).middle().distanceTo(target.displayPoint)
      mod += dist <= INCH ? 4 : -Math.floor(dist / (4 * INCH))

      // two-letter loc is a tire - doesn't take into account facing - FR always R
      if (target.name.length === 2) {
        mod -= 3
      }

      return this.drawReticle({
        x: target.displayPoint.x,
        y: target.displayPoint.y,
        name: `${mod > 0 ? '+' : ''}${mod}${prettyName}`,
      })
    }
  }

  render(): React.ReactNode {
    return <>{this.draw()}</>
  }
}

export default Reticle
