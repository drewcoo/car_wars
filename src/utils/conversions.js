import { INCH } from './constants'

export const to_inches = (pixels) => {
  return (pixels / INCH).toFixed(2)
}

export const degrees_to_radians = (degrees) => {
  return Math.PI / 180 * degrees
}

export const radians_to_degrees = (radians) => {
  return 180 / Math.PI * radians
}

export const degrees_equal = (d1, d2) => {
  return ((360 + d1) % 360).toFixed(2) === ((360 + d2) % 360).toFixed(2)
}

export const degrees_parallel = (d1, d2) => {
  return ((180 + d1) % 180).toFixed(2) === ((180 + d2) % 180).toFixed(2)
}
