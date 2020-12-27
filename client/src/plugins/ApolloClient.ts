import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'

const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',
  credentials: 'include'
})
const cache = new InMemoryCache()

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache
})
