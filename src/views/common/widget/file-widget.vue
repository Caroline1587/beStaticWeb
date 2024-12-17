<template>
  <el-upload
    v-if="props.status!=='showonly'"
    ref="commonUpload"
    v-model:file-list="value"
    :class="`upload ${props.status==='editable' ? '':`is-${props.status}`}`"
    drag
    multiple
    :auto-upload="false"
    :disabled="props.status!=='editable'"
    :on-remove="fileRemove"
    :on-change="fileChange"
  >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">
      {{ t('jiangWenJianTuoDaoCiChuHuo') }}<em>{{ t('dianJiShangChuan') }}</em>
    </div>
    <template #tip>
      <div class="el-upload__tip">
        {{ t('danGeWenJianBuNengChaoGuo_400mb') }}
      </div>
    </template>
  </el-upload>
  <div v-else class="upload is-file-showonly">
    <EmptyTag v-if="value.length===0"></EmptyTag>
    <ul>
      <li
        v-for="file in value"
        :key="file.id"
        :class="`flex-center ${props.enableDownload?'':'not-download'}`"
        :style="`background-color:${props.data.backgroundColor||FIELD_BACKGROUNDCOLOR}`"
        @click="download(file.id)"
      >
        <el-icon><Document /></el-icon>
        <span class="el-upload-list__item-file-name" :title="file.name">{{ file.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
  import { FIELD_BACKGROUNDCOLOR } from '@/utils/constant'
  import { UploadFilled, Document } from '@element-plus/icons-vue'
  import { UploadProps } from 'element-plus'
  import { errorMessage } from '@/utils/message'
  import EmptyTag from '@/views/common/widget/components/EmptyTag.vue'

  const { t } = useI18n()
  const props = withDefaults(defineProps<{
    data: {
      promptText:string
      backgroundColor?:string
    }
    status?:'showonly'|'preview'|'disabled'|'editable'
    value:any,
    enableDownload?:boolean
  }>(), {
    status () {
      return 'editable'
    },
    enableDownload () {
      return true
    }
  })
  const emits = defineEmits(['update:value', 'getFileInfo', 'downloadFile'])
  const value = computed({
    get () {
      return props.value
    },
    set (val:string) {
      emits('update:value', val)
    }
  })
  const commonUpload = ref()
  const fileRemove: UploadProps['onRemove'] = (uploadFile:any) => {
    // 保存需要后端删除的文件的id
    if (uploadFile.status === 'success' && uploadFile.id) {
      emits('getFileInfo', uploadFile.id, props.data)
    }
  }
  const fileChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
    // 保存新上传的文件到newFile
    let flag = fileCheck(uploadFile, uploadFiles)
    if (!flag) {
      uploadFiles.pop()
      // commonUpload.value.handleRemove(uploadFile)
    }
  }
  const fileCheck = (uploadFile:any, uploadFiles:any) => {
    if (uploadFile.size === 0) {
      errorMessage(t('buNengShangChuanKongWenJian'))
      return false
    }
    let fileSize = Number(uploadFile.size ? uploadFile.size / 1024 / 1024 / 100 : 0)
    let fileNameList = uploadFiles.map((item:any) => item.name)
    fileNameList.pop()
    if (fileSize > 4) {
      errorMessage(t('buNengShangChuanDaXiaoChaoGuo_400mbDeWenJian'))
      return false
    } else if (fileNameList.includes(uploadFile.name)) {
      errorMessage(t('buNengShangChuanZhongMingWenJian'))
      return false
    }
    return true
  }
  const download = (id:string) => {
    if (props.enableDownload) {
      emits('downloadFile', id)
    }
  }
</script>

<style lang="scss" scoped>
.upload{
  width: 100%;
  min-height:32px;
  :deep(.el-upload-dragger){
    padding: 0;
  }
  :deep(.el-upload-list__item){
    margin-bottom: 0;
  }
  :deep(.el-upload-list){
    margin: 0;
  }
  .el-icon--upload{
    margin-bottom: 0;
  }
}
.empty-file{
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color:var(--el-text-color-regular)
}
</style>
