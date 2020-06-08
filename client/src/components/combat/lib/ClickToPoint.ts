import Point from '../../../utils/geometry/Point'

const ClickToPoint = ({
  clickEvent,
  boundingViewport = 'ArenaMap',
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  clickEvent: any
  boundingViewport: string
}): Point => {
  const bodyBounding = document.body.getBoundingClientRect()
  const bvp = document.getElementById(boundingViewport)
  if (bvp === null || bvp.getBoundingClientRect() === null) {
    throw new Error('no bounding viewport found')
  }
  const elemBounding = bvp.getBoundingClientRect()

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
