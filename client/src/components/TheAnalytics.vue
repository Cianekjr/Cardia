<template>
  <div class="p-d-flex p-flex-column p-col-12">
    <TheAnalyticsFilters @updateFiltersData="updateFiltersData" :analyticsData="analyticsData"/>
    <TheAnalyticsPanel :analyticsData="analyticsData" :filter="filter"/>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import TheAnalyticsPanel from '@/components/TheAnalyticsPanel.vue'
import TheAnalyticsFilters from '@/components/TheAnalyticsFilters.vue'
import useApollo from '@/components/TheAnalytics.graphql'

export default ({
  components: {
    TheAnalyticsPanel,
    TheAnalyticsFilters
  },
  setup () {
    const { analyticsData, refetchAnalyticsData, onAnalyticsDataResult } = useApollo()
    const filtersData = ref({})
    const filter = ref('mileage')

    const updateFiltersData = ({ filterType, ...data }) => {
      filtersData.value = { ...data }
      filter.value = filterType
    }

    watch(filtersData, () => {
      refetchAnalyticsData({ input: filtersData.value })
    })
    return {
      updateFiltersData,
      onAnalyticsDataResult,
      analyticsData,
      filter
    }
  }
})
</script>
