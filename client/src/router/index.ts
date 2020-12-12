import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import gql from 'graphql-tag'
import Home from '../views/Home.vue'
import { apolloClient } from '@/plugins/ApolloClient'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { allowedRoles: ['DIAGNOSTICIAN', 'ANALYST'] }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { allowedRoles: ['NOTLOGGED'] }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { allowedRoles: ['NOTLOGGED'] }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const isNeedRefetch = from.name === 'Login' || from.name === 'Register'
  const { data } = await apolloClient.query({
    query: gql`
      query user {
        user {
          id
          email
          role
          station {
            id
          }
        }
      },
    `,
    errorPolicy: 'ignore',
    fetchPolicy: isNeedRefetch ? 'network-only' : 'cache-first'
  })

  const user = data?.user

  const role = user?.role || 'NOTLOGGED'

  if (!to.meta.allowedRoles.includes(role) && !user) {
    next({ name: 'Login' })
  } else if (!to.meta.allowedRoles.includes(role) && user) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
