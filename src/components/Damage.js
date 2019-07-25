import React from 'react';
//import Car from './Car';
import { useSelector } from 'react-redux';
import Rectangle from '../utils/Rectangle';
import Segment from '../utils/Segment';
import Point from '../utils/Point';
//import { WallData } from '../maps/arena_map_1';
import { INCH } from '../utils/constants';

const Damage = () => {

  const players = useSelector((state) => state.players);
  const current_player = players.all[players.current_index];
  const cars = useSelector((state) => state.cars);
  const get_current_car = () => {
    const player_color = players.all[players.current_index].color;
    return cars.find(function(car) { return car.color === player_color});
  }

  const get_current_damage = () => {
    const car = get_current_car();
    if(car.phasing.damage_marker != null && car.phasing.damage_message != null) {
      return draw_damage({ point: car.phasing.damage_marker.display_point,
                           message: car.phasing.damage_message
                         });
    }
  }

  const damage_style = {
    stroke: 'red',
    strokeWidth: '2',
    fill: 'none',
    fontSize: '26px',
    fontFamily: 'fantasy',
    fontVariant: 'small-caps',
  };

  const damage_text = {
    fill: 'black',
    stroke: 'none',
    fontSize: '16px',//'26px',
    fontFamily: 'fantasy',
    fontVariant: 'small-caps',
  };

  const miss_text = {
    fill: 'red',
    stroke: 'none',
    fontSize: '16px',
    fontFamily: 'sans-serif',
  };

  const polyline_star = ({x, y, point_count, offset=0, radius_multiplier=1}) => {
    const inner = (radians) => {
      const radius = 10 + (Math.random() * 10) ;
      return `${x + radius*Math.cos(radians)},${y + radius*Math.sin(radians)} `;
    }

    const outer = (radians) => {
      const radius = radius_multiplier * (20 + (Math.random() * 20));
      return `${x + radius*Math.cos(radians)},${y + radius*Math.sin(radians)} `;
    }

    var result='';
    for(var i = 0; i < point_count; i++) {
      var inner_rads = 2*Math.PI * (i/point_count + offset);
      result += inner(inner_rads);
      var outer_rads = 2*Math.PI * ((i + .5 )/point_count + offset);
      result += outer(outer_rads)
    }
    result += inner(0);
    return result;
  }

  const stop_sign = ({x, y, radius, text0, text1=''}) => {
    const stop_sign_style = {
      fill: 'red',
      stroke: 'white',
    };
    const stop_sign_text_style = {
      fill: 'white',
      stroke: 'none',
      fontSize: `${2 * radius / 3}px`,   //'16px',
      fontFamily: 'fantasy',
      fontVariant: 'small-caps',
    }

    var points = '';
    var angle = 2 * Math.PI / 16;
    for (var i = angle; i < 2 * Math.PI; i += 2 * angle) {
      points += `${x + radius*Math.cos(i)}, ${y + radius*Math.sin(i)} `;
    }
    return (
      <g key={ `damage-${ x }-${ y }` } style={ stop_sign_style }>
        <polygon points={points}/>
        <text x ={ x } y={ y - radius / 5 } textAnchor={ 'middle' } style={ stop_sign_text_style }>{text0}</text>
        <text x ={ x } y={ y + 2 * radius / 5 } textAnchor={ 'middle' } style={ stop_sign_text_style }>{text1}</text>
      </g>
    );
  }


  const draw_damage = ({ point, message }) => {
    var offset = 2*Math.PI/10;
    if (message === 'empty') {
      var point = get_current_car().rect.center();
      return (
        stop_sign({ x: point.x, y: point.y, radius: 25, text0: 'no', text1: 'ammo' })
      );
    } else if (message === 0) {
      return (
        <g key={ `damage-${ point.x }-${ point.y }` } style={ damage_style }>
          <circle cx={ point.x } cy={ point.y } r={ 18 } fill={'white'} />
          <text x ={ point.x } y={ point.y +4 } textAnchor={ 'middle' } style={ miss_text }>miss</text>
        </g>
      );
    } else {
      return (
       <g key={ `damage-${ point.x }-${ point.y }` } style={ damage_style }>
          <polyline points={ `${polyline_star({x: point.x, y: point.y, point_count: 10, offset: .3*offset, radius_multiplier: 1.4 })}`} fill={'yellow'} />
          <polyline points={ `${polyline_star({x: point.x, y: point.y, point_count: 8, offset: offset})}`} fill={'red'} />
          <polyline points={ `${polyline_star({x: point.x, y: point.y, point_count: 8, radius_multiplier: .8})}`} fill={'orange'} />
          <circle cx={ point.x } cy={ point.y } r={ 18 } fill={'white'} />
          <text x ={ point.x } y={ point.y + 8 } textAnchor={ 'middle' } style={ damage_text }>{message}</text>
        </g>
      );
    }
  }

  return (
    <g>
      { get_current_damage() }
    </g>
  );
};

export default Damage;
