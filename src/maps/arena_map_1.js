import { FACE, INCH } from "../utils/constants";
import Rectangle from "../utils/Rectangle";
import Point from '../utils/Point';
import uuid from 'uuid/v4';


export const MAP_SIZE = { HEIGHT: 24 * INCH,
                          WIDTH:  24 * INCH };

const place = ({ x, y, facing, length, width }) => {
  return new Rectangle({ BR_point: new Point({ x: x, y: y }),
                         facing: facing,
                         length: length,
                         width: width });
}

export const StartingPositions = [
  /* NW corner */
  /*
  place({ x: 0,
          y: 1.75 * INCH,
          facing: FACE.EAST }),
*/
place({ x: 8 * INCH,
        y: 8 * INCH,
        facing: FACE.EAST }),

  /* NE corner */
/*
  place({ x: MAP_SIZE.WIDTH - 1.75 * INCH,
          y: 0,
          facing: FACE.SOUTH }),
*/

place({ x: 16 * INCH,
        y: 8 * INCH,
        facing: FACE.SOUTH }),
/*
place({ x: 16 * INCH,
        y: 7 * INCH,
        facing: FACE.WEST }),
        */
  /* SE corner */
  place({ x: 16 * INCH,
          y: 16 * INCH,
          facing: FACE.WEST }),
  /*
  place({ x: MAP_SIZE.WIDTH,
          y: MAP_SIZE.HEIGHT - 1.75 * INCH,
          facing: FACE.WEST }),
          */
  /* SW corner */
  place({ x: 8 * INCH,
          y: 16 * INCH,
          facing: FACE.NORTH }),
          /*
  place({ x: 1.75 * INCH,
          y: MAP_SIZE.HEIGHT,
          facing: FACE.NORTH }),
          */
];

export const WallData = [
  { /* TV tower */
    id: `wall-${uuid()}`,
    rect: place({
      x: 10.5 * INCH,
      y: 10.5 * INCH,
      facing: FACE.SOUTH,
      length: 3 * INCH,
      width: 3 * INCH,
    }),
  },
  { /* N side free wall */
    id: `wall-${uuid()}`,
    rect: place({
      x: 8 * INCH,
      y: 6 * INCH,
      facing: FACE.EAST,
      length: 6 * INCH,
      width: 1 * INCH,
    }),
  },
  { /* S side free wall */
    id: `wall-${uuid()}`,
    rect: place({
      x: 10 * INCH,
      y: 19 * INCH,
      facing: FACE.EAST,
      length: 6 * INCH,
      width: 1 * INCH,
    }),
  },
  { /* W side free wall */
    id: `wall-${uuid()}`,
    rect: place({
      x: 5 * INCH,
      y: 10 * INCH,
      facing: FACE.SOUTH,
      length: 6 * INCH,
      width: 1 * INCH,
    }),
  },
  { /* E side free wall */
    id: `wall-${uuid()}`,
    rect: place({
      x: 18 * INCH,
      y: 8 * INCH,
      facing: FACE.SOUTH,
      length: 6 * INCH,
      width: 1 * INCH,
    }),
  },
  { /* SW jut */
    id: `wall-${uuid()}`,
    rect: place({ x: 4 * INCH,
                      y: 23 * INCH,
                      facing: FACE.NORTH,
                      length: 4 * INCH,
                      width: 1 * INCH })
  },
  { /* NW jut */
    id: `wall-${uuid()}`,
    rect: place({ x: 1 * INCH,
                      y: 4 * INCH,
                      facing: FACE.EAST,
                      length: 4 * INCH,
                      width: 1 * INCH })
  },
  { /* NE jut */
    id: `wall-${uuid()}`,
    rect: place({ x: 20 * INCH,
                      y: 1 * INCH,
                      facing: FACE.SOUTH,
                      length: 4 * INCH,
                      width: 1 * INCH })
  },
  { /* SE jut */
    id: `wall-${uuid()}`,
    rect: place({ x: 23 * INCH,
                      y: 20 * INCH,
                      facing: FACE.WEST,
                      length: 4 * INCH,
                      width: 1 * INCH })
  },
  { /* N side */
    id: `wall-${uuid()}`,
    rect: place({ x: 0,
                      y: 1 * INCH,
                      facing: FACE.EAST,
                      length: MAP_SIZE.WIDTH - 2 * INCH,
                      width: 1 * INCH })
  },
  { /* S side */
    id: `wall-${uuid()}`,
    rect: place({ x: MAP_SIZE.WIDTH,
                      y: MAP_SIZE.HEIGHT - 1 * INCH,
                      facing: FACE.WEST,
                      length: MAP_SIZE.WIDTH -2 * INCH,
                      width: 1 * INCH })
  },
  { /* W side */
    id: `wall-${uuid()}`,
    rect: place({ x: 1 * INCH,
                      y: MAP_SIZE.HEIGHT,
                      facing: FACE.NORTH,
                      length: MAP_SIZE.HEIGHT -2 *INCH,
                      width: 1 * INCH })
  },
  { /* E side */
    id: `wall-${uuid()}`,
    rect: place({ x: MAP_SIZE.WIDTH - 1 * INCH,
                      y: 0,
                      facing: FACE.SOUTH,
                      length: MAP_SIZE.HEIGHT -2 * INCH,
                      width: 1 * INCH })
  },
]
