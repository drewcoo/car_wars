import Point from '../../../utils/geometry/Point'

const ClickToPoint = ({ clickEvent, boundingViewport = 'ArenaMap' }) => {
  const bodyBounding = document.body.getBoundingClientRect()
  const elemBounding = document.getElementById(boundingViewport).getBoundingClientRect()

  return new Point({
    // clickEvent.clientFoo or clickEvent.pageFoo
    x: clickEvent.clientX - (elemBounding.left + bodyBounding.left),
    y: clickEvent.clientY - (elemBounding.top + bodyBounding.top)
  })
}

export default ClickToPoint
