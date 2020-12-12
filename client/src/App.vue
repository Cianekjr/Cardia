<template>
  <div class="p-d-flex p-flex-column app-wrapper">
    <TheLayout>
      <router-view/>
    </TheLayout>
  </div>
</template>

<script lang="ts">
import TheLayout from '@/components/TheLayout.vue'
import useUser from '@/modules/useUser'

export default ({
  components: {
    TheLayout
  },
  setup () {
    const user = useUser()
    console.log('App', user)
  }
})

</script>

<style lang="scss">
body {
  background-color: var(--surface-b);
  font-family: var(--font-family);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
}

a {
  text-decoration: none;
}
</style>

<style lang="scss" scoped>
.app-wrapper {
  min-height: 100vh;
}
</style>
