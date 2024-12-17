<script setup lang="ts">
import HomePage from "@/views/HomePage.vue";
</script>

<template>
  <!-- <HomePage /> -->
  <Suspense>
    <router-view></router-view>
  </Suspense>

</template>

<style lang="scss" scoped>
</style>
