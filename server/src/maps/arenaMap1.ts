import { COMPASS, INCH } from '../utils/constants'
import Rectangle from '../utils/geometry/Rectangle'
import Point from '../utils/geometry/Point'
import { v4 as uuid } from 'uuid'

const wallRect = ({ x, y, facing, length, width = INCH / 4 }: { x: number, y: number, facing: number, length?: number, width?: number }) => {
  return new Rectangle({
    _brPoint: new Point({ x: x, y: y }),
    facing: facing,
    length: length,
    width: width,
  })
}

const startingPosition = ({ x, y, facing }: { x: number, y: number, facing: number }) => {
  return new Rectangle({
    _brPoint: new Point({ x: x, y: y }),
    facing: facing,
  })
}

const MAP = {
  HEIGHT: 24 * INCH,
  WIDTH: 24 * INCH,
}

const Map = {
  id: 'none',
  name: 'arenaMap1',
  size: {
    height: MAP.HEIGHT,
    width: MAP.WIDTH,
  },
  startingPositions: [
    /* NW corner */
    /*
    startingPosition({
      x: 0,
      y: 1 * INCH,
      facing: COMPASS.EAST
    }),
    */
    startingPosition({
      x: 8 * INCH,
      y: 8 * INCH,
      facing: COMPASS.EAST,
    }),
    /* NE corner */
    /*
    startingPosition({
      x: MAP.WIDTH - 1 * INCH,
      y: 0,
      facing: COMPASS.SOUTH
    }),
    */
    startingPosition({
      x: 16 * INCH,
      y: 8 * INCH,
      facing: COMPASS.SOUTH,
    }),
    /* SE corner */
    /*
    startingPosition({
      x: MAP.WIDTH,
      y: MAP.HEIGHT - 1 * INCH,
      facing: COMPASS.WEST
    }),
    */
    startingPosition({
      x: 16 * INCH,
      y: 16 * INCH,
      facing: COMPASS.WEST,
    }),
    /* SW corner */
    /*
    startingPosition({
      x: 1 * INCH,
      y: MAP.HEIGHT,
      facing: COMPASS.NORTH
    }),
    */
    startingPosition({
      x: 8 * INCH,
      y: 16 * INCH,
      facing: COMPASS.NORTH,
    }),
  ],
  wallData: [
    {
      /* W inner wall */ id: `wall-${uuid()}`,
      rect: wallRect({
        facing: COMPASS.SOUTH,
        length: 3 * INCH,
        width: (1 / 4) * INCH,
        x: 10.25 * INCH,
        y: 10.5 * INCH,
      }),
    },
    {
      /* N inner wall */ id: `wall-${uuid()}`,
      rect: wallRect({
        facing: COMPASS.EAST,
        length: 3.5 * INCH,
        width: (1 / 4) * INCH,
        x: 10.25 * INCH,
        y: 10.5 * INCH,
      }),
    },
    {
      /* E inner wall */ id: `wall-${uuid()}`,
      rect: wallRect({
        facing: COMPASS.SOUTH,
        length: 3 * INCH,
        width: (1 / 4) * INCH,
        x: 13.5 * INCH,
        y: 10.5 * INCH,
      }),
    },
    {
      /* S inner wall */ id: `wall-${uuid()}`,
      rect: wallRect({
        facing: COMPASS.EAST,
        length: 3.5 * INCH,
        width: (1 / 4) * INCH,
        x: 10.25 * INCH,
        y: 13.75 * INCH,
      }),
    },
    {
      /* TV tower */ id: `wall-${uuid()}`,
      rect: wallRect({
        facing: COMPASS.SOUTH,
        length: 2 * INCH,
        width: 2 * INCH,
        x: 11 * INCH,
        y: 11 * INCH,
      }),
    },
    {
      /* N side free wall */ id: `wall-${uuid()}`,
      rect: wallRect({
        facing: COMPASS.EAST,
        length: 6 * INCH,
        x: 8 * INCH,
        y: 6 * INCH,
      }),
    },
    {
      /* S side free wall */ id: `wall-${uuid()}`,
      rect: wallRect({
        facing: COMPASS.EAST,
        length: 6 * INCH,
        x: 10 * INCH,
        y: 19 * INCH,
      }),
    },
    {
      /* W side free wall */ id: `wall-${uuid()}`,
      rect: wallRect({
        facing: COMPASS.SOUTH,
        length: 6 * INCH,
        x: 5 * INCH,
        y: 10 * INCH,
      }),
    },
    {
      /* E side free wall */ id: `wall-${uuid()}`,
      rect: wallRect({
        facing: COMPASS.SOUTH,
        length: 6 * INCH,
        x: 18 * INCH,
        y: 8 * INCH,
      }),
    },
    {
      /* SW jut */ id: `wall-${uuid()}`,
      rect: wallRect({
        facing: COMPASS.NORTH,
        length: 5.75 * INCH,
        x: 3 * INCH,
        y: 23.75 * INCH,
      }),
    },
    {
      /* NW jut */ id: `wall-${uuid()}`,
      rect: wallRect({
        facing: COMPASS.EAST,
        length: 5.75 * INCH,
        x: (1 / 4) * INCH,
        y: 3 * INCH,
      }),
    },
    {
      /* NE jut */ id: `wall-${uuid()}`,
      rect: wallRect({
        facing: COMPASS.SOUTH,
        length: 5.75 * INCH,
        x: 21 * INCH,
        y: (1 / 4) * INCH,
      }),
    },
    {
      /* SE jut */ id: `wall-${uuid()}`,
      rect: wallRect({
        facing: COMPASS.WEST,
        length: 5.75 * INCH,
        x: 23.75 * INCH,
        y: 21 * INCH,
      }),
    },
    {
      /* N side */ id: `wall-${uuid()}`,
      rect: wallRect({
        facing: COMPASS.EAST,
        length: MAP.WIDTH - 1.25 * INCH,
        x: 0,
        y: (1 / 4) * INCH,
      }),
    },
    {
      /* S side */ id: `wall-${uuid()}`,
      rect: wallRect({
        facing: COMPASS.WEST,
        length: MAP.WIDTH - 1.25 * INCH,
        x: MAP.WIDTH,
        y: MAP.HEIGHT - (1 / 4) * INCH,
      }),
    },
    {
      /* W side */ id: `wall-${uuid()}`,
      rect: wallRect({
        facing: COMPASS.NORTH,
        length: MAP.HEIGHT - 1.25 * INCH,
        x: (1 / 4) * INCH,
        y: MAP.HEIGHT,
      }),
    },
    {
      /* E side */ id: `wall-${uuid()}`,
      rect: wallRect({
        facing: COMPASS.SOUTH,
        length: MAP.HEIGHT - 1.25 * INCH,
        x: MAP.WIDTH - (1 / 4) * INCH,
        y: 0,
      }),
    },
  ],
}

export default Map
