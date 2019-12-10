class GenericComponent {
  constructor ({ width, length }) {
    this.length = 9 / 64 * length
    this.width = 18 / 64 * width
    this.centerX = 7 / 64 * width
    this.row1 = 4 / 64 * length
    this.row2 = 8 / 64 * length
    this.style = {
      default: {
        fill: 'white',
        stroke: 'black',
        strokeWidth: 2
      },
      red: {
        fill: 'red',
        stroke: 'black',
        strokeWidth: 2
      },
      name: {
        fontSize: '18px', // default is 24
        fontFamily: 'fantasy',
        fontVariant: 'small-caps'
      }
    }
  }

  indent () {
    return this.width * 0.05
  }
}
export default GenericComponent
