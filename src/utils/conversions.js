import {INCH } from './constants';

export const to_inches = (pixels) => {
  return (pixels / INCH).toFixed(2);
}

export const degrees_to_radians = (degrees) => {
  return Math.PI / 180 * degrees;
}

export const radians_to_degrees = (radians) => {
  return 180 / Math.PI * radians;
}

export const degrees_equals = (d1, d2) => {
  return (360 + d1) % 360 === (360 + d1) % 360;
}
