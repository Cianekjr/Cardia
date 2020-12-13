import { useQuery, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useRouter } from 'vue-router'

export default function () {
  const router = useRouter()

  const { result, error } = useQuery(gql`
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
  `)

  const user = useResult(result, null, data => data.user)

  if (!user || error) {
    router.push({ name: 'Login' })
  }

  return { user }
}
