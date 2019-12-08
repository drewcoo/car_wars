import Point from '../../utils/Point'
import { COMPASS } from '../../utils/constants'
import { degrees_equal, degrees_to_radians } from '../../utils/conversions'
import Factory from './Factory'

describe('Point', () => {
  describe('#constuctor', () => {
    it('throws on undefined inputs', () => {
      expect(function () { new Point({}) }).toThrow(Error)
    })
  })

  describe('#to_array', () => {
    it('can return an array', () => {
      const point = Factory.Point()
      expect(point.to_array()).toEqual([point.x, point.y])
    })
  })

  describe('#rotate_around', () => {
    it('can rotate 90 degrees clockwise around a point', () => {
      const init = new Point({ x: 2, y: 1 })
      const fulcrum = new Point({ x: 1, y: 1 })
      const result = init.rotate_around({ fulcrum: fulcrum, degrees: 90 })
      expect(result.to_array()).toEqual([1, 2])
    })

    it('can rotate 90 degrees counterclockwise around a point', () => {
      const init = new Point({ x: 1, y: 2 })
      const fulcrum = new Point({ x: 1, y: 1 })
      const result = init.rotate_around({ fulcrum: fulcrum, degrees: -90 })
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

  describe('#degrees_to', () => {
    it('returns degrees to NORTH', () => {
      const p1 = new Point({ x: 3, y: 3 })
      const p2 = new Point({ x: 3, y: 0 })
      expect(degrees_equal(p1.degrees_to(p2), COMPASS.NORTH)).toBe(true)
    })

    it('returns degrees to WEST', () => {
      const p1 = new Point({ x: 3, y: 3 })
      const p2 = new Point({ x: 0, y: 3 })
      expect(degrees_equal(p1.degrees_to(p2), COMPASS.WEST)).toBe(true)
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

  describe('#toString', () => {
    it('does JSON.stringify on toString', () => {
      const point = Factory.Point()
      expect(point.toString()).toEqual(JSON.stringify(point))
    })
  })
})
