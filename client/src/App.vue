<template>
  <TheLayout>
    <router-view/>
  </TheLayout>
</template>

<script lang="ts">
import TheLayout from '@/components/TheLayout.vue'

export default ({
  components: {
    TheLayout
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

.p-fluid .p-inputnumber .p-inputnumber-input {
  width: 100% !important;
}

.p-datepicker-year {
  font-size: 1.2em;
  background-color: var(--surface-b);
  color: var(--text-color);
  border: 1px solid var(--surface-d);
}
</style>

<style lang="scss" scoped>
.app-wrapper {
  min-height: 200vh;
}
</style>
