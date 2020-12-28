<script lang="ts">
import { useQuery, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { ref, watch } from 'vue'
import { useToast } from 'primevue/usetoast'

function useApollo () {
  const toast = useToast()
  const { result: allCarsResult, loading: allCarsLoading, error: allCarsError, onError: onAllCarsError } = useQuery(gql`
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

  onAllCarsError(() => {
    toast.add({ severity: 'error', summary: 'Błąd!', detail: 'Nie udało się załadować modelów pojazdów', life: 4000 })
  })

  const allCarsOptions = ref([])

  const allCars = useResult(allCarsResult, [])

  watch(allCars, () => {
    if (!allCars.value) {
      allCarsOptions.value = []
    }
    const carsObjects = allCars.value.map(item => ({
      id: item.id,
      make: item.model.make.name,
      model: `${item.model.name} (${item.model.bodyType.name})`,
      engine: `${item.engineType.name} - ${item.engineCapacity}cm^3 - ${item.enginePower}KM`
    }))

    let sortedCars = carsObjects.reduce((acc, item) => {
      if (!acc) {
        acc = new Map()
      }
      if (!acc.has(item.make)) {
        acc.set(item.make, { name: item.make, models: new Map() })
      }
      if (!acc.get(item.make).models.has(item.model)) {
        acc.get(item.make).models.set(item.model, { name: item.model, variants: new Map() })
      }
      if (!acc.get(item.make).models.get(item.model).variants.has(item.engine)) {
        acc.get(item.make).models.get(item.model).variants.set(item.engine, {
          id: item.id,
          cname: item.engine,
          displayName: `${item.make} ${item.model} ${item.engine}`
        })
      }
      return acc
    }, new Map())

    sortedCars = Array.from(sortedCars, ([, value]) => value)
    sortedCars.forEach((_, index0) => {
      sortedCars[index0].models = Array.from(sortedCars[index0].models, ([, value]) => value)
      sortedCars[index0].models.forEach((_, index1) => {
        sortedCars[index0].models[index1].variants = Array.from(sortedCars[index0].models[index1].variants, ([, value]) => value)
      })
    })
    allCarsOptions.value = sortedCars
  })

  const { result: getAllFaults, loading: allFaultsLoading, error: allFaultsError, onError: onAllFaultsError } = useQuery(gql`
    query getAllFaults {
      getAllFaults {
        qualitativeFaults {
          id
          component
          part
          dangerLevels
        }
        quantitativeFaults {
          id
          component
          part
          description
          minValue
          maxValue
          unit
        }
      }
    }
  `)

  onAllFaultsError(() => {
    toast.add({ severity: 'error', summary: 'Błąd!', detail: 'Nie udało się załadować usterek', life: 4000 })
  })

  const qualitativeFaults = useResult(getAllFaults, [], data => data.qualitativeFaults)

  const quantitativeFaults = useResult(getAllFaults, [], data => data.quantitativeFaults)

  return {
    allCarsOptions,
    allCarsLoading,
    allCarsError,
    qualitativeFaults,
    quantitativeFaults,
    allFaultsLoading,
    allFaultsError
  }
}

export default useApollo

</script>
