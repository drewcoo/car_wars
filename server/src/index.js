import express from 'express'
import { ApolloServer, gql } from 'apollo-server-express'

import http from 'http'

import cors from 'cors'

import resolvers from './resolvers'
import schema from './schema'

const PORT = 4000

const server = new ApolloServer({ schema, resolvers })
const app = express()
app.use(cors())
server.applyMiddleware({ app })

const httpServer = http.createServer(app)
server.installSubscriptionHandlers(httpServer)

httpServer.listen({ port: PORT }, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`);
});
