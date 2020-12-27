<template>
  <TabMenu :model="items"></TabMenu>
  <main class="p-d-flex p-jc-center p-ai-center main-wrapper">
    <slot />
  </main>
  <Toast position="top-right" />
</template>

<script lang="ts">
import useStation from '@/modules/useStation'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { watchEffect, ref, computed } from 'vue'

export default ({
  setup () {
    const station = useStation()
    const { push } = useRouter()
    const toast = useToast()
    const isAuth = ref(false)

    const { mutate: logout, loading } = useMutation(gql`
      mutation logout {
        logout
      }
    `)

    watchEffect(() => {
      isAuth.value = !!station?.station.value?.email
    })

    const logoutFn = async () => {
      try {
        await logout()
        await push({ name: 'Login' })
        toast.add({ severity: 'success', summary: 'Wylogowano pomyślnie!', life: 4000 })
      } catch {
        toast.add({ severity: 'error', summary: 'Wystąpił błąd!', life: 4000 })
      }
    }

    const items = computed(() => [
      { label: 'Panel', icon: 'pi pi-fw pi-chart-bar', to: '/' },
      { label: 'Badanie techniczne', icon: 'pi pi-fw pi-plus-circle', to: '/inspections/new', visible: isAuth.value },
      { label: 'Zaloguj', icon: 'pi pi-fw pi-sign-in', to: '/login', visible: !isAuth.value },
      { label: 'Zarejestruj', icon: 'pi pi-fw pi-user-plus', to: '/register', visible: !isAuth.value },
      { label: 'Wyloguj', icon: `pi pi-fw ${loading.value ? 'pi-spin pi-spinner' : 'pi-sign-out'}`, visible: isAuth.value, command: logoutFn }
    ])

    return { items, isAuth }
  }
})

</script>

<style lang="scss" scoped>
.main-wrapper {
  flex-grow: 1;
}
</style>
