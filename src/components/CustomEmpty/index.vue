<template>
  <div class="empty-container">
    <el-empty image="./img/statementEmpty.png" :description="description||t('zanWuShuJu')" :image-size="imageSize" />
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n()
withDefaults(defineProps<{
  description?: string
  imageSize?: number
  }>(), {
  description: '',
  imageSize: 180
})

</script>

<style lang="scss" scoped>
.empty-container{
  height: 100%;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  img{
    width: 200px;
    height: 200px;
  }
  :deep(.el-empty__description){
    margin: 0;
  }
}
</style>
