class Cycle {
  constructor({ elements, index = 0 }) {
    this.elements = elements
    this.index = 0
  }

  get() {
    return this.elements[this.index]
  }

  set(value) {
    this.index = this.elements.indexOf(value)
    return this.index
  }

  next() {
    this.index = (this.index + 1) % this.elements.length
    return this.elements[this.index]
  }

  previous() {
    this.index = (this.index - 1 + this.elements.length) % this.elements.length
    return this.elements[this.index]
  }

  setIndex(index) {
    if (index < 0 || index > this.elements.length - 1) {
      throw new Error(`Index out of range: ${index}`)
    }
    this.index = index
    return this.elements[this.index]
  }
}
