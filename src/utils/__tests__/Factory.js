import Point from '../../utils/Point'
import Segment from '../../utils/Segment'
import Rectangle from '../../utils/Rectangle'
import { COMPASS, FACE, INCH } from '../../utils/constants'

class Factory {
  static RandomNumber (max = 1000) {
    return max * Math.random()
  }

  static Point (x = Factory.RandomNumber(), y = Factory.RandomNumber()) {
    return new Point({ x, y })
  }

  static Segment (orientation = null) {
    var p1 = Factory.Point()
    var p2 = Factory.Point()
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

  static Rectangle () {
    return new Rectangle({ facing: COMPASS.NORTH, BR_point: Factory.Point() })
  }
}
export default Factory
