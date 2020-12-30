<template>
  <Card class="p-col-12">
    <template #title>
      <h1 class="login-title p-text-center p-d-block">Dodaj nowe badanie techniczne</h1>
    </template>
    <template #content>
      <form @submit.prevent="onSubmit" class="p-grid">
        <div class="p-col-4">
          <div class="p-field p-mb-2 p-fluid">
            <label for="car">Model pojazdu</label>
            <CascadeSelect
              id="car"
              v-model="car"
              :options="allCarsOptions"
              optionLabel="displayName"
              optionValue="id"
              optionGroupLabel="name"
              :optionGroupChildren="['models', 'variants']"
              :class="carError ? 'p-invalid' : ''"
              aria-describedby="car-help"
              :disabled="allCarsLoading || allCarsError"
            >
              <template #option="slotProps">
                <div class="country-item">
                  <span>{{ slotProps.option.name || slotProps.option.cname }}</span>
                </div>
              </template>
            </CascadeSelect>
              <small v-if="carError" id="car-help" class="p-invalid">{{ carError }}</small>
          </div>
        </div>
        <div class="p-field p-col-4 p-fluid">
          <label for="mileage">Przebieg</label>
          <div class="p-inputgroup">
            <InputNumber
              v-model="mileage"
              id="mileage"
              :min="0"
              aria-describedby="mileage-help"
              :class="mileageError ? 'p-invalid' : ''"
              class="p-d-block"
            />
            <span class="p-inputgroup-addon">km</span>
          </div>
          <small v-if="mileageError" id="mileage-help" class="p-invalid">{{ mileageError }}</small>
        </div>
        <div class="p-col-4">
          <div class="p-field p-mb-2 p-fluid">
            <label for="firstRegistrationDate">Data pierwszej rejestracji</label>
            <Calendar
              id="firstRegistrationDate"
              v-model="firstRegistrationDate"
              view="month"
              dateFormat="mm.yy"
              :yearNavigator="true"
              :maxDate="new Date()"
              :yearRange="`1900:${new Date().getFullYear()}`"
              :class="firstRegistrationDateError ? 'p-invalid' : ''"
              aria-describedby="firstRegistrationDate-help"
              :showIcon="true"
              :manualInput="false"
            />
            <small v-if="firstRegistrationDateError" id="firstRegistrationDate-help" class="p-invalid">{{ firstRegistrationDateError }}</small>
          </div>
        </div>
        <Divider></Divider>
        <Timeline
          :value="allComponents"
          align="alternate"
          layout="horizontal"
          dataKey="id"
        >
          <template #marker="slotProps">
            <Button
              :label="String(slotProps.item.id)"
              class="p-button-rounded p-jc-center"
              :class="timelineStatusClass(slotProps.item)"
              @click="handleComponentChange(slotProps.item)"
              v-tooltip.top="slotProps.item.name"
            />
          </template>
        </Timeline>

        <div class="p-col-12">
          <h2 class="p-d-block p-text-center">{{ activeComponent && activeComponent.name }}</h2>
          <DataTable :value="chosenQualitativeFaultsByComponent" class="datatable">
            <template #header>
              <Dropdown v-model="form.qualitativeFault" :options="qualitativeFaultsByComponent" :filter="true" placeholder="Usterki jakościowe" :showClear="true" @change="handleQualitativeFaultChange">
                <template #option="slotProps">
                  <div class="country-item">
                    <div>{{ slotProps.option.part }}</div>
                    <div>{{ slotProps.option.description }}</div>
                    <Divider class="p-mb-0 p-mt-2"/>
                  </div>
                </template>
              </Dropdown>
            </template>
            <Column field="part" header="Część"></Column>
            <Column field="description" header="Opis"></Column>
            <Column field="dangerLevels" header="Ocena usterki">
              <template #body="slotProps">
                <SelectButton
                  v-model="slotProps.data.dangerLevel"
                  :options="dangerLevels(slotProps.data.dangerLevels)"
                  optionLabel="name"
                  optionValue="value"
                  optionDisabled="disabled"
                  v-tooltip.top="'UD - usterka drobna\nUI - usterka istotna\nUSZ - usterka stwarzająca zagrożenie'"
                />
              </template>
            </Column>
            <Column>
              <template #body="slotProps">
                <Button icon="pi pi-times" class="p-button-rounded p-button-danger" @click="onQualitativeFaultRemove(slotProps.data.id)"/>
              </template>
            </Column>
          </DataTable>

          <DataTable :value="chosenQuantitativeFaultsByComponent">
            <template #header>
              <Dropdown v-model="form.quantitativeFault" :options="quantitativeFaultsByComponent" :filter="true" placeholder="Usterki ilościowe" :showClear="true" @change="handleQuantitativeFaultChange">
                <template #option="slotProps">
                  <div class="country-item">
                    <div>{{ slotProps.option.part }}</div>
                    <div>{{ slotProps.option.description }}</div>
                    <Divider class="p-mb-0 p-mt-2"/>
                  </div>
                </template>
              </Dropdown>
            </template>
            <Column field="part" header="Część"></Column>
            <Column field="description" header="Opis"></Column>
            <Column header="Wartość">
              <template #body="slotProps">
                <div class="p-field p-fluid p-m-0 p-p-0">
                  <div class="p-inputgroup">
                    <InputNumber
                      v-model="slotProps.data.value"
                      id="faultValue"
                      aria-describedby="faultValue-help"
                      class="p-d-block"
                      mode="decimal"
                      :minFractionDigits="1"
                      :maxFractionDigits="2"
                      :class="faultValueClass(slotProps.data)"
                      v-tooltip.top="faultValueTooltip(slotProps.data)"
                    />
                    <span class="p-inputgroup-addon">{{ slotProps.data.unit }}</span>
                  </div>
                </div>
              </template>
            </Column>
            <Column>
              <template #body="slotProps">
                <Button icon="pi pi-times" class="p-button-rounded p-button-danger" @click="onQuantitativeFaultRemove(slotProps.data.id)"/>
              </template>
            </Column>
          </DataTable>
        </div>

        <Button v-show="areAllComponentsFilled" label="Dodaj" type="submit" :icon="loading ? 'pi pi-spin pi-spinner' : 'pi pi-check'" iconPos="right" />
      </form>
    </template>
  </Card>
</template>

<script>
import { ref, watch, computed, watchEffect } from 'vue'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { useToast } from 'primevue/usetoast'
import useApollo from '@/components/TheNewInspectionForm.graphql.vue'
import { useRoute, onBeforeRouteLeave } from 'vue-router'
import { useConfirm } from 'primevue/useConfirm'

export default ({
  setup () {
    const toast = useToast()
    const route = useRoute()
    const confirm = useConfirm()
    const {
      allCarsOptions: cars, allCarsLoading, allCarsError,
      qualitativeFaults, quantitativeFaults, allFaultsLoading, allFaultsError,
      allComponents, allComponentsLoading
    } = useApollo()
    const { handleSubmit, meta } = useForm({
      initialValues: {
        car: null,
        mileage: null,
        firstRegistrationDate: ''
      }
    })

    onBeforeRouteLeave((to, from, next) => {
      confirm.require({
        message: 'Czy na pewno chcesz wyjść? Utracisz wszystkie dane.',
        header: 'Potwierdzenie',
        icon: 'pi pi-exclamation-triangle',
        accept: () => { next(true) },
        reject: () => { next(false) }
      })
    })

    const allCarsOptions = ref([])
    watchEffect(() => {
      allCarsOptions.value = cars.value
    })

    const componentsStatus = ref({})
    const activeComponent = ref({})

    const areAllComponentsFilled = computed(() => {
      const chosenComponents = Object.values(componentsStatus.value)
      const isLengthEqual = chosenComponents?.length === allComponents.value?.length
      let isSuccessStatus = true
      chosenComponents.forEach(item => {
        if (item.status !== 'p-button-success') {
          isSuccessStatus = false
        }
      })
      return isLengthEqual && isSuccessStatus
    })

    const form = ref({
      qualitativeFault: null,
      quantitativeFault: null
    })

    // qualitativeFaults
    const chosenQualitativeFaults = ref([])

    const chosenQualitativeFaultsByComponent = computed(() => {
      return chosenQualitativeFaults.value?.filter(item => item?.component?.id === activeComponent.value?.id)
    })

    const qualitativeFaultsByComponent = computed(() => {
      const x = qualitativeFaults.value?.filter(item => item?.component?.id === activeComponent.value?.id)
      const chosenQualitativeFaultsIds = chosenQualitativeFaults.value?.map(item => { return item?.id })
      return x.filter(item => !chosenQualitativeFaultsIds?.includes(item?.id))
    })

    const handleQualitativeFaultChange = (e) => {
      chosenQualitativeFaults.value?.unshift({ ...e.value, dangerLevel: null })
      form.value.qualitativeFault = null
    }

    const onQualitativeFaultRemove = (id) => {
      const removeIndex = chosenQualitativeFaults.value?.findIndex(item => item?.id === id)
      chosenQualitativeFaults.value?.splice(removeIndex, 1)
    }

    // quantitativeFaults
    const chosenQuantitativeFaults = ref([])

    const chosenQuantitativeFaultsByComponent = computed(() => {
      return chosenQuantitativeFaults.value?.filter(item => item.component.id === activeComponent.value?.id)
    })

    const quantitativeFaultsByComponent = computed(() => {
      const x = quantitativeFaults.value?.filter(item => item?.component?.id === activeComponent?.value?.id)
      const chosenQuantitativeFaultsIds = chosenQuantitativeFaults.value?.map(item => { return item?.id })
      return x.filter(item => !chosenQuantitativeFaultsIds?.includes(item?.id))
    })

    const handleQuantitativeFaultChange = (e) => {
      chosenQuantitativeFaults.value?.unshift({ ...e.value, value: null })
      form.value.quantitativeFault = null
    }

    const onQuantitativeFaultRemove = (id) => {
      const removeIndex = chosenQuantitativeFaults.value?.findIndex(item => item?.id === id)
      chosenQuantitativeFaults.value?.splice(removeIndex, 1)
    }

    const faultValueTooltip = (fault) => {
      let condition
      if (Number.isFinite(fault.minValue) && !Number.isFinite(fault.maxValue)) {
        condition = `>${fault.minValue}`
      } else if (!Number.isFinite(fault.minValue) && Number.isFinite(fault.maxValue)) {
        condition = `<${fault.maxValue}`
      } else if (Number.isFinite(fault.minValue) && Number.isFinite(fault.maxValue)) {
        condition = `${fault.minValue}>x>${fault.maxValue}`
      }

      if (condition) {
        return `Prawidłowy przedział ${condition}`
      }
    }

    const faultValueClass = (fault) => {
      if (!Number.isFinite(fault.value)) {
        return ''
      }

      const minCorrect = Number.isFinite(fault.minValue) && fault.value >= fault.minValue
      const maxCorrect = Number.isFinite(fault.maxValue) && fault.value <= fault.maxValue

      if (minCorrect && maxCorrect) {
        return 'value-success'
      } else {
        return 'value-error'
      }
    }

    watch([chosenQuantitativeFaults.value, chosenQualitativeFaults.value], () => {
      Object.keys(componentsStatus.value).forEach(id => {
        componentsStatus.value[id].status = 'p-button-success'
      })

      chosenQuantitativeFaults.value.forEach(fault => {
        if (fault?.value === null) {
          componentsStatus.value[fault?.component?.id].status = 'p-button-danger'
        }
      })
      chosenQualitativeFaults.value.forEach(fault => {
        if (fault?.dangerLevel === null) {
          componentsStatus.value[fault?.component?.id].status = 'p-button-danger'
        }
      })
    })

    const handleComponentChange = (component) => {
      activeComponent.value = component
      if (!componentsStatus.value[component.id]?.status) {
        componentsStatus.value[component.id] = { status: 'p-button-success' }
      }
    }

    watchEffect(() => {
      if (allComponents.value[0]) {
        activeComponent.value = allComponents.value[0]
        handleComponentChange(allComponents.value[0])
      }
    })

    const timelineStatusClass = (item) => {
      const status = (componentsStatus.value[item?.id] && componentsStatus.value[item?.id]?.status) || 'p-button-info'
      const isActive = item?.id === activeComponent.value?.id
      return [status, { 'component-active': isActive }]
    }

    const loading = ref(false)

    const messageText = ref('')
    const { value: car, errorMessage: carError } = useField('car', yup.number().required())
    const { value: mileage, errorMessage: mileageError } = useField('mileage', yup.mixed().required())
    const { value: firstRegistrationDate, errorMessage: firstRegistrationDateError } = useField('firstRegistrationDate', yup.string().required())

    const onSubmit = handleSubmit(async (values) => {
      try {
        const qualitativeFaults = chosenQualitativeFaults.value.map(fault => ({ qualitativeFaultId: fault.id, dangerLevel: fault.dangerLevel }))
        const quantitativeFaults = chosenQuantitativeFaults.value.map(fault => ({ quantitativeFaultId: fault.id, value: fault.value }))
        console.log({ ...values }, qualitativeFaults, quantitativeFaults)
        toast.add({ severity: 'success', summary: 'Sukces!', detail: 'Dodano nowe badanie techniczne', life: 4000 })
      } catch (e) {
        toast.add({
          severity: 'error',
          summary: 'Błąd!',
          detail: 'Nieoczekiwany błąd! Skontaktuj się z administratorem',
          life: 4000
        })
      }
    })

    const dangerLevels = ref((dangerLevels) => {
      return [
        { name: 'UD', value: 'MINOR', disabled: !dangerLevels.includes('MINOR') },
        { name: 'UI', value: 'SIGNIFICANT', disabled: !dangerLevels.includes('SIGNIFICANT') },
        { name: 'USZ', value: 'MAJOR', disabled: !dangerLevels.includes('MAJOR') }
      ]
    })

    return {
      car,
      carError,
      allCarsOptions,
      allCarsLoading,
      allCarsError,
      qualitativeFaults,
      handleQualitativeFaultChange,
      chosenQualitativeFaults,
      onQualitativeFaultRemove,
      chosenQualitativeFaultsByComponent,
      qualitativeFaultsByComponent,
      quantitativeFaults,
      handleQuantitativeFaultChange,
      chosenQuantitativeFaults,
      onQuantitativeFaultRemove,
      chosenQuantitativeFaultsByComponent,
      quantitativeFaultsByComponent,
      allFaultsLoading,
      allFaultsError,
      allComponents,
      allComponentsLoading,
      mileage,
      mileageError,
      firstRegistrationDate,
      firstRegistrationDateError,
      onSubmit,
      meta,
      loading,
      messageText,
      dangerLevels,
      form,
      handleComponentChange,
      componentsStatus,
      activeComponent,
      faultValueTooltip,
      faultValueClass,
      areAllComponentsFilled,
      timelineStatusClass
    }
  }
})

</script>

<style scoped lang="scss">
.login-title {
  font-size: 1.2em;
}

.component-active {
  box-shadow: 0 0 10px 2px var(--text-color) !important;
}

.p-selectbutton.p-buttonset {
  width: max-content;
}

.datatable {
  background-color: red;
}

.value-success :deep(.p-inputnumber-input) {
  color: green;
}

.value-error :deep(.p-inputnumber-input) {
  color: red;
}

</style>
