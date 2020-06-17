import Collisions from '../../Collisions'

describe('Collisions', () => {
  describe('#damageModifierFromWeight (Collision Damage Table)', () => {
    // p. 19
    const weights = {
      Hotshot: 6600,
      KillerKart: 2300,
      Shogun100: 800,
    }
    it('Hotshot has DM of 1/3', () => {
      expect(Collisions.damageModifierFromWeight(weights.Hotshot)).toEqual(1)
    })
    it('Killer Kart has DM of 2/3', () => {
      expect(Collisions.damageModifierFromWeight(weights.KillerKart)).toEqual(2 / 3)
    })

    it('Killer Kart has DM of 2/3', () => {
      expect(Collisions.damageModifierFromWeight(weights.Shogun100)).toEqual(1 / 3)
    })
  })
})
