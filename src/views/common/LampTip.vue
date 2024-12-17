<template>
  <div class="tip">
    <el-icon :size="16">
      <svg-icon icon-class="permission_lamp"></svg-icon>
    </el-icon>
    <span style="flex: 1">{{ props.info }}</span>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  info:string
}>()
</script>
<style lang='scss' scoped>
.tip{
  color:$--global--placeholder--text--color;
  font-size: 14px;
  display: flex;
  align-items: center;
  .el-icon{
    margin-right: 4px;
  }
}
</style>
