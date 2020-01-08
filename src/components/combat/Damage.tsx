import * as React from 'react'
import { connect } from "react-redux"
import Point from '../../utils/geometry/Point'
import MatchWrapper from '../../utils/wrappers/MatchWrapper'

const mapStateToProps = (state: any) => {
  return({ matches: state.matches })
}

class Damage extends React.Component {
  props: any
  // props.matchId

  getCurrentDamage () {
    const match = new MatchWrapper(this.props.matches[this.props.matchId])
    const car = match.currentCar()
    if (car.phasing.damageMarker != null && car.phasing.damageMessage != null) {
      return this.drawDamage({
        point: car.phasing.damageMarker.displayPoint,
        message: car.phasing.damageMessage
      })
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

  drawDamage({ point, message }: { point: Point, message: number | string }) {
    var offset = 2 * Math.PI / 10
    if (message === 'empty') {
      const match = new MatchWrapper(this.props.matches[this.props.matchId])
      point = match.currentCar().rect.center()
      return (
        this.stopSign({ x: point.x, y: point.y, radius: 25, text0: 'no', text1: 'ammo' })
      )
    } else if (message === 0) {
      // Damage
      return (
        <g key={ `damage-${point.x}-${point.y}` } className={ 'MissedShot' } id='shotResult'>
          <circle cx={ point.x } cy={ point.y } r={ 18 } />
          <text x ={ point.x } y={ point.y + 6 } textAnchor={ 'middle' } className={ 'MissedShotText' }>miss</text>
        </g>
      )
    } else {
      return (
        <g key={ `damage-${point.x}-${point.y}` } className={ 'Damage' } id='shotResult'>
          <polyline points={ `${this.polylineStar({ x: point.x, y: point.y, pointCount: 10, offset: 0.3 * offset, radiusMultiplier: 1.4 })}`} fill={'yellow'} />
          <polyline points={ `${this.polylineStar({ x: point.x, y: point.y, pointCount: 8, offset: offset })}`} fill={'red'} />
          <polyline points={ `${this.polylineStar({ x: point.x, y: point.y, pointCount: 8, radiusMultiplier: 0.8 })}`} fill={'orange'} />
          <circle cx={ point.x } cy={ point.y } r={ 18 } fill={'white'} />
          <text x ={ point.x } y={ point.y + 8 } textAnchor={ 'middle' } className={ 'DamageText' }>{message}</text>
        </g>
      )
    }
  }

  render() {
    return (
      <g>
        { this.getCurrentDamage() }
      </g>
    )
  }
}

export default connect(mapStateToProps)(Damage)
