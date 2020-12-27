import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import gql from 'graphql-tag'
import Home from '@/views/Home.vue'
import { apolloClient } from '@/plugins/ApolloClient'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { notLoggedAllowed: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { notLoggedAllowed: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { notLoggedAllowed: true }
  },
  {
    path: '/inspections/new',
    name: 'NewInspection',
    component: () => import('../views/NewInspection.vue'),
    meta: { notLoggedAllowed: false }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const isNeedRefetch = from.name === 'Login' || from.name === 'Register' || to.name === 'Login'

  const { data } = await apolloClient.query({
    query: gql`
      query getCurrentStation {
        getCurrentStation {
          id
          email
          name
        }
      },
    `,
    errorPolicy: 'ignore',
    fetchPolicy: isNeedRefetch ? 'network-only' : 'cache-first'
  })

  const stationId = data?.getCurrentStation?.id

  if (!to.meta.notLoggedAllowed && !stationId) {
    next({ name: 'Login' })
  } else if (stationId && (to.name === 'Login' || to.name === 'Register')) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
