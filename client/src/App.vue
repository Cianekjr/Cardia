<template>
  <div class="p-d-flex p-flex-column app-wrapper">
    <TheLayout>
      <router-view/>
    </TheLayout>
  </div>
</template>

<script lang="ts">
import TheLayout from '@/components/TheLayout.vue'
import useStation from '@/modules/useStation'

export default ({
  components: {
    TheLayout
  },
  setup () {
    const station = useStation()
    console.log('App', station)
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
