interface Dimensions {
  length: number
  width: number
}

interface Dimensions {
  height: number
  width: number
}

class Dimensions {
  height: number
  length: number
  width: number

  constructor({ length, width }: { length: number; width: number }) {
    this.height = this.length = length
    this.width = width
  }
}
export default Dimensions
