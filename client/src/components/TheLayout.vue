<template>
  <div class="layout-wrapper">
    <header class="layout-topbar p-d-flex p-ai-center p-shadow-3 p-jc-between">
      <Button icon="pi pi-bars" class="p-button-rounded p-button-outlined" @click.stop="toggleMenu"/>
      <TabMenu :model="topbarItems"></TabMenu>
    </header>
    <aside class="layout-sidebar" :class="{ active: isMenuOpen }" @click.stop>
      <Button icon="pi pi-times" class="p-button-rounded p-button-outlined exit-button p-m-2" @click.stop="toggleMenu" v-if="!isMinTablet"/>
      <Menu :model="sidebarItems" @click.stop="isMinTablet && toggleMenu"></Menu>
    </aside>
  </div>
  <main class="p-d-flex p-jc-center p-ai-center layout-content p-p-3" :class="{ active: isMenuOpen }">
    <slot />
  </main>
  <Toast position="bottom-right" />
  <ConfirmDialog />
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
    const isMinTabletRes = window.matchMedia('(min-width: 768px)')
    const isMinTablet = ref(isMinTabletRes.matches)
    const station = useStation()
    const { push } = useRouter()
    const toast = useToast()
    const isAuth = ref(false)
    const isMenuOpen = ref(isMinTabletRes.matches)

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

    const topbarItems = computed(() => [
      { label: 'Zaloguj', icon: 'pi pi-fw pi-sign-in', to: { name: 'Login' }, visible: !isAuth.value },
      { label: 'Zarejestruj', icon: 'pi pi-fw pi-user-plus', to: { name: 'Register' }, visible: !isAuth.value },
      { label: 'Wyloguj', icon: `pi pi-fw ${loading.value ? 'pi-spin pi-spinner' : 'pi-sign-out'}`, visible: isAuth.value, command: logoutFn }
    ])

    const sidebarItems = computed(() => [
      {
        label: 'Statystyki',
        items: [
          { label: 'Panel', icon: 'pi pi-fw pi-chart-bar', to: { name: 'Home' } }
        ]
      },
      {
        label: 'Badanie techniczne',
        visible: isAuth.value,
        items: [
          { label: 'Dodaj', icon: 'pi pi-fw pi-plus-circle', to: { name: 'NewInspection' } }
        ]
      }
    ])

    window.addEventListener('resize', () => {
      isMinTablet.value = isMinTabletRes.matches
    })

    window.addEventListener('click', () => {
      if (!isMinTablet.value) {
        isMenuOpen.value = false
      }
    })

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value
    }

    return { topbarItems, sidebarItems, toggleMenu, isMenuOpen, isAuth, isMinTablet }
  }
})

</script>

<style lang="scss" scoped>
.layout-topbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 997;
  background-color: var(--surface-a);
  padding: 0 35px;
  height: 70px;
}

.layout-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  background-color: var(--surface-a);
  overflow: auto;
  width: 250px;
  border-right: 1px solid var(--surface-d);
  transition: transform .4s cubic-bezier(.05,.74,.2,.99);
  z-index: 999;
  height: 100%;
  transform: translateX(-100%);

  &.active {
    transform: translateX(0);
  }

  & .p-menu {
    border: none;
  }

  @media screen and (min-width: 768px) {
    height: calc(100% - 70px);
    top: 70px;
    z-index: 995;
  }
}

.layout-content {
  margin-left: 0;
  margin-top: 70px;
  min-height: 100vh;
  transition: margin-left .4s cubic-bezier(.05,.74,.2,.99);

  @media screen and (min-width: 768px) {
    &.active {
      margin-left: 250px;
    }
  }
}

.exit-button {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
