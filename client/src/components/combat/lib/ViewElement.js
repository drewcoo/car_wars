const ViewElement = (id) => {
  const element = document.getElementById(id)
  if (!element) {
    return false
  }
  element.scrollIntoView({ block: 'center', inline: 'center' })
  element.focus()
  return true
}

export default ViewElement
