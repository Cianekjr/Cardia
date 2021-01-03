<template>
  <Card class="p-col-12 p-mb-3">
    <template #header>
      <h2 class="p-text-center">sadasd</h2>
    </template>
    <template #content>
      <div class="p-grid p-col-12 p-ai-stretch vertical-container">

        <div class="p-col-6">
          <Card class="p-col-12 stats-card p-text-center">
            <template #title>
              <div class="stats-card-title">Wszystkie badania</div>
            </template>
            <template #content>
              <div class="p-grid p-jc-around">
                <div class="theme-first p-p-3">{{ data.allInspectionsCount1 }}</div>
                <div class="theme-second p-p-3" v-if="data.allInspectionsCount2">{{ data.allInspectionsCount2 }}</div>
              </div>
            </template>
          </Card>
        </div>

        <div class="p-col-6">
          <Card class="p-col-12 stats-card p-text-center">
            <template #title>
              <div class="stats-card-title">Stacje diagnostyczne</div>
            </template>
            <template #content>
              <div class="p-grid p-jc-around">
                <div class="theme-first p-p-3">{{ data.allStationsCount1 }}</div>
                <div class="theme-second p-p-3" v-if="data.allStationsCount2">{{ data.allStationsCount2 }}</div>
              </div>
            </template>
          </Card>
        </div>

        <div class="p-col-6 p-d-flex">
          <Card class="p-col-12 stats-card p-text-center">
            <template #title>
              <div class="stats-card-title">Rezultaty badań</div>
            </template>
            <template #content>
              <div class="p-grid p-jc-around">
                <div class="p-col-6">
                  <Chart type="doughnut" class="theme-first p-p-3" :data="data.inspectionResultsData1" :options="data.doughnutOptions"/>
                </div>
                <div v-if="data.inspectionResultsData2" class="p-col-6">
                  <Chart  type="doughnut" class="theme-second p-p-3" :data="data.inspectionResultsData2" :options="data.doughnutOptions"/>
                </div>
              </div>
            </template>
          </Card>
        </div>

        <div class="p-col-6 p-d-flex">
          <Card class="p-col-12 stats-card p-text-center">
            <template #title>
              <div class="stats-card-title">Uszkodzenia modułów</div>
            </template>
            <template #content>
              <div class="p-grid p-jc-around">
                <div class="p-col-6">
                  <Chart type="doughnut" class="theme-first p-p-3" :data="data.componentsFaultsData1" :options="data.doughnutOptions"/>
                </div>
                <div v-if="data.componentsFaultsData2" class="p-col-6">
                  <Chart type="doughnut" class="theme-second p-p-3" :data="data.componentsFaultsData2" :options="data.doughnutOptions"/>
                </div>
              </div>
            </template>
          </Card>
        </div>

        <div class="p-col-12">
          <Card class="p-col-12 stats-card p-text-center">
            <template #title>
              <div class="stats-card-title">Rozkład uszkodzeń modułów</div>
            </template>
            <template #content>
              <Chart type="line" :data="data.faultsDistributionData" :options="data.faultsDistributionOptions" :width="450"/>
            </template>
          </Card>
        </div>

<!--        <div class="p-col-12">-->
<!--          <Card class="stats-card box">-->
<!--            <template #title>-->
<!--              <div>Uszkodzenia modułów</div>-->
<!--            </template>-->
<!--            <template #content>-->
<!--              <Chart type="bar" :data="stackedData" :options="resultsOptions"/>-->
<!--            </template>-->
<!--          </Card>-->
<!--        </div>-->

      </div>
    </template>
  </Card>
</template>

<script lang="ts">
import { computed } from 'vue'

export default ({
  props: {
    analyticsData: {
      type: Object,
      required: true
    }
  },
  setup (props) {
    const backgroundColor = ['#2B7469', '#FF6F80', '#61DDC9', '#FECFCA', '#1C3B36', '#FF9797', '#FFDFB9']

    const data = computed(() => ({
      allInspectionsCount1: props.analyticsData?.allInspectionsCount1,
      allInspectionsCount2: props.analyticsData?.allInspectionsCount2,
      allStationsCount1: props.analyticsData?.allStationsCount1,
      allStationsCount2: props.analyticsData?.allStationsCount2,
      inspectionResultsData1: {
        labels: ['Pozytywne', 'Negatywne'],
        datasets: [{ data: props.analyticsData?.inspectionResultsData1, backgroundColor }]
      },
      inspectionResultsData2: props.analyticsData?.inspectionResultsData2 && {
        labels: ['Pozytywne', 'Negatywne'],
        datasets: [{ data: props.analyticsData?.inspectionResultsData2, backgroundColor }]
      },
      componentsFaultsData1: {
        labels: props.analyticsData?.componentsFaultsData1?.keys,
        datasets: [{ data: props.analyticsData?.componentsFaultsData1?.values, backgroundColor }]
      },
      componentsFaultsData2: props.analyticsData?.componentsFaultsData2 && {
        labels: props.analyticsData?.componentsFaultsData2?.keys,
        datasets: [{ data: props.analyticsData?.componentsFaultsData1?.values, backgroundColor }]
      },
      doughnutOptions: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 20
          }
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              return data.labels[tooltipItem.index] + ': ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + '%'
            }
          }
        },
        onResize: (a) => {
          a.aspectRatio = (a.width * 1.1) / (Math.min(a.width, 200) + a.legend.height)
        },
        animation: {
          onProgress: (b) => {
            b.chartInstance.aspectRatio = (b.chartInstance.width * 1.1) / (b.chartInstance.width + b.chartInstance.legend.height)
          }
        }
      },
      faultsDistributionData: {
        labels: ['0', '50 tyś km', '100 tyś km', '150 tyś km', '200 tyś km', '250 tyś km', '300 tyś km'],
        datasets: [
          {
            label: 'SUV Audi',
            data: [0.03, 0.05, 0.2, 0.5, 1.1, 2.6, 3],
            fill: false,
            borderColor: 'rgba(102, 187, 106, 1)'
          },
          {
            label: 'Coupe Mercedes',
            data: [0.008, 0.04, 0.17, 0.45, 0.99, 1.9, 2.5],
            fill: false,
            borderColor: 'rgba(66, 165, 245, 1)'
          }
        ]
      },
      faultsDistributionOptions: {
        tooltips: {
          mode: 'index'
        }
      }
    }))

    return {
      data
    }
  }
})

</script>

<style scoped lang="scss">
.stats-card {
  position: relative;
  background-image: linear-gradient(to right, #dad299, #b0dab9);
  color: black;
}

.stats-card-title {
  font-size: 1.3rem;
}

.card-icon {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  padding: 10px;
  font-size: 1.5rem;
}

.theme-first {
  border: 3px solid #66BB6A;
  border-radius: 6px;
}

.theme-second {
  border: 3px solid #0080d4;
  border-radius: 6px;
}

.theme-first, .theme-second {
  font-size: 2rem;
  font-weight: 600;
}
</style>
