<template>
  <el-tooltip
    :effect="props.effect"
    :content="props.content"
    :placement="props.placement"
    :show-after="props.showAfter"
    v-bind="$attrs"
  >
    <slot></slot>
  </el-tooltip>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  content:string
  effect?:string
  placement?:string
  showAfter?:number
}>(), {
  effect () {
    return 'dark'
  },
  placement () {
   return 'top'
  },
  showAfter () {
    return 1000
  }
})
</script>

<style lang="scss" scoped>
</style>
