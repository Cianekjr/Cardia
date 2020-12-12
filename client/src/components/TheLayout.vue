<template>
    <Menubar :model="items" orientation="vertical">
      <template #start>
        <Button icon="pi pi-bars" class="p-button-rounded p-button-outlined" @click="visibleLeft = true"/>
      </template>
    </Menubar>
    <main class="p-d-flex p-jc-center p-ai-center main-wrapper">
      <slot />
    </main>
    <Sidebar v-model:visible="visibleLeft">
      Content
    </Sidebar>
    <Toast position="top-right" />
</template>

<script lang="ts">
import { ref } from 'vue'

export default ({
  setup () {
    const visibleLeft = ref(false)
    const items = [
      {
        label: 'File',
        icon: 'pi pi-fw pi-file'
      },
      {
        label: 'Edit',
        icon: 'pi pi-fw pi-pencil'
      }
    ]

    return { items, visibleLeft }
  }
})

</script>

<style lang="scss" scoped>
.main-wrapper {
  flex-grow: 1;
}
</style>
