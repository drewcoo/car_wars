
export const KEYSTROKE = 'KEYSTROKE'

export const keystroke = (state) => {
  console.log('NOW HERE STATE: ' + state.input_key)
  console.log(`ID: ${state.id}`)
  return state
}
