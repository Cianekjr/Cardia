<template>
  <Card class="p-col-12 p-mb-3" ref="cardElement">
    <template #content>
      <Fieldset legend="Filtry" :toggleable="true" v-model:collapsed="isCollapsed">
        <form class="p-grid p-col-12 nested-grid">

          <div class="p-col-12">
            <div class="box">
              <div class="p-field-radiobutton">
                <RadioButton id="city1" name="city" value="mileage" v-model="filterType" />
                <label for="city1">Przebieg</label>
              </div>
              <div class="p-field-radiobutton">
                <RadioButton id="city2" name="city" value="age" v-model="filterType" />
                <label for="city2">Wiek</label>
              </div>
            </div>
          </div>

          <div class="p-col-12">
            <div class="box p-grid">
              <div class="p-field p-fluid p-col-6">
                <label for="filterMin">{{ isMileageFilter ? 'Przebieg od' : 'Wiek od'}}</label>
                <div class="p-inputgroup">
                  <InputNumber
                    v-model="filterMin"
                    id="filterMin"
                    locale="pl-PL"
                    aria-describedby="filterMin-help"
                    class="p-d-block"
                    :min="0"
                    :max="filterMax"
                  />
                  <span class="p-inputgroup-addon">{{ isMileageFilter ? 'km' : 'miesiące'}}</span>
                </div>
              </div>
              <div class="p-field p-fluid p-col-6">
                <label for="filterMax">{{ isMileageFilter ? 'Przebieg do' : 'Wiek do'}}</label>
                <div class="p-inputgroup">
                  <InputNumber
                    v-model="filterMax"
                    id="filterMax"
                    locale="pl-PL"
                    aria-describedby="filterMax-help"
                    class="p-d-block"
                    :min="filterMin"
                    :max="2147483647"
                  />
                  <span class="p-inputgroup-addon">{{ isMileageFilter ? 'km' : 'miesiące'}}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="p-col-12">
            <div class="box p-grid">
              <div class="p-field p-fluid p-col-6">
                <label for="createdAtMin">Data badania od</label>
                <Calendar
                  id="createdAtMin"
                  v-model="createdAtMin"
                  dateFormat="dd.mm.yy"
                  aria-describedby="createdAtMin-help"
                  :showIcon="true"
                  :manualInput="false"
                  :showButtonBar="true"
                  :maxDate="createdAtMax"
                />
              </div>
              <div class="p-field p-fluid p-col-6">
                <label for="createdAtMax">Data badania do</label>
                <Calendar
                  id="createdAtMax"
                  v-model="createdAtMax"
                  dateFormat="dd.mm.yy"
                  aria-describedby="createdAtMax-help"
                  :showIcon="true"
                  :manualInput="false"
                  :showButtonBar="true"
                  :minDate="createdAtMin"
                />
              </div>
            </div>
          </div>

          <div class="p-col-12">
            <div class="box p-grid">
              <div class="p-field p-fluid p-col-6">
                <label for="engineCapacityMin">Pojemność silnika od</label>
                <div class="p-inputgroup">
                  <InputNumber
                    v-model="engineCapacityMin"
                    id="engineCapacityMin"
                    locale="pl-PL"
                    aria-describedby="engineCapacityMin-help"
                    class="p-d-block"
                    :min="0"
                    :max="engineCapacityMax"
                  />
                  <span class="p-inputgroup-addon" v-html="'cm<sup>3</sup>'"></span>
                </div>
              </div>
              <div class="p-field p-fluid p-col-6">
                <label for="engineCapacityMax">Pojemność silnika do</label>
                <div class="p-inputgroup">
                  <InputNumber
                    v-model="engineCapacityMax"
                    id="engineCapacityMax"
                    locale="pl-PL"
                    aria-describedby="engineCapacityMax-help"
                    class="p-d-block"
                    :min="engineCapacityMin"
                    :max="2147483647"
                  />
                  <span class="p-inputgroup-addon" v-html="'cm<sup>3</sup>'"></span>
                </div>
              </div>
            </div>
          </div>

          <div class="p-col-12">
            <div class="box p-grid">
              <div class="p-field p-fluid p-col-6">
                <label for="enginePowerMin">Moc silnika od</label>
                <div class="p-inputgroup">
                  <InputNumber
                    v-model="enginePowerMin"
                    id="enginePowerMin"
                    locale="pl-PL"
                    aria-describedby="enginePowerMin-help"
                    class="p-d-block"
                    :min="0"
                    :max="enginePowerMax"
                  />
                  <span class="p-inputgroup-addon">KM</span>
                </div>
              </div>
              <div class="p-field p-fluid p-col-6">
                <label for="enginePowerMax">Moc silnika do</label>
                <div class="p-inputgroup">
                  <InputNumber
                    v-model="enginePowerMax"
                    id="enginePowerMax"
                    locale="pl-PL"
                    aria-describedby="enginePowerMax-help"
                    class="p-d-block"
                    :min="enginePowerMin"
                    :max="2147483647"
                  />
                  <span class="p-inputgroup-addon">KM</span>
                </div>
              </div>
            </div>
          </div>

          <Divider align="left" type="dashed">
            <h3 class="theme-first">Pierwszy filtr</h3>
          </Divider>

          <section class="p-col-12">
            <div class="box p-grid">
              <div class="p-field p-fluid box p-col-3">
                <label>Typ nadwozia</label>
                <Dropdown v-model="bodyTypeId1" :options="bodyTypesOptions" :showClear="true" optionLabel="name" optionValue="id" :disabled="areFiltersDisabled"/>
              </div>
              <div class="p-field p-fluid box p-col-3">
                <label>Rodzaj silnika</label>
                <Dropdown v-model="engineTypeId1" :options="engineTypesOptions" :showClear="true" optionLabel="name" optionValue="id" :disabled="areFiltersDisabled"/>
              </div>
              <div class="p-field p-fluid box p-col-3">
                <label>Marka</label>
                <Dropdown v-model="makeId1" :options="makesOptions" :showClear="true" optionLabel="name" optionValue="id" :disabled="areFiltersDisabled"/>
              </div>
              <div class="p-field p-fluid box p-col-3">
                <label>Model</label>
                <Dropdown v-model="modelId1" :options="modelsOptions1" :showClear="true" optionLabel="name" optionValue="id" :disabled="areFiltersDisabled || modelsOptions1.length === 0"/>
              </div>
            </div>
          </section>

          <Divider align="left" type="dashed">
            <h3 class="theme-second">Drugi filtr</h3>
          </Divider>

          <section class="p-col-12">
            <div class="box p-grid">
              <div class="p-field p-fluid box p-col-3">
                <label>Typ nadwozia</label>
                <Dropdown v-model="bodyTypeId2" :options="bodyTypesOptions" :showClear="true" optionLabel="name" optionValue="id" :disabled="areFiltersDisabled"/>
              </div>
              <div class="p-field p-fluid box p-col-3">
                <label>Rodzaj silnika</label>
                <Dropdown v-model="engineTypeId2" :options="engineTypesOptions" :showClear="true" optionLabel="name" optionValue="id" :disabled="areFiltersDisabled"/>
              </div>
              <div class="p-field p-fluid box p-col-3">
                <label>Marka</label>
                <Dropdown v-model="makeId2" :options="makesOptions" optionLabel="name" :showClear="true" optionValue="id" :disabled="areFiltersDisabled"/>
              </div>
              <div class="p-field p-fluid box p-col-3">
                <label>Model</label>
                <Dropdown v-model="modelId2" :options="modelsOptions2" optionLabel="name" :showClear="true" optionValue="id" :disabled="areFiltersDisabled || modelsOptions2.length === 0"/>
              </div>
            </div>
          </section>

          <div class="p-col-12 p-d-flex p-jc-end">
            <Button label="Wyczyść filtry" class="p-button-danger p-mr-5" icon="pi pi-times" iconPos="right" @click="handleReset" />
            <Button label="Pokaż" icon="pi pi-chart-line" iconPos="right" @click="onSubmit" />
          </div>

        </form>
      </Fieldset>
    </template>
  </Card>
</template>

<script>
import { ref, computed, watch, toRefs } from 'vue'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import useApollo from '@/components/TheAnalyticsFilters.graphql'

export default ({
  props: {
    analyticsData: {
      type: Object,
      required: true
    }
  },
  setup (props, { emit }) {
    const { filtersBodyTypes, filtersEngineTypes, filtersMakes, filtersModels, analyticsFiltersError, analyticsFiltersLoading } = useApollo()
    const areFiltersDisabled = computed(() => !!(analyticsFiltersError.value || analyticsFiltersLoading.value))

    const isCollapsed = ref(true)
    const cardElement = ref()
    const analyticsData = toRefs(props).analyticsData

    watch(analyticsData, () => {
      window.setTimeout(() => {
        isCollapsed.value = true
      }, 200)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })

    const { handleReset, values: formData } = useForm({
      initialValues: {
        filterMax: undefined,
        filterType: 'mileage',
        filterMin: undefined,
        createdAtMin: undefined,
        createdAtMax: undefined,
        bodyTypeId1: undefined,
        makeId1: undefined,
        modelId1: undefined,
        engineTypeId1: undefined,
        bodyTypeId2: undefined,
        makeId2: undefined,
        modelId2: undefined,
        engineTypeId2: undefined
      }
    })

    const onSubmit = () => {
      const { filterType, filterMin, filterMax, ...data } = formData || {}
      const normalizedData = { ...data, filterType }
      if (filterType === 'mileage') {
        normalizedData.mileageMin = filterMin
        normalizedData.mileageMax = filterMax
      } else if (filterType === 'age') {
        normalizedData.ageMin = filterMin
        normalizedData.ageMax = filterMax
      }

      for (const [key, value] of Object.entries(normalizedData)) {
        if (value === null) {
          normalizedData[key] = undefined
        }
      }

      emit('updateFiltersData', normalizedData)
    }

    const { value: filterType } = useField('filterType', yup.number())
    const { value: filterMin } = useField('filterMin', yup.number())
    const { value: filterMax } = useField('filterMax', yup.number())
    const { value: createdAtMin } = useField('createdAtMin', yup.number())
    const { value: createdAtMax } = useField('createdAtMax', yup.number())
    const { value: engineCapacityMin } = useField('engineCapacityMin', yup.number())
    const { value: engineCapacityMax } = useField('engineCapacityMax', yup.number())
    const { value: enginePowerMin } = useField('enginePowerMin', yup.number())
    const { value: enginePowerMax } = useField('enginePowerMax', yup.number())

    const { value: bodyTypeId1 } = useField('bodyTypeId1', yup.number())
    const { value: makeId1 } = useField('makeId1', yup.number())
    const { value: modelId1 } = useField('modelId1', yup.number())
    const { value: engineTypeId1 } = useField('engineTypeId1', yup.number())

    const { value: bodyTypeId2 } = useField('bodyTypeId2', yup.number())
    const { value: makeId2 } = useField('makeId2', yup.number())
    const { value: modelId2 } = useField('modelId2', yup.number())
    const { value: engineTypeId2 } = useField('engineTypeId2', yup.number())

    const isMileageFilter = computed(() => filterType.value === 'mileage')

    watch(filterType, () => {
      filterMin.value = undefined
      filterMax.value = undefined
    })

    const bodyTypesOptions = computed(() => {
      return filtersBodyTypes.value
    })

    const engineTypesOptions = computed(() => {
      return filtersEngineTypes.value
    })

    const makesOptions = computed(() => {
      return filtersMakes.value
    })

    const modelsOptions1 = computed(() => {
      return filtersModels.value.filter(model => model.make.id === makeId1?.value)
    })

    const modelsOptions2 = computed(() => {
      return filtersModels.value.filter(model => model.make.id === makeId2?.value)
    })

    return {
      isCollapsed,
      filterType,
      isMileageFilter,
      filterMin,
      filterMax,
      bodyTypesOptions,
      makesOptions,
      modelsOptions1,
      modelsOptions2,
      engineTypesOptions,
      createdAtMin,
      createdAtMax,
      engineCapacityMin,
      engineCapacityMax,
      enginePowerMin,
      enginePowerMax,
      areFiltersDisabled,
      bodyTypeId1,
      makeId1,
      modelId1,
      engineTypeId1,
      bodyTypeId2,
      makeId2,
      modelId2,
      engineTypeId2,
      handleReset,
      onSubmit,
      cardElement
    }
  }
})

</script>

<style scoped lang="scss">
.theme-first {
  color: #66BB6A;
}

.theme-second {
  color: #0080d4;
}
</style>
