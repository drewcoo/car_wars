import React from 'react'
import { useSelector } from 'react-redux'

const InsetLayout = ({ width, length, car }) => {
  return (
    <g>
      <text x = { width * 16 / 64 } y = { length * 9 / 64 } >
        F: { car.design.components.armor.F }
      </text>
      <text x = { width * 36 / 64 } y = { length * 9 / 64 } >
        T: { car.design.components.armor.T }
      </text>
      <text x = { width * 2 / 64 } y = { length * 32 / 64 } >
        L: { car.design.components.armor.L }
      </text>
      <text x = { width * 48 / 64 } y = { length * 32 / 64 } >
        R: { car.design.components.armor.R }
      </text>
      <text x = { width * 16 / 64 } y = { length * 63 / 64 } >
        B: { car.design.components.armor.B }
      </text>
      <text x = { width * 36 / 64 } y = { length * 63 / 64 } >
        U: { car.design.components.armor.U }
      </text>
    </g>
  )
}

const Car = ({ matchId, id, inset = false, ghost = false }) => {
  const match = useSelector((state) => state.matches[matchId])
  const car = match.cars.find((car) => car.id === id)
  const tempRect = ghost ? car.phasing.rect : car.rect
  const collisionDetected = ghost ? car.phasing.collisionDetected : car.collisionDetected
  const opacity = ghost ? 1 / 2 : 1

  const bodyStyle = {
    fill: car.color,
    stroke: 'black',
    strokeWidth: 3,
    opacity: opacity
  }
  const roofStyle = {
    fill: car.color,
    opacity: opacity
  }
  const mainBodyStyle = {
    fill: car.color,
    stroke: 'black',
    strokeWidth: 2,
    opacity: opacity
  }
  const glassStyle = {
    fill: 'white',
    stroke: 'gray',
    strokeWidth: 3,
    opacity: opacity
  }
  const manyColoredFill = () => {
    if (collisionDetected) { return 'red' }
    if (ghost) { return 'yellow' }
    return 'white'
  }
  const outlineStyle = {
    fill: manyColoredFill(),
    stroke: 'black',
    strokeWidth: 3,
    opacity: collisionDetected ? 1 : opacity
  }

  const margin = tempRect.width / 6
  const smidge = tempRect.width / 15 // bug?
  const hoodLength = 6 * margin
  const windshieldMargin = 2 * margin - smidge / 2
  const roofLength = 3 * margin
  const roofWidth = tempRect.width - (1.75 * windshieldMargin)

  var rotatePoint = {
    x: tempRect.brPoint().x,
    y: tempRect.brPoint().y
  }
  // BUGBUG: Why + 90 degree rotation
  var transform = `rotate(${tempRect.facing + 90},
                          ${rotatePoint.x},
                          ${rotatePoint.y})`

  const showInset = () => {
    if (inset) {
      return (
        <InsetLayout
          car={ car }
          length={ tempRect.length }
          width={ tempRect.width }
        />
      )
    }
  }

  return (
    <g id={ id } >
      { /* outline */ }
      <rect
        x = { tempRect.brPoint().x - tempRect.width }
        y = { tempRect.brPoint().y - tempRect.length }
        width = { tempRect.width }
        height = { tempRect.length }
        style = { outlineStyle }
        transform = { transform }
      />
      { /* body */ }
      <rect
        rx = { tempRect.width / 4 }
        x = { tempRect.brPoint().x - tempRect.width + margin }
        y = { tempRect.brPoint().y - tempRect.length + 2 * margin }
        width = { tempRect.width - 2 * margin }
        height = { tempRect.length - 3 * margin }
        style = { mainBodyStyle }
        transform = { transform }
      />
      { /* windshield/back window */ }
      <rect
        rx = { tempRect.width / 8 }
        x = { tempRect.brPoint().x - tempRect.width + windshieldMargin }
        y = { tempRect.brPoint().y - tempRect.length + 5.5 * margin }
        width = { tempRect.width - 2 * windshieldMargin }
        height = { 1.5 * roofLength }
        style = { glassStyle }
        transform = { transform }
      />
      { /* side windows */ }
      <rect
        rx = { tempRect.width / 8 }
        x = { tempRect.brPoint().x - tempRect.width / 2 - (roofWidth + smidge) / 2 }
        y = { tempRect.brPoint().y - tempRect.length + hoodLength + 2 * smidge }
        width = { roofWidth + smidge }
        height = { roofLength - smidge }
        style = { glassStyle }
        transform = { transform }
      />
      { /* roof */ }
      <rect
        rx = { tempRect.width / 8 }
        x = { tempRect.brPoint().x - tempRect.width / 2 - roofWidth / 2 }
        y = { tempRect.brPoint().y - tempRect.length + hoodLength + smidge * 3 / 2 }
        width = { roofWidth }
        height = { roofLength }
        style = { roofStyle }
        transform = { transform }
      />
      { /* front pip */ }
      <circle
        visibility = {(!inset) ? 'visible' : 'hidden' }
        cx = { tempRect.brPoint().x - tempRect.width / 2 }
        cy = { tempRect.brPoint().y - tempRect.length + 2 + smidge }
        r = { tempRect.width / 16 }
        style = { bodyStyle }
        transform = { transform }
      />
      { showInset() }
    </g>
  )
}

export default Car
