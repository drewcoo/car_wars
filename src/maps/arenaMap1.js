import { COMPASS, INCH } from '../utils/constants'
import Rectangle from '../utils/Rectangle'
import Point from '../utils/Point'
import uuid from 'uuid/v4'

const wallRect = ({ x, y, facing, length, width }) => {
  return new Rectangle({
    brPoint: new Point({ x: x, y: y }),
    facing: facing,
    length: length,
    width: width
  })
}

const MAP = {
  HEIGHT: 24 * INCH,
  WIDTH: 24 * INCH
}

export const Map = {
  name: 'arenaMap1',
  size: {
    height: MAP.HEIGHT,
    width: MAP.WIDTH
  },
  startingPositions: [
    /* NW corner */
    /*
    wallRect({
      x: 0,
      y: 1.75 * INCH,
      facing: COMPASS.EAST
    }),
    */
    wallRect({
      x: 8 * INCH,
      y: 8 * INCH,
      facing: COMPASS.EAST
    }),

    /* NE corner */
    /*
    wallRect({
      x: MAP.WIDTH - 1.75 * INCH,
      y: 0,
      facing: COMPASS.SOUTH
    }),
    */
    wallRect({
      x: 16 * INCH,
      y: 8 * INCH,
      facing: COMPASS.SOUTH
    }),

    /* SE corner */
    /*
    wallRect({
      x: MAP.WIDTH,
      y: MAP.HEIGHT - 1.75 * INCH,
      facing: COMPASS.WEST
    }),
    */
    wallRect({
      x: 16 * INCH,
      y: 16 * INCH,
      facing: COMPASS.WEST
    }),

    /* SW corner */
    /*
    wallRect({
      x: 1.75 * INCH,
      y: MAP.HEIGHT,
      facing: COMPASS.NORTH
    }),
    */
    wallRect({
      x: 8 * INCH,
      y: 16 * INCH,
      facing: COMPASS.NORTH
    })
  ],
  wallData: [
    { /* TV tower */
      id: `wall-${uuid()}`,
      rect: wallRect({
        facing: COMPASS.SOUTH,
        length: 3 * INCH,
        width: 3 * INCH,
        x: 10.5 * INCH,
        y: 10.5 * INCH
      })
    },
    { /* N side free wall */
      id: `wall-${uuid()}`,
      rect: wallRect({
        facing: COMPASS.EAST,
        length: 6 * INCH,
        width: 1 * INCH,
        x: 8 * INCH,
        y: 6 * INCH
      })
    },
    { /* S side free wall */
      id: `wall-${uuid()}`,
      rect: wallRect({
        facing: COMPASS.EAST,
        length: 6 * INCH,
        width: 1 * INCH,
        x: 10 * INCH,
        y: 19 * INCH
      })
    },
    { /* W side free wall */
      id: `wall-${uuid()}`,
      rect: wallRect({
        facing: COMPASS.SOUTH,
        length: 6 * INCH,
        width: 1 * INCH,
        x: 5 * INCH,
        y: 10 * INCH
      })
    },
    { /* E side free wall */
      id: `wall-${uuid()}`,
      rect: wallRect({
        facing: COMPASS.SOUTH,
        length: 6 * INCH,
        width: 1 * INCH,
        x: 18 * INCH,
        y: 8 * INCH
      })
    },
    { /* SW jut */
      id: `wall-${uuid()}`,
      rect: wallRect({
        facing: COMPASS.NORTH,
        length: 4 * INCH,
        width: 1 * INCH,
        x: 4 * INCH,
        y: 23 * INCH
      })
    },
    { /* NW jut */
      id: `wall-${uuid()}`,
      rect: wallRect({
        facing: COMPASS.EAST,
        length: 4 * INCH,
        width: 1 * INCH,
        x: 1 * INCH,
        y: 4 * INCH
      })
    },
    { /* NE jut */
      id: `wall-${uuid()}`,
      rect: wallRect({
        facing: COMPASS.SOUTH,
        length: 4 * INCH,
        width: 1 * INCH,
        x: 20 * INCH,
        y: 1 * INCH
      })
    },
    { /* SE jut */
      id: `wall-${uuid()}`,
      rect: wallRect({
        facing: COMPASS.WEST,
        length: 4 * INCH,
        width: 1 * INCH,
        x: 23 * INCH,
        y: 20 * INCH
      })
    },
    { /* N side */
      id: `wall-${uuid()}`,
      rect: wallRect({
        facing: COMPASS.EAST,
        length: MAP.WIDTH - 2 * INCH,
        width: 1 * INCH,
        x: 0,
        y: 1 * INCH
      })
    },
    { /* S side */
      id: `wall-${uuid()}`,
      rect: wallRect({
        facing: COMPASS.WEST,
        length: MAP.WIDTH - 2 * INCH,
        width: 1 * INCH,
        x: MAP.WIDTH,
        y: MAP.HEIGHT - 1 * INCH
      })
    },
    { /* W side */
      id: `wall-${uuid()}`,
      rect: wallRect({
        facing: COMPASS.NORTH,
        length: MAP.HEIGHT - 2 * INCH,
        width: 1 * INCH,
        x: 1 * INCH,
        y: MAP.HEIGHT
      })
    },
    { /* E side */
      id: `wall-${uuid()}`,
      rect: wallRect({
        facing: COMPASS.SOUTH,
        length: MAP.HEIGHT - 2 * INCH,
        width: 1 * INCH,
        x: MAP.WIDTH - 1 * INCH,
        y: 0
      })
    }
  ]
}
