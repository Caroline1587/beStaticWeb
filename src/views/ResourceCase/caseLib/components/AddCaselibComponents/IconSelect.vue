<template>
  <div class="icon-select-container">
    <el-image :src="allImages[path]" style="width: 48px; height: 48px"></el-image>
    <div class="icon-lib">
      <div class="flex-center">
        <span style="margin-right:10px">{{ t('xuanZeYiXiaTuBiaoHuo') }}</span>
        <CopperUpload ref="copperUploadRef"></CopperUpload>
      </div>
      <div class="icon-list">
        <span
          v-for="item in Object.keys(allImages).length"
          :key="`icon${item}`"
          :class="`icon-item ${currentImgIndex===item?'checked':''}`"
          @click="currentImgIndex=item"
        >
          <el-image :src="allImages[`icon${item}`]"></el-image>
          <label class="el-upload-list__item-status-label"><el-icon><Check /></el-icon></label>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Check } from '@element-plus/icons-vue'
  import ImageMap from '@/views/ResourceCase/caseLib/components/AddCaselibComponents/useImage'
  import CopperUpload from '@/views/ResourceCase/caseLib/components/AddCaselibComponents/CopperUpload.vue'
  import '@/styles/globalStyle/IconSelectStyle.scss'
  const copperUploadRef = ref()
  const allImages = ref<any>({ ...ImageMap })
  const currentImgIndex = ref(1)
  const path = computed(() => {
    return `icon${currentImgIndex.value}`
  })
  const { t } = useI18n()
  const file = ref<any>(null)
  watch(() => copperUploadRef.value?.currentImgUrl, (newValue:string) => {
    if (newValue) {
      currentImgIndex.value = 13
      allImages.value[path.value] = newValue
      file.value = copperUploadRef.value?.fileList[0]
    }
  })
  defineExpose({
    currentImgIndex,
    file
  })
</script>

<style
  lang='scss'
  scoped
>
</style>
