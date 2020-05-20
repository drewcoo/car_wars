import _ from 'lodash'
import Point from '../Point'
import Rectangle from '../Rectangle'
import Segment from '../Segment'

class GeometryFactory {
  static point(x = _.random(-1000, 1000), y = _.random(-1000, 1000)) {
    return new Point({ x, y })
  }

  static segment(orientation = null) {
    const p1 = GeometryFactory.point()
    const p2 = GeometryFactory.point()
    switch (orientation) {
      case 'vertical':
        p2.x = p1.x
        break
      case 'horizontal':
        p2.y = p1.y
        break
      default:
        break
    }
    return new Segment([p1, p2])
  }

  static rectangle({ facing = _.random(0, 360) }) {
    // facing = COMPASS.NORTH }) {
    // facing = _.random(0, 360)) {
    return new Rectangle({
      facing: facing, // COMPASS.NORTH
      _brPoint: GeometryFactory.point(),
      length: 60,
      width: 30,
    })
  }
}
export default GeometryFactory
