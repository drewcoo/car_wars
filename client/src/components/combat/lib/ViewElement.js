const ViewElement = (id) => {
  const element = document.getElementById(id)
  if (!element) {
    console.log(`element ${id} not found`)
    return false
  }
  element.scrollIntoView({ block: 'center', inline: 'center' })
  element.focus()
  return true
}

export default ViewElement
