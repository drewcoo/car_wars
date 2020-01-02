import React, { Component } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import './App.css'
import NavSelector from './components/pages/NavSelector'

class App extends Component {
  render () {
    return (
      <div>
        <Router>
          <NavSelector />
        </Router>
      </div>
    )
  }
}

export default App
