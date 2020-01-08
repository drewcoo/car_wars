import { INCH } from './constants'

export const toInches = (pixels : number) : number => {
  return Number.parseFloat((pixels / INCH).toFixed(2))
}

export const degreesToRadians = (degrees : number) : number => {
  return Math.PI / 180 * degrees
}

export const radiansToDegrees = (radians : number) : number => {
  return 180 / Math.PI * radians
}

export const degreesEqual = (d1 : number, d2 : number) : boolean => {
  return ((360 + d1) % 360).toFixed(2) === ((360 + d2) % 360).toFixed(2)
}

export const degreesParallel = (d1 : number, d2 : number) : boolean => {
  return ((180 + d1) % 180).toFixed(2) === ((180 + d2) % 180).toFixed(2)
}
