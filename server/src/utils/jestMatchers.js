import { degreesEqual as testDegrees } from './conversions'

expect.extend({
  degreesEqual(arg1, arg2) {
    return {
      message: () => `received: ${arg1}°; expected: ${arg2}° (difference: ${arg1 - arg2}°)`,
      // message: () => `received: ${arg1}; expected: ${arg2}`,
      pass: testDegrees(arg1, arg2),
    }
  },
  equalsPoint(p1, p2) {
    return {
      message: () => `received: ${p1}; expected: ${p2}`,
      pass: p1.equals(p2),
    }
  },
})
