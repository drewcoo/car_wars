const ViewElement = (id) => {
  const element = document.getElementById(id)
  if (!element) {
    // console.log(`no "${id}" element to scroll into view`)
    return false
  }
  element.scrollIntoView({ block: 'center', inline: 'center' })
  element.focus()
  return true
}

export default ViewElement
