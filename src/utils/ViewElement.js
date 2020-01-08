const ViewElement = (id) => {
  const element = document.getElementById(id)
  if (!element) { return }
  element.scrollIntoView()
  element.scrollIntoView({ block: 'center', inline: 'center' })
}

export default ViewElement
