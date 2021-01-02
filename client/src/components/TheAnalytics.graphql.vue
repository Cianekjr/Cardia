<script lang="ts">
import { useQuery, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useToast } from 'primevue/usetoast'

function useApollo () {
  const toast = useToast()

  const { result: analyticsDataResult, loading: analyticsDataLoading, error: analyticsDataError, onError: onAnalyticsDataError, refetch: refetchAnalyticsData, onResult: onAnalyticsDataResult } = useQuery(gql`
    query getAnalyticsData ($input: AnalyticsDataInput) {
      getAnalyticsData (input: $input) {
        allInspectionsCount
        allStationsCount
        inspectionResultsData
      }
    }
  `)
  const analyticsData = useResult(analyticsDataResult, [])

  onAnalyticsDataError(() => {
    toast.add({ severity: 'error', summary: 'Błąd!', detail: 'Nie udało się załadować danych', life: 4000 })
  })

  return {
    analyticsData,
    analyticsDataLoading,
    analyticsDataError,
    refetchAnalyticsData,
    onAnalyticsDataResult
  }
}

export default useApollo

</script>
