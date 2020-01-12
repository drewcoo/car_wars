class Dice {
  //
  // Doesn't handle things like always failing on snake eyes.
  // Do something better later.
  //
  // Examples: '4d-3', '2d', '1d+2'
  static roll (rollString : string = '1d') : number {
    // BUGBUG: I don't think this first on is a type error,
    // but what's the right type?
    if (!rollString.match(/\d+d/)) { throw new TypeError('requires number followed by "d"') }
    let [dice, modifier] = rollString.split('d').map(elem => { return parseInt(elem) })
    modifier = modifier || 0
    console.log(`dice: ${dice}`)
    console.log(`modifier: ${modifier}`)
    let total : number = 0
    for (let i : number = 0; i < dice; i++) {
      total = total + Math.floor(Math.random() * 6) + 1
    }
    // p.5: Some weapons do “1/2d” of damage, or a “half-die.” This means to
    // roll one die and divide the result by 2, rounding up.
    if (dice < 1) {
      total = Math.ceil(total * dice)
    }
    return total + modifier
  }
}
export default Dice
