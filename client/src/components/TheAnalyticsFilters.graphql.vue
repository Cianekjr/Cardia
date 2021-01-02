<script lang="ts">
import { useQuery, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useToast } from 'primevue/usetoast'

function useApollo () {
  const toast = useToast()

  const { result: analyticsFiltersResult, loading: analyticsFiltersLoading, error: analyticsFiltersError, onError: onAnalyticsFiltersError } = useQuery(gql`
    query getAnalyticsFilters {
      getAnalyticsFilters {
        bodyTypes {
          id
          name
        }
        makes {
          id
          name
        }
        models {
          id
          name
          make {
            id
            name
          }
          bodyType {
            id
            name
          }
        }
        engineTypes {
          id
          name
        }
      }
    }
  `)

  const filtersBodyTypes = useResult(analyticsFiltersResult, [], data => data?.getAnalyticsFilters?.bodyTypes)
  const filtersMakes = useResult(analyticsFiltersResult, [], data => data?.getAnalyticsFilters?.makes)
  const filtersModels = useResult(analyticsFiltersResult, [], data => data?.getAnalyticsFilters?.models)
  const filtersEngineTypes = useResult(analyticsFiltersResult, [], data => data?.getAnalyticsFilters?.engineTypes)

  onAnalyticsFiltersError(() => {
    toast.add({ severity: 'error', summary: 'Błąd!', detail: 'Nie udało się załadować filtrów', life: 4000 })
  })

  return {
    filtersBodyTypes,
    filtersMakes,
    filtersModels,
    filtersEngineTypes,
    analyticsFiltersLoading,
    analyticsFiltersError
  }
}

export default useApollo

</script>
