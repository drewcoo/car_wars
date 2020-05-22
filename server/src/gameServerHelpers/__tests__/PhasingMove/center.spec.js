import PhasingMove from '../../PhasingMove'
import GameObjectFactory from '../GameObjectFactory'
import Rectangle from '../../../utils/geometry/Rectangle'

describe('PhasingMove', () => {
  describe('#center', () => {
    let vehicle

    beforeEach(() => {
      vehicle = GameObjectFactory.vehicle({})
    })

    it('moves a moved phasing rect back to its starting place', () => {
      const oldLocation = vehicle.phasing.rect
      const rectangleOldLocation = new Rectangle(oldLocation)

      vehicle.phasing.rect = PhasingMove.center({ vehicle })

      const rectanglevehicleRect = new Rectangle(vehicle.rect)
      const rectanglevehiclePhasingRect = new Rectangle(vehicle.phasing.rect)

      expect(rectanglevehicleRect.equals(rectanglevehiclePhasingRect)).toBe(true)
      expect(rectangleOldLocation.equals(rectanglevehiclePhasingRect)).toBe(false)
    })
  })
})
