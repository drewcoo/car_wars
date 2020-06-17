class Dice {
  //
  // Doesn't handle things like always failing on snake eyes.
  // Do something better later.
  //
  // Examples: '4d-3', '2d', '1d+2'
  static roll(rollString = '1d') {
    // BUGBUG: I don't think this first on is a type error,
    // but what's the right type?
    if (!rollString.match(/\d+d/)) {
      throw new TypeError('requires number followed by "d"')
    }
    // eslint-disable-next-line prefer-const
    let [dice, modifier] = rollString.split('d').map(elem => {
      return parseInt(elem)
    })
    modifier = modifier || 0
    let total = 0
    for (let i = 0; i < dice; i++) {
      total += Math.ceil(Math.random() * 6)
    }
    // p.5: Some weapons do "1/2d" of damage, or a "half-die." This means to
    // roll one die and divide the result by 2, rounding up.
    if (dice < 1) {
      total = Math.ceil(total * dice)
    }
    return total + modifier
  }
}
export default Dice
