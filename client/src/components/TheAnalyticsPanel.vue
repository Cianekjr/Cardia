<template>
  <Card class="p-col-12 p-mb-3">
    <template #header>
      <h2 class="p-text-center"></h2>
    </template>
    <template #content>
      <div class="p-grid p-col-12 p-ai-stretch vertical-container">

        <div class="p-col-6">
          <Card class="p-col-12 stats-card p-text-center">
            <template #title>
              <h3 class="stats-card-title">Wszystkie badania</h3>
            </template>
            <template #content>
              <div class="p-grid p-jc-around theme">
                <div :class="data.allInspectionsCount2 ? 'theme-first p-p-3' : ''">{{ data.allInspectionsCount1 }}</div>
                <div class="theme-second p-p-3" v-if="data.allInspectionsCount2">{{ data.allInspectionsCount2 }}</div>
              </div>
            </template>
          </Card>
        </div>

        <div class="p-col-6">
          <Card class="p-col-12 stats-card p-text-center">
            <template #title>
              <h3 class="stats-card-title">Stacje diagnostyczne</h3>
            </template>
            <template #content>
              <div class="p-grid p-jc-around theme">
                <div :class="data.allStationsCount2 ? 'theme-first p-p-3' : ''">{{ data.allStationsCount1 }}</div>
                <div class="theme-second p-p-3" v-if="data.allStationsCount2">{{ data.allStationsCount2 }}</div>
              </div>
            </template>
          </Card>
        </div>

        <div class="p-col-6 p-d-flex">
          <Card class="p-col-12 stats-card p-text-center">
            <template #title>
              <h3 class="stats-card-title">Rezultaty badań</h3>
            </template>
            <template #content>
              <div class="p-grid p-jc-around">
                <div :class="data.inspectionResultsData2 ? 'p-col-6' : 'p-col-12'">
                  <Chart type="doughnut" :class="data.inspectionResultsData2 ? 'theme-first p-p-3' : ''" :data="data.inspectionResultsData1" :options="data.doughnutOptions"/>
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
              <h3 class="stats-card-title">Uszkodzenia modułów</h3>
            </template>
            <template #content>
              <div class="p-grid p-jc-around">
                <div :class="data.componentsFaultsData2 ? 'p-col-6' : 'p-col-12'">
                  <Chart type="doughnut" :class="data.componentsFaultsData2 ? 'theme-first p-p-3' : ''" :data="data.componentsFaultsData1" :options="data.doughnutOptions"/>
                </div>
                <div v-if="data.componentsFaultsData2" class="p-col-6">
                  <Chart type="doughnut" class="theme-second p-p-3" :data="data.componentsFaultsData2" :options="data.doughnutOptions"/>
                </div>
              </div>
            </template>
          </Card>
        </div>

        <div class="p-col-12" v-if="data.faultsDistributionLabels">
          <Card class="p-col-12 stats-card p-text-center">
            <template #title>
              <h3 class="stats-card-title">Rozkład uszkodzeń modułów</h3>
            </template>
            <template #content>
              <Chart type="line" :data="data.faultsDistributionData" :options="data.faultsDistributionOptions" :width="450"/>
            </template>
          </Card>
        </div>

        <div class="p-col-6 p-d-flex">
          <Card class="p-col-12 stats-card p-text-center">
            <template #title>
              <h3 class="stats-card-title">Najczęstsze usterki jakościowe</h3>
            </template>
            <template #content>
              <div class="p-grid p-jc-around">
                <div :class="data.commonQualitativeFaults2 ? 'p-col-6' : 'p-col-12'">
                  <div :class="data.commonQualitativeFaults2 ? 'theme-first p-p-3' : ''">
                    <div v-for="fault in data.commonQualitativeFaults1" :key="fault.id" class="p-mb-3">
                      <h4 class="p-m-0 p-mb-1">{{ fault.part }}</h4>
                      <p class="p-m-0">{{ fault.description}}</p>
                    </div>
                  </div>
                </div>
                <div class="p-col-6" v-if="data.commonQualitativeFaults2">
                  <div class="theme-second p-p-3'">
                    <div v-for="fault in data.commonQualitativeFaults2" :key="fault.id" class="p-mb-3">
                      <h4 class="p-m-0 p-mb-1">{{ fault.part }}</h4>
                      <p class="p-m-0">{{ fault.description}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </Card>
        </div>

        <div class="p-col-6 p-d-flex">
          <Card class="p-col-12 stats-card p-text-center">
            <template #title>
              <h3 class="stats-card-title">Najczęstsze usterki ilościowe</h3>
            </template>
            <template #content>
              <div class="p-grid p-jc-around">
                <div :class="data.commonQuantitativeFaults2 ? 'p-col-6' : 'p-col-12'">
                  <div :class="data.commonQuantitativeFaults2 ? 'theme-first p-p-3' : ''">
                    <div v-for="fault in data.commonQuantitativeFaults1" :key="fault.id" class="p-mb-3">
                      <h4 class="p-m-0 p-mb-1">{{ fault.part }}</h4>
                      <p class="p-m-0">{{ fault.description }}</p>
                    </div>
                  </div>
                </div>
                <div class="p-col-6" v-if="data.commonQuantitativeFaults2">
                  <div class="theme-second p-p-3">
                    <div v-for="fault in data.commonQuantitativeFaults2" :key="fault.id" class="p-mb-3">
                      <h4 class="p-m-0 p-mb-1">{{ fault.part }}</h4>
                      <p class="p-m-0">{{ fault.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </Card>
        </div>

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
    },
    filter: {
      type: String
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
        datasets: [{ data: props.analyticsData?.componentsFaultsData2?.values, backgroundColor }]
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
        labels: props.analyticsData?.faultsDistributionLabels,
        datasets: props.analyticsData?.faultsDistributionData2
          ? [
              {
                label: 'Filtr 1',
                data: props.analyticsData?.faultsDistributionData1,
                fill: false,
                borderColor: '#66BB6A',
                spanGaps: true
              },
              {
                label: 'Filtr 2',
                data: props.analyticsData?.faultsDistributionData2,
                fill: false,
                borderColor: '#0080d4',
                spanGaps: true
              }
            ]
          : [
              {
                label: 'Filtr 1',
                data: props.analyticsData?.faultsDistributionData1,
                fill: false,
                borderColor: '#66BB6A',
                spanGaps: true
              }
            ]
      },
      faultsDistributionOptions: {
        tooltips: {
          mode: 'index',
          callbacks: {
            label: function (tooltipItem, data) {
              const unit = props.filter === 'mileage' ? '[tyś. km]' : '[miesiące]'
              return `${data.labels[tooltipItem.index]} ${unit}: ${data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]}`
            }
          }
        },
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Średnia liczba usterek'
            }
          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: props.filter === 'mileage' ? 'Przebieg [tyś. km]' : 'Wiek pojazdu [miesiące]'
            }
          }]
        }
      },
      commonQualitativeFaults1: props.analyticsData?.commonQualitativeFaults1,
      commonQuantitativeFaults1: props.analyticsData?.commonQuantitativeFaults1,
      commonQualitativeFaults2: props.analyticsData?.commonQualitativeFaults2,
      commonQuantitativeFaults2: props.analyticsData?.commonQuantitativeFaults2,
      faultsDistributionLabels: props.analyticsData?.faultsDistributionLabels
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
  background-color: rgba(255, 255, 255, 0.9);
  color: #000;
}

.stats-card-title {
  font-size: 1.3rem;
  margin: 0;
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

.theme {
  font-size: 2rem;
  font-weight: 600;
}

.theme-first {
  border: 3px solid #66BB6A;
  border-radius: 6px;
}

.theme-second {
  border: 3px solid #0080d4;
  border-radius: 6px;
}
</style>
