<template>
  <el-upload
    ref="uploadRef"
    v-model:file-list="fileList"
    action="#"
    list-type="picture-card"
    :limit="1"
    :show-file-list="false"
    :auto-upload="false"
    :on-change="handleChange"
    :on-exceed="handleExceed"
  >
    <el-button class="blue-liner-button" style="border: 1px dashed #6B97FF">
      <el-icon style="margin-right:2px;" :size="16"><Plus /></el-icon>
      {{ t('shangChuanYiGeXinTuXiang') }}
    </el-button>
  </el-upload>
  <CopperDialog ref="copperDialogRef" :title="t('shangChuanTuBiao')" @get-url="getUrl"></CopperDialog>
</template>

<script setup lang="ts">
  import { Plus } from '@element-plus/icons-vue'
  import useCopperHook from '@/components/AvatarCopper/useCopperHook'
  const { t } = useI18n()
  const {
    uploadRef,
    currentImgUrl,
    copperDialogRef,
    fileList,
    handleChange,
    handleExceed,
    getUrl
  } = useCopperHook()
  defineExpose({
    currentImgUrl,
    fileList
  })
</script>

<style
  lang='scss'
  scoped
>
</style>
