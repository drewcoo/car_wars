import React from 'react'
import Component from './GenericComponent'

export const Tire = ({ car, length, width, front, left }) => {
  const component = new Component({ width, length })

  const locationName = () => {
    var result = front ? 'F' : 'B'
    result += left ? 'L' : 'R'
    return result
  }

  const textX = (left) => {
    // left : right
    return left ? width * 11 / 64 : width * 48 / 64
  }

  const textY = (front) => {
    // front : back
    return front ? length * 25 / 64 : length * 49 / 64
  }

  const DP = car.design.components.tires.find(function (tire) { return tire.location === locationName(front, left) }).damagePoints

  return (
    <g>
      <rect
        rx = { width / 32 }
        x = { left ? width * 10 / 64 : width * 46 / 64}
        y = { front ? length * 18 / 64 : length * 42 / 64 }
        width = { width * 8 / 64 }
        height = { length * 11 / 64 }
        style = { DP < 1 ? component.style.red : component.style.default }
      />
      <text x={ textX(left) } y={ textY(front) }> { DP } </text>
    </g>
  )
}
