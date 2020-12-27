import { useQuery, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useRouter } from 'vue-router'

export default function () {
  const router = useRouter()

  try {
    const { result } = useQuery(gql`
      query getCurrentStation {
        getCurrentStation {
          id
          email
          name
        }
      },
    `)
    const station = useResult(result)

    return { station }
  } catch {
    router.push({ name: 'Login' })
  }
}
