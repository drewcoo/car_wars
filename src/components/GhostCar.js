import React from 'react';
import Car from './Car';
import { useSelector } from 'react-redux';
import FiringArc from './FiringArc';

const GhostCar = () => {
  const players = useSelector((state) => state.players);

  const current_player = players.all[players.current_index];

  const cars = useSelector((state) => state.cars);

  const get_current_car = () => {
    const player_color = players.all[players.current_index].color;
    return cars.find(function(car) { return car.color === player_color});
  }

  return (
    <g>
      <FiringArc />
      <Car id='ghost' key='ghost' state={ get_current_car() } ghost={ true } />
    </g>
  );
};

export default GhostCar;
