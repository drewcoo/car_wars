import Collisions from '../../Collisions'
import GameObjectFactory from '../GameObjectFactory'

describe('Collisions', () => {
  describe('#clear', () => {
    let _data, car0, car1, car2, car3, match0, match1
    beforeEach(() => {
      car0 = GameObjectFactory.car({ id: 'car0' })
      car1 = GameObjectFactory.car({ id: 'car1' })
      car2 = GameObjectFactory.car({ id: 'car2' })
      car3 = GameObjectFactory.car({ id: 'car3' })
      match0 = GameObjectFactory.match({
        id: 'match0',
        carIds: [car0.id, car1.id, car2.id],
      })
      match1 = GameObjectFactory.match({ id: 'match1', carIds: [car3.id] })
      _data = {
        cars: [car0, car1, car2, car3],
        matches: [match0, match1],
      }
    })

    describe('does not clear cars not in match', () => {
      it('.collisionDetected', () => {
        car3.collisionDetected = true
        Collisions.clear({ match: match0, _data })
        expect(car3.collisionDetected).toBe(true)
      })

      it('.collisions', () => {
        car3.collisions.push(GameObjectFactory.collision())
        Collisions.clear({ match: match0, _data })
        expect(car3.collisions).not.toEqual([])
      })

      it('.phasing.collisionDetected', () => {
        car3.phasing.collisionDetected = true
        Collisions.clear({ match: match0, _data })
        expect(car3.phasing.collisionDetected).toBe(true)
      })

      it('.phasing.collisions', () => {
        car3.phasing.collisions.push(GameObjectFactory.collision())
        Collisions.clear({ match: match0, _data })
        expect(car3.phasing.collisions).not.toEqual([])
      })
    })

    describe('clears cars not in match', () => {
      it('.collisionDetected', () => {
        car1.collisionDetected = true
        Collisions.clear({ match: match0, _data })
        expect(car1.collisionDetected).toBe(false)
      })

      it('.collisions', () => {
        car1.collisions.push(GameObjectFactory.collision())
        Collisions.clear({ match: match0, _data })
        expect(car1.collisions).toEqual([])
      })

      it('.phasing.collisionDetected', () => {
        car1.phasing.collisionDetected = true
        Collisions.clear({ match: match0, _data })
        expect(car1.phasing.collisionDetected).toBe(false)
      })

      it('.phasing.collisions', () => {
        car1.phasing.collisions.push(GameObjectFactory.collision())
        Collisions.clear({ match: match0, _data })
        expect(car1.phasing.collisions).toEqual([])
      })
    })

    describe('and leaves clear cars alone', () => {
      it('.collisionDetected', () => {
        Collisions.clear({ match: match0, _data })
        expect(car1.collisionDetected).toBe(false)
      })

      it('.collisions', () => {
        Collisions.clear({ match: match0, _data })
        expect(car1.collisions).toEqual([])
      })

      it('.phasing.collisionDetected', () => {
        Collisions.clear({ match: match0, _data })
        expect(car1.phasing.collisionDetected).toBe(false)
      })

      it('.phasing.collisions', () => {
        Collisions.clear({ match: match0, _data })
        expect(car1.phasing.collisions).toEqual([])
      })
    })
  })
})
