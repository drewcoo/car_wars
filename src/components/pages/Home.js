// import React, { Component } from 'react'
import React from 'react'
// import { Provider } from 'react-redux'
// import { store } from './redux'

const Home = () => {
  console.log('here')
  return (
    <div>
      <br/><br/><span className='Title'>You are home.</span><br/>
      <span className='RegularText'>This should explain. And link to <a href='http://www.sjgames.com/car-wars/games/classic/'>Car Wars Classic at Steve Jackson Games</a>.</span>
    </div>
  )
}

export default Home
