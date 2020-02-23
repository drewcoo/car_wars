import Point from '../Point'
import { COMPASS } from '../../constants'
import { degreesEqual } from '../../conversions'
import Factory from './Factory'

describe('Point', () => {
  describe('#constuctor', () => {
    it('throws on undefined inputs', () => {
      expect(function () {
        return new Point({})
      }).toThrow(Error)
    })
  })

  describe('#rotateAround', () => {
    it('can rotate 90 degrees clockwise around a point', () => {
      const init = new Point({ x: 2, y: 1 })
      const fulcrum = new Point({ x: 1, y: 1 })
      const result = init.rotateAround({ fulcrum: fulcrum, degrees: 90 })
      expect(result.toArray()).toEqual([1, 2])
    })

    it('can rotate 90 degrees counterclockwise around a point', () => {
      const init = new Point({ x: 1, y: 2 })
      const fulcrum = new Point({ x: 1, y: 1 })
      const result = init.rotateAround({ fulcrum: fulcrum, degrees: -90 })
      const expected = new Point({ x: 2, y: 1 })
      expect(result.equals(expected)).toBe(true)
    })
  })

  describe('#clone', () => {
    it('works', () => {
      const point = Factory.Point()
      expect(point.clone().equals(point)).toBe(true)
    })
  })

  describe('#toFixed', () => {
    const initial = Factory.Point()
    const digits = 2
    const fixed = initial.toFixed(digits)
    expect(initial.x.toFixed(digits)).toEqual(fixed.x)
    expect(initial.y.toFixed(digits)).toEqual(fixed.y)
  })

  describe('#degreesTo', () => {
    it('returns degrees to NORTH', () => {
      const p1 = new Point({ x: 3, y: 3 })
      const p2 = new Point({ x: 3, y: 0 })
      expect(degreesEqual(p1.degreesTo(p2), COMPASS.NORTH)).toBe(true)
    })

    it('returns degrees to WEST', () => {
      const p1 = new Point({ x: 3, y: 3 })
      const p2 = new Point({ x: 0, y: 3 })
      expect(degreesEqual(p1.degreesTo(p2), COMPASS.WEST)).toBe(true)
    })
  })

  describe('#move', () => {
    const initial = new Point({ x: 3, y: 3 })

    it('cannot take both degrees and radians', () => {
      expect(function () { initial.move({ degrees: 0, radians: 0 }) }).toThrow(Error)
    })

    it('can move point NORTH 3', () => {
      const moved = initial.move({ degrees: COMPASS.NORTH, distance: 3 })
      const expected = new Point({ x: 3, y: 0 })
      expect(moved.equals(expected)).toBe(true)
    })

    it('can move point WEST 3', () => {
      const moved = initial.move({ degrees: COMPASS.WEST, distance: 3 })
      const expected = new Point({ x: 0, y: 3 })
      expect(moved.equals(expected)).toBe(true)
    })
  })
})
