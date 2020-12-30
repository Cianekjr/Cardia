<script lang="ts">
import { useQuery, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { computed } from 'vue'
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

  const allCarsOptions = useResult(allCarsResult, [], (data) => {
    const carsObjects = data.getAllCars.map(item => ({
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
    return sortedCars
  })

  const { result: allComponentsResult, loading: allComponentsLoading, error: allComponentsError, onError: onAllComponentsError } = useQuery(gql`
    query getAllComponents {
      getAllComponents {
        id
        name
      }
    }
  `)

  const allComponents = useResult(allComponentsResult, [])

  onAllComponentsError(() => {
    toast.add({ severity: 'error', summary: 'Błąd!', detail: 'Nie udało się załadować podzespołów', life: 4000 })
  })

  const { result: getAllFaults, loading: allFaultsLoading, error: allFaultsError, onError: onAllFaultsError } = useQuery(gql`
    query getAllFaults {
      getAllFaults {
        qualitativeFaults {
          id
          component {
            id
            name
          }
          part
          dangerLevels
          description
        }
        quantitativeFaults {
          id
          component {
            id
            name
          }
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

  const qualitativeFaults = useResult(getAllFaults, [], data => data?.getAllFaults?.qualitativeFaults)

  const quantitativeFaults = useResult(getAllFaults, [], data => data?.getAllFaults?.quantitativeFaults)

  return {
    allCarsOptions,
    allCarsLoading,
    allCarsError,
    qualitativeFaults,
    quantitativeFaults,
    allFaultsLoading,
    allFaultsError,
    allComponents,
    allComponentsLoading
  }
}

export default useApollo

</script>
