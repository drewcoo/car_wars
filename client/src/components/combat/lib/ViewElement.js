const ViewElement = (id) => {
  const element = document.getElementById(id)
  if (!element) {
    console.log('not found')
    return false
  }
  console.log('trying')
  element.scrollIntoView({ block: 'center', inline: 'center' })
  element.focus()
  return true
}

export default ViewElement
