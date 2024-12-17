<template>
  <el-tag
    :style="{'backgroundColor':LABEL_COLOR[props.tagIndex % 10]+'1A', border:0, color:LABEL_COLOR[props.tagIndex % 10],'margin-right': '8px'}">
    {{ props.tagInfo }}
  </el-tag>
</template>

<script lang="ts" setup>
  import { LABEL_COLOR } from '@/utils/constant'
  const props = withDefaults(defineProps<{
    tagIndex:number
    tagInfo:string
  }>(), {})
</script>
<style
  lang='scss'
  scoped
>
</style>
