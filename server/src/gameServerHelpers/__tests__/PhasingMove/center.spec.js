import PhasingMove from '../../PhasingMove'
import GameObjectFactory from '../GameObjectFactory'
import Rectangle from '../../../utils/geometry/Rectangle'

describe('PhasingMove', () => {
  describe('#center', () => {
    let car

    beforeEach(() => {
      car = GameObjectFactory.car({})
    })

    it('moves a moved phasing rect back to its starting place', () => {
      const oldLocation = car.phasing.rect
      const rectangleOldLocation = new Rectangle(oldLocation)

      PhasingMove.center({ car })

      const rectangleCarRect = new Rectangle(car.rect)
      const rectangleCarPhasingRect = new Rectangle(car.phasing.rect)

      expect(rectangleCarRect.equals(rectangleCarPhasingRect)).toBe(true)
      expect(rectangleOldLocation.equals(rectangleCarPhasingRect)).toBe(false)
    })
  })
})
