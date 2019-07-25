import React from 'react';
//import MapLine from './MapLine';
import { INCH } from '../utils/constants';
import { MAP_SIZE } from '../maps/arena_map_1';

const MapLine = ({x1, y1, x2, y2, line_width=1}) => {
  const style = {
    stroke: 'black',
    fill: 'none',
  };

  return (
      <line
        x1={ x1 }
        y1={ y1 }
        x2={ x2 }
        y2={ y2 }
        style={ style }
        strokeWidth={line_width}
      />
  );
};

const MapGrid = (width, height) => {
  const edge_length = INCH / 4;
  const fat_line_width = (INCH / 20 > 1) ? (INCH / 20) : 2;

  const GridLineWidth = (line_number) => {
    return (line_number % 4 === 0) ? fat_line_width : 1;
  }

  const GridHorizontal = (y, line_width=1) => {
    return (<MapLine key={`horiz${y}`} x1={0} y1={y} x2={MAP_SIZE.WIDTH} y2={y} line_width={line_width} />);
  }

  const GridVertical = (x, line_width=1) => {
    return (<MapLine key={`vert${x}`} x1={x} y1={0} x2={x} y2={MAP_SIZE.HEIGHT} line_width={line_width} />);
  }

  var result = [];
  for (var x = 0; x < width/edge_length; x++) {
    result.push(GridVertical(x * edge_length, GridLineWidth(x)));
  }
  for (var y = 0; y < height/edge_length; y++) {
    result.push(GridHorizontal(y * edge_length, GridLineWidth(y)));
  }
  return result;
}

const MapBackground = () => {
  return (
    <g id='grid'>
      { MapGrid(MAP_SIZE.WIDTH, MAP_SIZE.HEIGHT) }
    </g>
  );
};

export default MapBackground;
