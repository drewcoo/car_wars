import Point from '../../../utils/geometry/Point'

const ClickToPoint = ({ clickEvent, boundingViewport = 'ArenaMap' }) => {
  const bodyBounding = document.body.getBoundingClientRect()
  const elemBounding = document.getElementById(boundingViewport).getBoundingClientRect()

  console.log(clickEvent)
  console.log(`x: ${clickEvent.clientX} - (${elemBounding.left} + ${bodyBounding.left})`)
  console.log(`y: ${clickEvent.clientY} - (${elemBounding.top} + ${bodyBounding.top})`)

  console.log(' ')
  console.log('offset:')
  console.log(`(${parseInt(clickEvent.offsetX)}, ${parseInt(clickEvent.offsetY)})`)
  console.log(' ')

  return new Point({
    // clickEvent.clientFoo or clickEvent.clientFoo
    x: clickEvent.clientX - (elemBounding.left + bodyBounding.left),
    y: clickEvent.clientY - (elemBounding.top + bodyBounding.top),
  })
}

export default ClickToPoint
