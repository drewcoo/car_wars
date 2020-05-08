class Log {
  //
  // Doesn't handle things like always failing on snake eyes.
  // Do something better later.
  //
  // Examples: '4d-3', '2d', '1d+2'
  static info (message, target = null) {
    if (target != null) {
      target.log.push(message)
    }
    color = target ? target.color : ''
    console.log(`${color}: ${message}`)
  }
}
export default Log
