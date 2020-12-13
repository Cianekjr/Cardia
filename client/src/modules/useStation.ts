import { useQuery, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useRouter } from 'vue-router'

export default function () {
  const router = useRouter()

  const { result, error } = useQuery(gql`
    query getCurrentStation {
      getCurrentStation {
        id
        email
        name
      }
    },
  `)

  const station = useResult(result, null, data => data.getCurrentStation)

  if (!station || error.value) {
    router.push({ name: 'Login' })
  }

  return { station }
}
