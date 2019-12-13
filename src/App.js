import React, { Component } from 'react'
// import { Provider } from 'react-redux'
// import { store } from './redux'

import './App.css'

import NavSelector from './pages/NavSelector'

class App extends Component {
  /*
  componentDidMount () {
    var element = document.getElementById('ghost')
    element.scrollIntoViewIfNeeded() // scrollIntoView();//{ block: 'center', inline: 'center' });
    element.scrollIntoView({ block: 'center', inline: 'center' })
  }

  componentDidUpdate () {
    var element = document.getElementById('ghost')
    element.scrollIntoViewIfNeeded() // scrollIntoView();//{ block: 'center', inline: 'center' });
    element.scrollIntoView({ block: 'center', inline: 'center' })
  }
*/

  render () {
    return (
      <div>
        <NavSelector />
      </div>
    )
  }
}

export default App
