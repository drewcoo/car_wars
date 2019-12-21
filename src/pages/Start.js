// import React, { Component } from 'react'
import React from 'react'
import { Provider } from 'react-redux'
import { store } from '../redux'

import '../App.css'

import PlayersForm from '../components/planMatch/PlayersForm'

/*  <span className='FormText'>Map:<MapSelector/></span><br/> */

const Start = () => {
  return (
    <Provider store={ store }>
      <br/><br/>
      <div>
        <span className='FormText'><PlayersForm/></span>
      </div>
    </Provider>
  )
}

export default Start
