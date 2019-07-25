class Dice {
  //
  // Doesn't handle things like always failing on snake eyes.
  // Do something better later.
  //
  // Examples: '4d-3', '2d', '1d+2'
  static roll(string='1d') {
    // BUGBUG: I don't think this first on is a type error,
    // but what's the right type?
    if (!string.match(/\d+d/)) { throw new TypeError('requires number followed by \"d\"'); }
    var [dice, modifier] = string.split('d').map(elem => { return parseInt(elem); });
    modifier = modifier ? modifier : 0;
    var total = 0;
    for(var i = 0; i < dice; i++) {
      total = total + Math.floor(Math.random() * 6) + 1;
    }
    return total + modifier;
  }
}
export default Dice;
