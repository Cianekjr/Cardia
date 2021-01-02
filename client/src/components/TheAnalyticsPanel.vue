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
                <div class="theme-first">{{ data.allInspectionsCount[0] }}</div>
                <div class="theme-second" v-if="data.allInspectionsCount[1]">{{ data.allInspectionsCount[1] }}</div>
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
                <div class="theme-first">{{ data.allStationsCount[0] }}</div>
                <div class="theme-second" v-if="data.allStationsCount[1]">{{ data.allStationsCount[1] }}</div>
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
                <Chart type="doughnut" class="p-col-6" :data="data.inspectionResultsData[0]" :options="data.doughnutOptions"/>
                <Chart v-if="data.inspectionResultsData[1]" type="doughnut" class="p-col-6" :data="data.inspectionResultsData[1]" :options="data.doughnutOptions"/>
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
                <Chart type="doughnut" class="p-col-6" :data="data.componentsFaultsData[0]" :options="data.doughnutOptions"/>
                <Chart v-if="data.componentsFaultsData[1]" type="doughnut" class="p-col-6" :data="data.componentsFaultsData[1]" :options="data.doughnutOptions"/>
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
    const data = computed(() => ({
      allInspectionsCount: props.analyticsData?.allInspectionsCount || [],
      allStationsCount: props.analyticsData?.allStationsCount || [],
      inspectionResultsData: [
        {
          labels: ['Pozytywne', 'Negatywne'],
          datasets: [
            {
              data: props.analyticsData?.inspectionResultsData?.[0] || [],
              backgroundColor: ['rgba(102, 187, 106, 1)', 'rgba(102, 187, 106, .5)']
            }
          ]
        },
        props.analyticsData?.inspectionResultsData?.[1] && {
          labels: ['Pozytywne', 'Negatywne'],
          datasets: [
            {
              data: props.analyticsData?.allStationsCount?.[1] || [],
              backgroundColor: ['rgba(66, 165, 245, 1)', 'rgba(66, 165, 245, .5)']
            }
          ]
        }
      ],
      componentsFaultsData: [
        {
          labels: ['Układ hamulcowy', 'Układ kierowniczy', 'Zawieszenie', 'Światła'],
          datasets: [
            {
              data: [20, 50, 20, 10]
            }
          ]
        },
        {
          labels: ['Układ hamulcowy', 'Układ kierowniczy', 'Zawieszenie', 'Światła'],
          datasets: [
            {
              data: [15, 35, 25, 25]
            }
          ]
        }
      ],
      doughnutOptions: {
        legend: {
          position: 'bottom'
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
        aspectRatio: 5,
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
  background-color: #eeeeee;
  color: black;

  .card-icon {
    border: 2px solid var(--surface-e);
    background-color: #eeeeee;
  }
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
  color: #66BB6A;
}

.theme-second {
  color: #0080d4;
}

.theme-first, .theme-second {
  font-size: 2rem;
  font-weight: 600;
}
</style>
