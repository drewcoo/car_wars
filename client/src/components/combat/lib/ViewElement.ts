const ViewElement = (id: string | null): boolean => {
  let element
  if (id) {
    element = document.getElementById(id)
  }
  if (!id || !element) {
    console.log(`element ${id} not found`)
    return false
  }
  element.scrollIntoView({ block: 'center', inline: 'center' })
  element.focus()
  return true
}

export default ViewElement
