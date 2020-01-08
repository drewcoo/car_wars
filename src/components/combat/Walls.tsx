import * as React from 'react'
import { connect } from "react-redux"
import '../../App.css'

const mapStateToProps = (state: any) => {
  return({ matches: state.matches })
}

class Walls extends React.Component {
  props: any
  // props.matchId

  wallData() {
    const data: any = this.props.matches[this.props.matchId].map.wallData
    return (
      data.map((wall: any) => (
        <g key={ wall.id }>
          <rect
            className={ 'Wall' }
            x = { wall.rect.brPoint().x - wall.rect.width }
            y = { wall.rect.brPoint().y - wall.rect.length }
            width = { wall.rect.width }
            height = { wall.rect.length }
            transform = { `rotate(${ wall.rect.facing + 90 } ${ wall.rect.brPoint().x } ${ wall.rect.brPoint().y })` }
          />
        </g>
      ))
    )
  }

  render() {
    return (
      <g>
        { this.wallData() }
      </g>
    )
  }
}

export default connect(mapStateToProps)(Walls)
