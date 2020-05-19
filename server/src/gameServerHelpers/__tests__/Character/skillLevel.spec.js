import Character from '../../Character'
import GameObjectFactory from '../GameObjectFactory'

describe('Character', () => {
  describe('skillLevel', () => {
    let character, driver

    beforeEach(() => {
      character = GameObjectFactory.character({})
      driver = character.skills.find((element) => element.name === 'driver')
    })

    it('has -1 points (no skill) by default', () => {
      driver.points = 0
      expect(Character.skillLevel({ skill: 'driver', character })).toEqual(-1)
    })
  })
})
