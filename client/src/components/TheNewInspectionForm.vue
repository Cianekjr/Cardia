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
              v-model="carId"
              :options="allCarsOptions"
              optionLabel="displayName"
              optionValue="id"
              optionGroupLabel="name"
              :optionGroupChildren="['models', 'variants']"
              :class="carIdError ? 'p-invalid' : ''"
              aria-describedby="car-help"
              :disabled="allCarsLoading || allCarsError"
            >
              <template #option="slotProps">
                <div class="country-item">
                  <span>{{ slotProps.option.name || slotProps.option.cname }}</span>
                </div>
              </template>
            </CascadeSelect>
            <small v-if="carIdError" id="car-help" class="p-invalid">
              {{ carIdError }}
            </small>
          </div>
        </div>
        <div class="p-field p-col-4 p-fluid">
          <label for="mileage">Przebieg</label>
          <div class="p-inputgroup">
            <InputNumber
              v-model="mileage"
              id="mileage"
              :min="0"
              locale="pl-PL"
              aria-describedby="mileage-help"
              :class="mileageError ? 'p-invalid' : ''"
              class="p-d-block"
            />
            <span class="p-inputgroup-addon">km</span>
          </div>
          <small v-if="mileageError" id="mileage-help" class="p-invalid">
            {{ mileageError }}
          </small>
        </div>
        <div class="p-col-4">
          <div class="p-field p-mb-2 p-fluid">
            <label for="firstRegistrationDate">Data pierwszej rejestracji</label>
            <Calendar
              id="firstRegistrationDate"
              v-model="firstRegistrationDate"
              dateFormat="dd.mm.yy"
              :maxDate="new Date()"
              :yearRange="`1900:${new Date().getFullYear()}`"
              :class="firstRegistrationDateError ? 'p-invalid' : ''"
              aria-describedby="firstRegistrationDate-help"
              :showIcon="true"
              :manualInput="false"
            />
            <small
              v-if="firstRegistrationDateError"
              id="firstRegistrationDate-help"
              class="p-invalid">
              {{ firstRegistrationDateError }}
            </small>
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
              :label="String(slotProps.index + 1)"
              class="p-button-rounded p-jc-center"
              :class="timelineStatusClass(slotProps.item)"
              @click="handleComponentChange(slotProps.item)"
              v-tooltip.top="slotProps.item.name"
            />
          </template>
        </Timeline>

        <div class="p-col-12">
          <h2 class="p-d-block p-text-center">{{ activeComponent && activeComponent.name }}</h2>
          <DataTable
            :value="chosenQualitativeFaultsByComponent"
            v-show="qualitativeFaultsByComponent.length"
          >
            <template #header>
              <Dropdown
                v-model="form.qualitativeFault"
                :options="qualitativeFaultsByComponent"
                placeholder="Usterki jakościowe"
                :showClear="true"
                @change="handleQualitativeFaultChange"
              >
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
                <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-danger"
                  @click="onQualitativeFaultRemove(slotProps.data.id)"
                />
              </template>
            </Column>
          </DataTable>

          <DataTable :value="chosenQuantitativeFaultsByComponent" v-show="quantitativeFaultsByComponent.length">
            <template #header>
              <Dropdown
                v-model="form.quantitativeFault"
                :options="quantitativeFaultsByComponent"
                placeholder="Usterki ilościowe"
                :showClear="true"
                @change="handleQuantitativeFaultChange"
              >
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
                      locale="pl-PL"
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
                <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-danger"
                  @click="onQuantitativeFaultRemove(slotProps.data.id)"
                />
              </template>
            </Column>
          </DataTable>
        </div>

        <div class="p-col-12 p-d-flex p-jc-end">
          <Button
            :disabled="!meta.valid || !areAllComponentsFilled"
            label="Dodaj"
            type="submit"
            :icon="createInspectionLoading ? 'pi pi-spin pi-spinner' : 'pi pi-check'"
            iconPos="right" />
        </div>
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
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { useConfirm } from 'primevue/useConfirm'
import { differenceInMonths } from 'date-fns'

export default ({
  setup () {
    const toast = useToast()
    const confirm = useConfirm()
    const { push } = useRouter()
    const {
      allCarsOptions: cars, allCarsLoading, allCarsError,
      qualitativeFaults, quantitativeFaults, allFaultsLoading, allFaultsError,
      allComponents, allComponentsLoading,
      createInspection, createInspectionLoading
    } = useApollo()
    const { handleSubmit, meta } = useForm({
      initialValues: {
        carId: null,
        mileage: null,
        firstRegistrationDate: ''
      }
    })
    const isIspectionCreated = ref(false)

    onBeforeRouteLeave((to, from, next) => {
      if (isIspectionCreated.value) {
        next(true)
      } else {
        confirm.require({
          message: 'Czy na pewno chcesz wyjść? Utracisz wszystkie dane.',
          header: 'Potwierdzenie',
          icon: 'pi pi-exclamation-triangle',
          accept: () => { next(true) },
          reject: () => { next(false) }
        })
      }
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
        return `Dopuszczalny przedział ${condition}`
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

    const { value: carId, errorMessage: carIdError } = useField('carId', yup.number().required())
    const { value: mileage, errorMessage: mileageError } = useField('mileage', yup.mixed().required())
    const {
      value: firstRegistrationDate,
      errorMessage: firstRegistrationDateError
    } = useField('firstRegistrationDate', yup.string().required())

    const onSubmit = handleSubmit(async (values) => {
      try {
        const inspectionQualitativeFaults = chosenQualitativeFaults.value.map(fault => (
          { qualitativeFaultId: fault.id, dangerLevel: fault.dangerLevel }
        ))
        const inspectionQuantitativeFaults = chosenQuantitativeFaults.value.map(fault => (
          { quantitativeFaultId: fault.id, value: fault.value }
        ))

        const { carId, mileage, firstRegistrationDate } = values
        const age = differenceInMonths(new Date(), firstRegistrationDate) + 1
        const inspection = await createInspection({
          input: {
            carId, mileage, age, inspectionQualitativeFaults, inspectionQuantitativeFaults
          }
        })

        isIspectionCreated.value = true
        const isInspectionPositive = inspection?.data?.createInspection?.result === 'POSITIVE'
        await push({ name: 'Home' })
        confirm.close()
        toast.add({
          severity: isInspectionPositive ? 'success' : 'info',
          summary: 'Dodano!',
          detail: `Badanie techniczne zakończone wynikiem ${isInspectionPositive ? 'pozytywnym' : 'negatywnym'}`,
          life: 4000
        })
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
      carId,
      carIdError,
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
      dangerLevels,
      form,
      handleComponentChange,
      componentsStatus,
      activeComponent,
      faultValueTooltip,
      faultValueClass,
      areAllComponentsFilled,
      timelineStatusClass,
      createInspectionLoading
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
