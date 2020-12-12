import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'

const httpLink = createHttpLink({
  uri: process.env.VUE_APP_API_URL || 'http://localhost:3000/graphql',
  credentials: 'include'
})
const cache = new InMemoryCache()

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache
})
