import React from 'react';
import { useSelector } from 'react-redux';

const CarInset = () => {
  const players = useSelector((state) => state.players);
  const current_player = players.all[players.current_index];

 //WORKS!!
  const cars = useSelector((state) => state.cars);
  var car = cars.find(function(element) {
    return element.color === current_player.color;
  });

  const warn_style = {
    color: 'yellow',
    visibility: (car.phasing.difficulty === 0) ? 'hidden' : 'visible',
  };

  return (
    <div>
      <span>{car.design.attributes.size}</span><br/>
      <span>{car.design.attributes.chassis} chassis</span><br/>
      <span>{car.design.attributes.suspension} suspension</span><br/>
      <span>${car.design.attributes.cost}</span><br/>
      <span>{car.design.attributes.weight} lbs</span><br/><br/>
      <span>top speed: {car.design.attributes.top_speed}</span><br/>
      <span>acc: {car.design.attributes.acceleration}</span><br/>
      <span>hc: {car.design.attributes.handling_class}</span><br/><br/>
      <span>handling: {car.status.handling}</span><br/>
      <span style={warn_style}>D{car.phasing.difficulty} maneuver</span><br/><br/>
      <span>SPEED: {car.status.speed}</span>
    </div>
  );
};

export default CarInset;
