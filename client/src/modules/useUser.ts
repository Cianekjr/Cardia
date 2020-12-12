import { useQuery, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useRoute, useRouter } from 'vue-router'

export default function () {
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
  // router.push({ name: 'Login' })

  const user = useResult(result, null, data => data.user)

  return { user }
}
