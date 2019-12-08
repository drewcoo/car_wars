import React from 'react'
// import Car from './Car';
import { useSelector } from 'react-redux'
import Rectangle from '../utils/Rectangle'
import Segment from '../utils/Segment'
import Point from '../utils/Point'
// import { WallData } from '../maps/arena_map_1';
import { FACE, INCH } from '../utils/constants'

const Reticle = ({ color = 'red', x = 160, y = 160 }) => {
  const players = useSelector((state) => state.players)
  const current_player = players.all[players.current_index]
  const cars = useSelector((state) => state.cars)
  const get_current_car = () => {
    const player_color = players.all[players.current_index].color
    return cars.find(function (car) { return car.color === player_color })
  }

  const get_current_target = () => {
    const car = get_current_car()

    if (car.phasing.damage_marker != null && car.phasing.damage_message != null) {
      return
    }

    if (car.phasing.targets && car.phasing.targets[car.phasing.target_index]) {
      var target = car.phasing.targets[car.phasing.target_index]

      /// TODO: This for real instead of just show.
      // including things like not in target's firing arc, speed mods,
      // handling, sustained fire, etc.
      console.log('car.phasing.targets[car.phasing.target_index]')
      console.log(car.phasing.targets[car.phasing.target_index])
      var pretty_name = (target.name.length === 2) ? ' tire' : ''

      var mod = (target.name === 'F' || target.name === 'B') ? -1 : 0

      // BUGBUG: middle is wrong.
      //  var target_point = car.phasing.rect.side(target.name) instanceof Point ?
      //    car.phasing.rect.side(target.name).display_point :
      console.log('spew')
      console.log(car.phasing.weapon_index)
      console.log(car.design.components.weapons[car.phasing.weapon_index])
      console.log(car.design.components.weapons[car.phasing.weapon_index].location)
      var current_weapon_location = car.design.components.weapons[car.phasing.weapon_index].location

      var dist = car.phasing.rect.side(current_weapon_location).middle().distance_to(target.display_point)
      if (dist <= INCH) {
        mod += 4
      } else {
        mod -= Math.floor(dist / (4 * INCH))
      }

      // two-letter loc is a tire - doesn't take into account facing - FR always R
      if (target.name.length === 2) { mod -= 3 }

      return draw_reticle({
        x: target.display_point.x,
        y: target.display_point.y,
        // name: `${target.car_id} ${target.name}`,
        name: `${mod > 0 ? '+' : ''}${mod}${pretty_name}`
      })
    }
  }

  const reticle_style = {
    stroke: 'red',
    strokeWidth: '2',
    fill: 'none',
    fontSize: '26px',
    fontFamily: 'fantasy',
    fontVariant: 'small-caps'
  }

  const reticle_text = {
    fill: 'red',
    stroke: 'none',
    fontSize: '26px',
    fontFamily: 'fantasy',
    fontVariant: 'small-caps'
  }

  const draw_reticle = ({ x, y, name = '' }) => {
    console.log(`X: ${x}, Y: ${y}, Name: ${name}`)
    return (
      <g key={ `target-${x}=${y}` } style={ reticle_style }>
        <text x ={ x + 12 } y={ y - 12 } style={ reticle_text }>{name}</text>
        <circle cx={ x } cy={ y } r={ 12 } />
        <circle cx={ x } cy={ y } r={ 7 } />
        <circle cx={ x } cy={ y } r={ 2 } />
        <line x1={ x - 17 } y1={ y } x2={ x + 17 } y2={ y } />
        <line x1={ x } y1={ y - 17 } x2={ x } y2={ y + 17 } />
      </g>
    )
  }

  return (
    <g>
      { get_current_target() }
    </g>
  )
}

export default Reticle
