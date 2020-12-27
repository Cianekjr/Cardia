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
              :options="allCars"
              optionLabel="displayName"
              optionValue="id"
              optionGroupLabel="name"
              dataKey="id"
              :optionGroupChildren="['models', 'variants']"
              :class="carError ? 'p-invalid' : ''"
              aria-describedby="car-help"
              :disabled="allCarsLoading"
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
              yearRange="1900:2030"
              :class="firstRegistrationDateError ? 'p-invalid' : ''"
              aria-describedby="firstRegistrationDate-help"
              :showIcon="true"
              :manualInput="false"
            />
            <small v-if="firstRegistrationDateError" id="firstRegistrationDate-help" class="p-invalid">{{ firstRegistrationDateError }}</small>
          </div>
        </div>
        <div class="p-col-4"></div>
        <Button label="Dodaj" type="submit" :icon="loading ? 'pi pi-spin pi-spinner' : 'pi pi-check'" iconPos="right" />
      </form>
    </template>
  </Card>
</template>

<script lang="ts">
import { ref, watch } from 'vue'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { useQuery, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useToast } from 'primevue/usetoast'

export default ({
  setup () {
    const toast = useToast()
    const { result, loading: allCarsLoading } = useQuery(gql`
      query getAllCars {
        getAllCars {
          id
          model {
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
          engineType {
            id
            name
          }
          engineCapacity
          enginePower
        }
      }
    `)

    const allCars = ref([])

    const allCarsResult = useResult(result)

    watch(allCarsResult, () => {
      if (!allCarsResult.value) {
        allCars.value = []
      }
      const carsObjects = allCarsResult.value.map(item => ({
        id: item.id,
        make: item.model.make.name,
        model: `${item.model.name} (${item.model.bodyType.name})`,
        engine: `${item.engineType.name} - ${item.engineCapacity}cm^3 - ${item.enginePower}KM`
      }))

      let sortedCars = carsObjects.reduce((acc, item) => {
        if (!acc) { acc = new Map() }
        if (!acc.has(item.make)) {
          acc.set(item.make, { name: item.make, models: new Map() })
        }
        if (!acc.get(item.make).models.has(item.model)) {
          acc.get(item.make).models.set(item.model, { name: item.model, variants: new Map() })
        }
        if (!acc.get(item.make).models.get(item.model).variants.has(item.engine)) {
          acc.get(item.make).models.get(item.model).variants.set(item.engine, { id: item.id, cname: item.engine, displayName: `${item.make} ${item.model} ${item.engine}` })
        }
        return acc
      }, new Map())

      sortedCars = Array.from(sortedCars, (arr) => arr[1])
      sortedCars.forEach((_, index0) => {
        sortedCars[index0].models = Array.from(sortedCars[index0].models, (arr) => arr[1])
        sortedCars[index0].models.forEach((_, index1) => {
          sortedCars[index0].models[index1].variants = Array.from(sortedCars[index0].models[index1].variants, (arr) => arr[1])
        })
      })
      allCars.value = sortedCars
    })

    const { handleSubmit, meta } = useForm({
      initialValues: {
        car: null,
        mileage: null,
        firstRegistrationDate: ''
      }
    })

    const loading = ref(false)

    const messageText = ref('')
    const { value: car, errorMessage: carError } = useField('car', yup.number().required())
    const { value: mileage, errorMessage: mileageError } = useField('mileage', yup.mixed().required())
    const { value: firstRegistrationDate, errorMessage: firstRegistrationDateError } = useField('firstRegistrationDate', yup.string().required())

    const onSubmit = handleSubmit(async (values) => {
      try {
        // const user = await signIn({ input: values })
        // const name = user?.data?.signIn?.name
        // await push({ name: 'Home' })
        console.log({ ...values })
        toast.add({ severity: 'success', summary: 'Sukces!', detail: 'Dodano nowe badanie techniczne', life: 4000 })
      } catch (e) {
        toast.add({ severity: 'error', summary: 'Błąd!', detail: 'Nieoczekiwany błąd! Skontaktuj się z administratorem', life: 4000 })
      }
    })

    return {
      car,
      carError,
      allCars,
      allCarsLoading,
      mileage,
      mileageError,
      firstRegistrationDate,
      firstRegistrationDateError,
      onSubmit,
      meta,
      loading,
      messageText
    }
  }
})

</script>

<style scoped lang="scss">
.login-title {
  font-size: 1.2em;
}
</style>
