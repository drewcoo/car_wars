import { INCH } from './constants'

export const toInches = (pixels) => {
  return (pixels / INCH).toFixed(2)
}

export const degreesToRadians = (degrees) => {
  return Math.PI / 180 * degrees
}

export const radiansToDegrees = (radians) => {
  return 180 / Math.PI * radians
}

export const degreesEqual = (d1, d2) => {
  return ((360 + d1) % 360).toFixed(2) === ((360 + d2) % 360).toFixed(2)
}

export const degreesParallel = (d1, d2) => {
  return ((180 + d1) % 180).toFixed(2) === ((180 + d2) % 180).toFixed(2)
}
