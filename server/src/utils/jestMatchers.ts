import { degreesDifference, degreesEqual } from './conversions'
import Point from './geometry/Point'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      degreesEqual(arg2: number): R
      equalsPoint(point2: Point): boolean
    }
  }
}

expect.extend({
  degreesEqual(arg1, arg2) {
    return {
      message: () =>
        `received: ${arg1}°; expected: ${arg2}° (difference: ${degreesDifference({ initial: arg1, second: arg2 })}°)`,
      // message: () => `received: ${arg1}; expected: ${arg2}`,
      pass: degreesEqual(arg1, arg2),
    }
  },
  equalsPoint(p1, p2) {
    return {
      message: () => `received: ${p1}; expected: ${p2}`,
      pass: p1.equals(p2),
    }
  },
})
