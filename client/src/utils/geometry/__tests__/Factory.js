import Point from '../Point'
import Segment from '../Segment'
import Rectangle from '../Rectangle'
import { COMPASS } from '../../constants'

class Factory {
  static RandomNumber(max = 1000) {
    return max * Math.random()
  }

  static Point(x = Factory.RandomNumber(), y = Factory.RandomNumber()) {
    return new Point({ x, y })
  }

  static Segment(orientation = null) {
    const p1 = Factory.Point()
    const p2 = Factory.Point()
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

  static Rectangle() {
    return new Rectangle({ facing: COMPASS.NORTH, brPoint: Factory.Point() })
  }
}
export default Factory
