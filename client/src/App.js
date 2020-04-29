import React, { Component } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import './App.css'
import NavSelector from './components/pages/NavSelector'

import { ApolloProvider } from '@apollo/react-hooks'
import { InMemoryCache } from 'apollo-cache-inmemory'

import ApolloClient from 'apollo-client' // 'apollo-boost'

import { split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

const SERVER_PORT = 4000

// Create an http link:
const httpLink = new HttpLink({
  uri: `http://localhost:${SERVER_PORT}/graphql`
})

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: `ws://localhost:${SERVER_PORT}/graphql`,
  options: {
    reconnect: true
  }
})

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink
)

const client = new ApolloClient({
  link: link,
  // uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
})

class App extends Component {
  render () {
    return (
      <ApolloProvider client={client}>
        <div>
          <Router>
            <NavSelector client={client}/>
          </Router>
        </div>
      </ApolloProvider>
    )
  }
}

export default App
