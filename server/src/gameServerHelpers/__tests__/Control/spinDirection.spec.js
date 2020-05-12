import Control from '../../Control'

describe('Control', () => {
  it('#spinDirection is left or right', () => {
    // BUGBUG: Not checking that this varies.
    expect(['left', 'right']).toContain(Control.spinDirection())
  })
})
